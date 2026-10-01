import { describe, it, expect } from "vitest";
import { generateAadhaarOtp, submitAadhaarOtp, verifyPanCard } from "../src/lib/kyc/surepass";
import { maskAadhaar, maskPan } from "../src/lib/utils";

describe("Surepass Identity & KYC Compliance Tests", () => {
  it("masks Aadhaar preserving only the last 4 digits (DPDP Act compliance)", () => {
    const masked = maskAadhaar("987654321012");
    expect(masked).toBe("•••• •••• 1012");
    expect(masked).not.toContain("98765432");
  });

  it("masks PAN card preserving only the first 2 and last 2 characters", () => {
    const masked = maskPan("ABCDE1234F");
    expect(masked).toBe("AB••••••4F");
    expect(masked).not.toContain("CDE123");
  });

  it("REJECTS Aadhaar OTP generation if explicit consent is false", async () => {
    const res = await generateAadhaarOtp("987654321012", false);
    expect(res.success).toBe(false);
    expect(res.message).toContain("Explicit user consent is mandatory");
  });

  it("REJECTS Aadhaar OTP generation for non-12-digit inputs", async () => {
    const res = await generateAadhaarOtp("12345", true);
    expect(res.success).toBe(false);
    expect(res.message).toContain("exactly 12 numeric digits");
  });

  it("generates sandbox OTP client successfully for valid 12-digit Aadhaar with consent", async () => {
    const res = await generateAadhaarOtp("987654321012", true);
    expect(res.success).toBe(true);
    expect(res.clientId).toBeTruthy();
    expect(res.isSandbox).toBe(true);
  });

  it("verifies OTP 123456 in sandbox mode and outputs masked Aadhaar", async () => {
    const res = await submitAadhaarOtp("sbx_client_1234", "123456", "usr_worker_test");
    expect(res.success).toBe(true);
    expect(res.kycStatus).toBe("verified");
    expect(res.maskedAadhaar).toContain("••••");
  });

  it("rejects incorrect OTP in sandbox mode", async () => {
    const res = await submitAadhaarOtp("sbx_client_1234", "999999", "usr_worker_test");
    expect(res.success).toBe(false);
    expect(res.kycStatus).toBe("rejected");
  });

  it("validates PAN format and returns masked output in sandbox mode", async () => {
    const res = await verifyPanCard("ABCDE1234F", "Ramesh Kumar", true);
    expect(res.success).toBe(true);
    expect(res.kycStatus).toBe("verified");
    expect(res.maskedPan).toBe("AB••••••4F");
  });

  it("rejects invalid PAN regex format", async () => {
    const res = await verifyPanCard("INVALID123", "Ramesh Kumar", true);
    expect(res.success).toBe(false);
    expect(res.message).toContain("Invalid PAN card format");
  });
});
