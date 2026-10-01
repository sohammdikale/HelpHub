"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  UserRole,
  Job,
  JobApplication,
  WalletAccount,
  WalletTransaction,
  WithdrawalRequest,
  Conversation,
  ChatMessage,
  AppNotification,
  Dispute,
  WorkerProfile,
  JobStatus,
  ApplicationStatus,
} from "@/types";
import {
  INITIAL_USERS,
  INITIAL_JOBS,
  INITIAL_WORKER_PROFILES,
  INITIAL_APPLICATIONS,
  INITIAL_WALLETS,
  INITIAL_TRANSACTIONS,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
} from "@/lib/firebase/mockStore";
import { validateWithdrawalEligibility, processUpiWithdrawal } from "@/lib/wallet/ledger";

interface StoreContextType {
  currentUser: User | null;
  currentWorkerProfile: WorkerProfile | null;
  users: User[];
  jobs: Job[];
  applications: JobApplication[];
  conversations: Conversation[];
  messages: ChatMessage[];
  notifications: AppNotification[];
  disputes: Dispute[];
  wallet: WalletAccount | null;
  transactions: WalletTransaction[];
  withdrawals: WithdrawalRequest[];
  
  // Auth & Roles
  login: (email: string, role?: UserRole) => boolean;
  register: (userData: Partial<User> & { role: UserRole }) => boolean;
  logout: () => void;
  switchUser: (userId: string) => void;
  updateUserKyc: (status: "verified" | "pending" | "rejected") => void;

  // Job Lifecycle
  postJob: (jobData: Omit<Job, "id" | "createdAt" | "updatedAt" | "paymentStatus" | "status" | "assignedWorkerIds">) => Job;
  updateJobStatus: (jobId: string, status: JobStatus) => void;
  fundJob: (jobId: string, paymentId: string, orderId: string) => void;
  completeJobAndReleaseFunds: (jobId: string) => void;

  // Applications
  applyForJob: (jobId: string, bidAmountPaise: number, coverNote?: string) => boolean;
  updateApplicationStatus: (applicationId: string, status: ApplicationStatus) => void;

  // Wallet & Withdrawals
  requestWithdrawal: (amountPaise: number, upiId: string) => Promise<{ success: boolean; message: string }>;

  // Chat
  sendMessage: (conversationId: string, text: string) => void;
  getOrCreateConversation: (jobId: string, workerId: string, workerName: string) => Conversation;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Disputes & Admin
  createDispute: (jobId: string, reason: string, description: string) => void;
  resolveDispute: (disputeId: string, resolutionNotes: string, action: "refund_employer" | "payout_worker") => void;
  toggleUserSuspension: (userId: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEY = "helphun_state_v1";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Load initial state with SSR safety
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[0]); // Default to worker Ramesh
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [applications, setApplications] = useState<JobApplication[]>(INITIAL_APPLICATIONS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [wallets, setWallets] = useState<Record<string, WalletAccount>>(INITIAL_WALLETS);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(INITIAL_TRANSACTIONS);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.users) setUsers(parsed.users);
        if (parsed.jobs) setJobs(parsed.jobs);
        if (parsed.applications) setApplications(parsed.applications);
        if (parsed.conversations) setConversations(parsed.conversations);
        if (parsed.messages) setMessages(parsed.messages);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.wallets) setWallets(parsed.wallets);
        if (parsed.transactions) setTransactions(parsed.transactions);
        if (parsed.withdrawals) setWithdrawals(parsed.withdrawals);
        if (parsed.disputes) setDisputes(parsed.disputes);
        if (parsed.currentUserId) {
          const found = parsed.users?.find((u: User) => u.id === parsed.currentUserId);
          if (found) setCurrentUser(found);
        }
      }
    } catch {
      // Fall back to pre-seeded defaults
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          users,
          jobs,
          applications,
          conversations,
          messages,
          notifications,
          wallets,
          transactions,
          withdrawals,
          disputes,
          currentUserId: currentUser?.id,
        })
      );
    } catch {
      // Silent error handling for storage quotas
    }
  }, [users, jobs, applications, conversations, messages, notifications, wallets, transactions, withdrawals, disputes, currentUser]);

  const currentWorkerProfile = INITIAL_WORKER_PROFILES.find((p) => p.userId === currentUser?.id) || null;
  const currentWallet = currentUser ? (wallets[currentUser.id] || {
    userId: currentUser.id,
    availableBalancePaise: 0,
    pendingBalancePaise: 0,
    lockedBalancePaise: 0,
    totalEarnedPaise: 0,
    totalWithdrawnPaise: 0,
    updatedAt: new Date().toISOString(),
  }) : null;

  // ----------------------------------------------------------------------------
  // Auth Functions
  // ----------------------------------------------------------------------------
  const login = (email: string, role?: UserRole): boolean => {
    let found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found && role) {
      found = users.find((u) => u.role === role);
    }
    if (found) {
      setCurrentUser(found);
      return true;
    }
    return false;
  };

  const register = (userData: Partial<User> & { role: UserRole }): boolean => {
    const newId = `usr_${userData.role}_${Date.now()}`;
    const newUser: User = {
      id: newId,
      fullName: userData.fullName || "New Member",
      email: userData.email || `user${Date.now()}@example.com`,
      phoneNumber: userData.phoneNumber || "9876543210",
      role: userData.role,
      preferredLanguage: userData.preferredLanguage || "en",
      city: userData.city || "New Delhi",
      state: userData.state || "Delhi",
      pincode: userData.pincode || "110001",
      isKycVerified: false,
      kycStatus: "not_started",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);

    // Initialize wallet
    setWallets((prev) => ({
      ...prev,
      [newId]: {
        userId: newId,
        availableBalancePaise: 0,
        pendingBalancePaise: 0,
        lockedBalancePaise: 0,
        totalEarnedPaise: 0,
        totalWithdrawnPaise: 0,
        updatedAt: new Date().toISOString(),
      },
    }));

    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUser = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) setCurrentUser(found);
  };

  const updateUserKyc = (status: "verified" | "pending" | "rejected") => {
    if (!currentUser) return;
    const isVerified = status === "verified";
    const updated = { ...currentUser, kycStatus: status, isKycVerified: isVerified };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
  };

  // ----------------------------------------------------------------------------
  // Job Lifecycle Functions
  // ----------------------------------------------------------------------------
  const postJob = (jobData: Omit<Job, "id" | "createdAt" | "updatedAt" | "paymentStatus" | "status" | "assignedWorkerIds">): Job => {
    const newJob: Job = {
      ...jobData,
      id: `job_${Date.now()}`,
      status: "open",
      assignedWorkerIds: [],
      paymentStatus: "unpaid",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setJobs((prev) => [newJob, ...prev]);

    // Dispatch notification
    const notif: AppNotification = {
      id: `notif_${Date.now()}`,
      recipientId: jobData.employerId,
      type: "job_assigned",
      title: "Job Posted Successfully",
      message: `Your listing '${jobData.title}' is now live for nearby workers.`,
      entityId: newJob.id,
      entityType: "job",
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);

    return newJob;
  };

  const updateJobStatus = (jobId: string, status: JobStatus) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status, updatedAt: new Date().toISOString() } : j))
    );
  };

  const fundJob = (jobId: string, paymentId: string, orderId: string) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? {
              ...j,
              paymentStatus: "authorized",
              razorpayOrderId: orderId,
              razorpayPaymentId: paymentId,
              updatedAt: new Date().toISOString(),
            }
          : j
      )
    );
  };

  const completeJobAndReleaseFunds = (jobId: string) => {
    const targetJob = jobs.find((j) => j.id === jobId);
    if (!targetJob) return;

    // Mark job as completed and payment as released
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? {
              ...j,
              status: "completed",
              paymentStatus: "released",
              updatedAt: new Date().toISOString(),
            }
          : j
      )
    );

    // Atomically credit assigned worker's wallet
    const workerId = targetJob.assignedWorkerIds[0];
    if (workerId) {
      const payoutPaise = targetJob.budgetPaise;
      setWallets((prev) => {
        const workerWallet = prev[workerId] || {
          userId: workerId,
          availableBalancePaise: 0,
          pendingBalancePaise: 0,
          lockedBalancePaise: 0,
          totalEarnedPaise: 0,
          totalWithdrawnPaise: 0,
          updatedAt: new Date().toISOString(),
        };

        const newAvailable = workerWallet.availableBalancePaise + payoutPaise;
        const newTotalEarned = workerWallet.totalEarnedPaise + payoutPaise;

        return {
          ...prev,
          [workerId]: {
            ...workerWallet,
            availableBalancePaise: newAvailable,
            totalEarnedPaise: newTotalEarned,
            updatedAt: new Date().toISOString(),
          },
        };
      });

      // Record immutable ledger entry
      const tx: WalletTransaction = {
        id: `tx_${Date.now()}`,
        userId: workerId,
        type: "job_payout",
        amountPaise: payoutPaise,
        balanceAfterPaise: ((wallets[workerId]?.availableBalancePaise || 0) + payoutPaise),
        jobId: targetJob.id,
        description: `Earnings released for '${targetJob.title}'`,
        referenceId: `payout_rel_${Date.now()}`,
        status: "completed",
        createdAt: new Date().toISOString(),
      };
      setTransactions((prev) => [tx, ...prev]);

      // Notify worker
      const notif: AppNotification = {
        id: `notif_${Date.now()}`,
        recipientId: workerId,
        type: "payment_received",
        title: "Payment Credited!",
        message: `₹${(payoutPaise / 100).toFixed(2)} has been credited to your HelpHun wallet for completing '${targetJob.title}'.`,
        entityId: targetJob.id,
        entityType: "wallet",
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  // ----------------------------------------------------------------------------
  // Application State Machine
  // ----------------------------------------------------------------------------
  const applyForJob = (jobId: string, bidAmountPaise: number, coverNote?: string): boolean => {
    if (!currentUser || currentUser.role !== "worker") return false;

    // Prevent duplicate application
    const existing = applications.find((a) => a.jobId === jobId && a.workerId === currentUser.id);
    if (existing) return false;

    const newApp: JobApplication = {
      id: `app_${Date.now()}`,
      jobId,
      workerId: currentUser.id,
      workerName: currentUser.fullName,
      workerRating: currentWorkerProfile?.ratingAverage || 5.0,
      workerSkills: currentWorkerProfile?.skills || ["General Work"],
      workerKycVerified: currentUser.isKycVerified,
      bidAmountPaise,
      coverNote,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setApplications((prev) => [newApp, ...prev]);

    // Update job status to applications_review if still open
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId && j.status === "open" ? { ...j, status: "applications_review" } : j))
    );

    // Notify employer
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      const notif: AppNotification = {
        id: `notif_${Date.now()}`,
        recipientId: job.employerId,
        type: "application_received",
        title: "New Application Received",
        message: `${currentUser.fullName} applied for '${job.title}' with a bid of ₹${(bidAmountPaise / 100).toFixed(2)}.`,
        entityId: jobId,
        entityType: "application",
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    return true;
  };

  const updateApplicationStatus = (applicationId: string, status: ApplicationStatus) => {
    const targetApp = applications.find((a) => a.id === applicationId);
    if (!targetApp) return;

    setApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, status, updatedAt: new Date().toISOString() } : a))
    );

    // If application accepted -> assign job
    if (status === "accepted") {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === targetApp.jobId
            ? {
                ...j,
                status: "assigned",
                assignedWorkerIds: [targetApp.workerId],
                updatedAt: new Date().toISOString(),
              }
            : j
        )
      );

      // Create conversation
      getOrCreateConversation(targetApp.jobId, targetApp.workerId, targetApp.workerName);

      // Expire other pending applications for this job if worker limit reached
      setApplications((prev) =>
        prev.map((a) =>
          a.jobId === targetApp.jobId && a.id !== targetApp.id && a.status === "pending"
            ? { ...a, status: "expired" }
            : a
        )
      );
    }
  };

  // ----------------------------------------------------------------------------
  // Wallet & Withdrawals
  // ----------------------------------------------------------------------------
  const requestWithdrawal = async (
    amountPaise: number,
    upiId: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!currentUser || !currentWallet) {
      return { success: false, message: "User not authenticated." };
    }

    const check = validateWithdrawalEligibility(currentWallet, amountPaise, currentUser.isKycVerified, upiId);
    if (!check.eligible) {
      return { success: false, message: check.error || "Ineligible for withdrawal." };
    }

    // Atomic deduction: debit available, reserve locked
    setWallets((prev) => {
      const current = prev[currentUser.id];
      return {
        ...prev,
        [currentUser.id]: {
          ...current,
          availableBalancePaise: current.availableBalancePaise - amountPaise,
          lockedBalancePaise: current.lockedBalancePaise + amountPaise,
          updatedAt: new Date().toISOString(),
        },
      };
    });

    const withdrawalReq: WithdrawalRequest = {
      id: `wth_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.fullName,
      amountPaise,
      upiId,
      status: "processing",
      createdAt: new Date().toISOString(),
    };

    setWithdrawals((prev) => [withdrawalReq, ...prev]);

    // Dispatch payout via processor
    const payoutResult = await processUpiWithdrawal(withdrawalReq);

    if (payoutResult.success) {
      // Reconcile successful payout
      setWallets((prev) => {
        const current = prev[currentUser.id];
        return {
          ...prev,
          [currentUser.id]: {
            ...current,
            lockedBalancePaise: Math.max(0, current.lockedBalancePaise - amountPaise),
            totalWithdrawnPaise: current.totalWithdrawnPaise + amountPaise,
            updatedAt: new Date().toISOString(),
          },
        };
      });

      setWithdrawals((prev) =>
        prev.map((w) =>
          w.id === withdrawalReq.id
            ? {
                ...w,
                status: "completed",
                payoutReference: payoutResult.referenceId,
                completedAt: new Date().toISOString(),
              }
            : w
        )
      );

      const tx: WalletTransaction = {
        id: `tx_${Date.now()}`,
        userId: currentUser.id,
        type: "withdrawal_debit",
        amountPaise,
        balanceAfterPaise: currentWallet.availableBalancePaise - amountPaise,
        withdrawalId: withdrawalReq.id,
        description: `UPI Payout to ${upiId}`,
        referenceId: payoutResult.referenceId,
        status: "completed",
        createdAt: new Date().toISOString(),
      };
      setTransactions((prev) => [tx, ...prev]);

      return {
        success: true,
        message: payoutResult.message,
      };
    } else {
      // Revert funds to available balance on failure
      setWallets((prev) => {
        const current = prev[currentUser.id];
        return {
          ...prev,
          [currentUser.id]: {
            ...current,
            availableBalancePaise: current.availableBalancePaise + amountPaise,
            lockedBalancePaise: Math.max(0, current.lockedBalancePaise - amountPaise),
            updatedAt: new Date().toISOString(),
          },
        };
      });

      setWithdrawals((prev) =>
        prev.map((w) =>
          w.id === withdrawalReq.id
            ? {
                ...w,
                status: "failed",
                failureReason: payoutResult.message,
              }
            : w
        )
      );

      return {
        success: false,
        message: `Payout failed: ${payoutResult.message}. Funds have been safely restored to your balance.`,
      };
    }
  };

  // ----------------------------------------------------------------------------
  // Real-Time Chat
  // ----------------------------------------------------------------------------
  const getOrCreateConversation = (jobId: string, workerId: string, workerName: string): Conversation => {
    const existing = conversations.find((c) => c.jobId === jobId && c.workerId === workerId);
    if (existing) return existing;

    const job = jobs.find((j) => j.id === jobId);
    const newConv: Conversation = {
      id: `conv_${Date.now()}`,
      jobId,
      jobTitle: job?.title || "Job Chat",
      employerId: job?.employerId || "usr_employer_1",
      employerName: job?.employerName || "Employer",
      workerId,
      workerName,
      lastMessage: "Conversation opened.",
      lastMessageTimestamp: new Date().toISOString(),
      unreadCountEmployer: 0,
      unreadCountWorker: 0,
    };

    setConversations((prev) => [newConv, ...prev]);
    return newConv;
  };

  const sendMessage = (conversationId: string, text: string) => {
    if (!currentUser || !text.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      read: false,
    };

    setMessages((prev) => [...prev, newMsg]);

    // Update conversation snippet
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: text.trim(),
              lastMessageTimestamp: new Date().toISOString(),
            }
          : c
      )
    );
  };

  // ----------------------------------------------------------------------------
  // Notifications
  // ----------------------------------------------------------------------------
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // ----------------------------------------------------------------------------
  // Disputes & Admin Moderation
  // ----------------------------------------------------------------------------
  const createDispute = (jobId: string, reason: string, description: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job || !currentUser) return;

    const otherParticipantId = currentUser.role === "employer" ? job.assignedWorkerIds[0] || "worker" : job.employerId;
    const otherParticipantName = currentUser.role === "employer" ? "Worker" : job.employerName;

    const newDispute: Dispute = {
      id: `disp_${Date.now()}`,
      jobId,
      jobTitle: job.title,
      initiatorId: currentUser.id,
      initiatorName: currentUser.fullName,
      initiatorRole: currentUser.role as "employer" | "worker",
      respondentId: otherParticipantId,
      respondentName: otherParticipantName,
      reason,
      description,
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDisputes((prev) => [newDispute, ...prev]);

    // Mark job status as disputed
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: "disputed", updatedAt: new Date().toISOString() } : j))
    );
  };

  const resolveDispute = (
    disputeId: string,
    resolutionNotes: string,
    action: "refund_employer" | "payout_worker"
  ) => {
    setDisputes((prev) =>
      prev.map((d) =>
        d.id === disputeId
          ? {
              ...d,
              status: "resolved",
              resolutionNotes,
              updatedAt: new Date().toISOString(),
            }
          : d
      )
    );

    const targetDispute = disputes.find((d) => d.id === disputeId);
    if (targetDispute) {
      if (action === "payout_worker") {
        completeJobAndReleaseFunds(targetDispute.jobId);
      } else {
        setJobs((prev) =>
          prev.map((j) =>
            j.id === targetDispute.jobId
              ? { ...j, status: "cancelled", paymentStatus: "refunded", updatedAt: new Date().toISOString() }
              : j
          )
        );
      }
    }
  };

  const toggleUserSuspension = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === "active" ? "suspended" : "active", updatedAt: new Date().toISOString() }
          : u
      )
    );
  };

  return (
    <StoreContext.Provider
      value={{
        currentUser,
        currentWorkerProfile,
        users,
        jobs,
        applications,
        conversations,
        messages,
        notifications,
        disputes,
        wallet: currentWallet,
        transactions,
        withdrawals,
        login,
        register,
        logout,
        switchUser,
        updateUserKyc,
        postJob,
        updateJobStatus,
        fundJob,
        completeJobAndReleaseFunds,
        applyForJob,
        updateApplicationStatus,
        requestWithdrawal,
        sendMessage,
        getOrCreateConversation,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        createDispute,
        resolveDispute,
        toggleUserSuspension,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
