import { describe, it, expect } from "vitest";
import { RegisterSchema, LoginSchema } from "../src/types";

describe("Authentication & RBAC Security Tests", () => {
  it("accepts a valid worker registration payload with Indian mobile and PIN code", () => {
    const validWorker = {
      fullName: "Suresh Patel",
      email: "suresh.patel@example.com",
      phoneNumber: "9876543210",
      password: "StrongPassword123!",
      preferredLanguage: "hi",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "380001",
      role: "worker" as const,
      termsAccepted: true as const,
    };

    const result = RegisterSchema.safeParse(validWorker);
    expect(result.success).toBe(true);
  });

  it("accepts a valid employer registration payload", () => {
    const validEmployer = {
      fullName: "Sunita Verma",
      email: "sunita@example.com",
      phoneNumber: "9812345678",
      password: "EmployerSecure999!",
      preferredLanguage: "en",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110001",
      role: "employer" as const,
      termsAccepted: true as const,
    };

    const result = RegisterSchema.safeParse(validEmployer);
    expect(result.success).toBe(true);
  });

  it("PREVENTS unauthorized role escalation to admin during registration", () => {
    const maliciousAdminAttempt = {
      fullName: "Hacker User",
      email: "hacker@example.com",
      phoneNumber: "9876543210",
      password: "HackedPassword123!",
      preferredLanguage: "en",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      role: "admin", // FORBIDDEN: only worker or employer allowed
      termsAccepted: true,
    };

    const result = RegisterSchema.safeParse(maliciousAdminAttempt);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors.some((e) => e.path.includes("role"))).toBe(true);
    }
  });

  it("PREVENTS unauthorized role escalation to accountant during registration", () => {
    const maliciousAccountantAttempt = {
      fullName: "Fake Accountant",
      email: "fakeacc@example.com",
      phoneNumber: "9876543210",
      password: "HackedPassword123!",
      preferredLanguage: "en",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
      role: "accountant", // FORBIDDEN
      termsAccepted: true,
    };

    const result = RegisterSchema.safeParse(maliciousAccountantAttempt);
    expect(result.success).toBe(false);
  });

  it("rejects invalid Indian phone number formats (not 10 digits starting with 6-9)", () => {
    const invalidPhone = {
      fullName: "Test User",
      email: "test@example.com",
      phoneNumber: "12345", // INVALID
      password: "ValidPassword123!",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      role: "worker" as const,
      termsAccepted: true as const,
    };

    const result = RegisterSchema.safeParse(invalidPhone);
    expect(result.success).toBe(false);
  });

  it("rejects non-6-digit Indian PIN codes", () => {
    const invalidPin = {
      fullName: "Test User",
      email: "test@example.com",
      phoneNumber: "9876543210",
      password: "ValidPassword123!",
      city: "Delhi",
      state: "Delhi",
      pincode: "110", // INVALID PIN
      role: "worker" as const,
      termsAccepted: true as const,
    };

    const result = RegisterSchema.safeParse(invalidPin);
    expect(result.success).toBe(false);
  });
});
