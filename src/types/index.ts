import { z } from "zod";

// ==============================================================================
// 1. Roles & Permissions
// ==============================================================================
export type UserRole = "worker" | "employer" | "accountant" | "admin";

export type KycStatus =
  | "not_started"
  | "pending"
  | "verified"
  | "rejected"
  | "manual_review"
  | "expired";

export type AccountStatus = "active" | "suspended" | "deleted";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  preferredLanguage: string;
  city: string;
  state: string;
  pincode: string;
  isKycVerified: boolean;
  kycStatus: KycStatus;
  status: AccountStatus;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ==============================================================================
// 2. Worker & Employer Profiles
// ==============================================================================
export interface WorkerProfile {
  userId: string;
  fullName: string;
  skills: string[];
  categories: string[];
  bio: string;
  avatarUrl?: string;
  hourlyRatePaise: number;
  workRadiusKm: number;
  workingHours: {
    start: string; // "09:00"
    end: string;   // "18:00"
  };
  isAvailable: boolean;
  completedJobsCount: number;
  ratingAverage: number;
  ratingCount: number;
  location: {
    lat: number;
    lng: number;
    approxArea: string;
    city: string;
    pincode: string;
  };
  kycStatus: KycStatus;
  verifiedAt?: string;
}

export interface EmployerProfile {
  userId: string;
  fullName: string;
  companyName?: string;
  avatarUrl?: string;
  contactEmail: string;
  contactPhone: string;
  city: string;
  state: string;
  pincode: string;
  postedJobsCount: number;
  ratingAverage: number;
  ratingCount: number;
}

// ==============================================================================
// 3. Job Lifecycle & State Machine
// ==============================================================================
export type JobStatus =
  | "draft"
  | "open"
  | "applications_review"
  | "assigned"
  | "in_progress"
  | "awaiting_completion"
  | "completed"
  | "cancelled"
  | "disputed";

export type BudgetType = "fixed" | "hourly";

export type PaymentStatus =
  | "unpaid"
  | "authorized"
  | "captured"
  | "released"
  | "refunded";

export const APPROVED_CATEGORIES = [
  "Home Cleaning",
  "Plumbing",
  "Electrical Work",
  "Carpentry",
  "Painting",
  "Delivery",
  "Moving and Packing",
  "Gardening",
  "Cooking",
  "Tutoring",
  "Computer and Technical Support",
  "Event Assistance",
  "Personal Assistance",
  "Other Services",
] as const;

export type JobCategory = (typeof APPROVED_CATEGORIES)[number];

export interface Job {
  id: string;
  employerId: string;
  employerName: string;
  employerRating?: number;
  title: string;
  description: string;
  category: JobCategory;
  skillsRequired: string[];
  budgetPaise: number;
  budgetType: BudgetType;
  workersNeeded: number;
  assignedWorkerIds: string[];
  status: JobStatus;
  workDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  estimatedDurationHours: number;
  specialInstructions?: string;
  location: {
    address: string;
    city: string;
    pincode: string;
    approxLat: number;
    approxLng: number;
  };
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
  updatedAt: string;
}

// ==============================================================================
// 4. Applications State Machine
// ==============================================================================
export type ApplicationStatus =
  | "pending"
  | "shortlisted"
  | "offered"
  | "accepted"
  | "rejected"
  | "withdrawn"
  | "expired";

export interface JobApplication {
  id: string;
  jobId: string;
  workerId: string;
  workerName: string;
  workerRating: number;
  workerSkills: string[];
  workerKycVerified: boolean;
  bidAmountPaise: number;
  estimatedHours?: number;
  coverNote?: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

// ==============================================================================
// 5. Financial Ledger & Wallet
// ==============================================================================
export interface WalletAccount {
  userId: string;
  availableBalancePaise: number;
  pendingBalancePaise: number;
  lockedBalancePaise: number;
  totalEarnedPaise: number;
  totalWithdrawnPaise: number;
  updatedAt: string;
}

export type TransactionType =
  | "job_payout"
  | "withdrawal_debit"
  | "withdrawal_refund"
  | "platform_fee"
  | "adjustment";

export type TransactionStatus = "pending" | "completed" | "failed" | "reversed";

export interface WalletTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  amountPaise: number;
  balanceAfterPaise: number;
  jobId?: string;
  withdrawalId?: string;
  description: string;
  referenceId: string;
  status: TransactionStatus;
  createdAt: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  amountPaise: number;
  upiId: string;
  status: "pending" | "processing" | "completed" | "failed";
  payoutReference?: string;
  failureReason?: string;
  createdAt: string;
  completedAt?: string;
}

// ==============================================================================
// 6. Real-Time Chat & Messages
// ==============================================================================
export interface Conversation {
  id: string;
  jobId: string;
  jobTitle: string;
  employerId: string;
  employerName: string;
  workerId: string;
  workerName: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCountEmployer: number;
  unreadCountWorker: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  attachmentUrl?: string;
  createdAt: string;
  read: boolean;
}

// ==============================================================================
// 7. Identity & KYC (Surepass)
// ==============================================================================
export interface KycRecord {
  userId: string;
  documentType: "aadhaar" | "pan";
  maskedId: string; // e.g. "XXXXXXXX1234"
  holderName: string;
  status: KycStatus;
  provider: "surepass";
  verificationId: string;
  verifiedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

// ==============================================================================
// 8. Reviews, Reports & Disputes
// ==============================================================================
export interface Review {
  id: string;
  jobId: string;
  authorId: string;
  authorName: string;
  authorRole: "employer" | "worker";
  targetUserId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface Dispute {
  id: string;
  jobId: string;
  jobTitle: string;
  initiatorId: string;
  initiatorName: string;
  initiatorRole: "employer" | "worker";
  respondentId: string;
  respondentName: string;
  reason: string;
  description: string;
  status: "open" | "under_review" | "resolved" | "rejected";
  resolutionNotes?: string;
  evidenceUrls?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: "user" | "job" | "message";
  targetId: string;
  reason: string;
  details?: string;
  status: "pending" | "reviewed" | "dismissed" | "action_taken";
  createdAt: string;
}

// ==============================================================================
// 9. In-App Notifications
// ==============================================================================
export type NotificationType =
  | "application_received"
  | "application_status_update"
  | "job_offer"
  | "job_assigned"
  | "job_started"
  | "job_completed"
  | "payment_received"
  | "withdrawal_status"
  | "new_message"
  | "kyc_update"
  | "dispute_update"
  | "security_alert";

export interface AppNotification {
  id: string;
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  entityId?: string;
  entityType?: "job" | "application" | "wallet" | "chat" | "kyc" | "dispute";
  read: boolean;
  createdAt: string;
}

// ==============================================================================
// 10. Audit Logs & Platform Settings
// ==============================================================================
export interface AuditLog {
  id: string;
  actorId: string;
  actorEmail?: string;
  actorRole: UserRole;
  action: string;
  resourceType: string;
  resourceId: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}

// ==============================================================================
// 11. Zod Validation Schemas
// ==============================================================================
export const RegisterSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  preferredLanguage: z.string().default("en"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Must be a valid 6-digit Indian PIN code"),
  role: z.enum(["worker", "employer"], {
    errorMap: () => ({ message: "Only worker or employer accounts can be registered" }),
  }),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and privacy policy" }),
  }),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const JobPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(120),
  description: z.string().min(20, "Please provide a detailed description (at least 20 chars)").max(2000),
  category: z.enum(APPROVED_CATEGORIES, {
    errorMap: () => ({ message: "Please select an approved category" }),
  }),
  skillsRequired: z.array(z.string()).min(1, "Add at least one skill requirement").max(10),
  budgetAmountRupees: z.coerce.number().min(50, "Minimum budget is ₹50").max(100000, "Maximum budget is ₹1,00,000"),
  budgetType: z.enum(["fixed", "hourly"]),
  workersNeeded: z.coerce.number().int().min(1).max(10).default(1),
  workDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Work date must be in YYYY-MM-DD format"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Start time must be HH:MM"),
  estimatedDurationHours: z.coerce.number().min(0.5).max(48).default(2),
  specialInstructions: z.string().max(500).optional(),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  pincode: z.string().regex(/^\d{6}$/, "Must be a valid 6-digit PIN code"),
  approxLat: z.number().optional().default(28.6139), // Default New Delhi
  approxLng: z.number().optional().default(77.2090),
});
