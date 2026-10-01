import { describe, it, expect } from "vitest";
import { JobPostSchema, APPROVED_CATEGORIES } from "../src/types";
import { categorizeJobDescription } from "../src/lib/ai/categorizer";
import { calculateHaversineDistanceKm, roundToApproxCoordinates } from "../src/lib/location/distance";

describe("Job Lifecycle & Categorization Tests", () => {
  it("validates a compliant job posting schema", () => {
    const validJob = {
      title: "Fix Leaking Bathroom Drain and Tap",
      description: "Water is continuously backing up in the bathroom sink. Need a skilled plumber with drain snake.",
      category: "Plumbing",
      skillsRequired: ["Pipe Fitting", "Tap Repair"],
      budgetAmountRupees: 650,
      budgetType: "fixed",
      workersNeeded: 1,
      workDate: "2026-10-15",
      startTime: "11:00",
      estimatedDurationHours: 2,
      address: "12 Barakhamba Lane",
      city: "New Delhi",
      pincode: "110001",
      approxLat: 28.6139,
      approxLng: 77.2090,
    };

    const res = JobPostSchema.safeParse(validJob);
    expect(res.success).toBe(true);
  });

  it("rejects jobs with unapproved categories", () => {
    const invalidCategoryJob = {
      title: "Illegal or Arbitrary Task",
      description: "Description that meets the 20 character length minimum requirement.",
      category: "Unapproved Black Market Trade",
      skillsRequired: ["Manual Labor"],
      budgetAmountRupees: 500,
      budgetType: "fixed",
      workersNeeded: 1,
      workDate: "2026-10-15",
      startTime: "11:00",
      estimatedDurationHours: 2,
      address: "12 Barakhamba Lane",
      city: "New Delhi",
      pincode: "110001",
    };

    const res = JobPostSchema.safeParse(invalidCategoryJob);
    expect(res.success).toBe(false);
  });

  it("categorizes plumbing descriptions correctly using heuristic fallback", async () => {
    const result = await categorizeJobDescription(
      "Fix Kitchen Mixer Tap",
      "Continuous water leak under the kitchen sink tap, need pipe repair and washer replacement."
    );

    expect(APPROVED_CATEGORIES).toContain(result.category);
    expect(result.category).toBe("Plumbing");
    expect(result.skills.length).toBeGreaterThan(0);
    expect(result.suggestedBudgetMinPaise).toBeGreaterThan(0);
  });

  it("categorizes electrical descriptions correctly", async () => {
    const result = await categorizeJobDescription(
      "Living Room Ceiling Fan & Inverter Switchboard",
      "Fan is sparking and short circuit on the mcb board. Need electrician with wire tester."
    );

    expect(result.category).toBe("Electrical Work");
    expect(result.confidence).toBeGreaterThanOrEqual(0.6);
  });

  it("computes accurate Haversine distance between New Delhi and Noida", () => {
    // CP New Delhi (28.6328, 77.2197) to Sector 18 Noida (28.5708, 77.3260) ~ 12-14 km
    const distanceKm = calculateHaversineDistanceKm(28.6328, 77.2197, 28.5708, 77.3260);
    expect(distanceKm).toBeGreaterThan(10);
    expect(distanceKm).toBeLessThan(16);
  });

  it("truncates coordinates to 2 decimal places for user location privacy", () => {
    const rawLat = 28.613948291;
    const rawLng = 77.209028471;
    const { approxLat, approxLng } = roundToApproxCoordinates(rawLat, rawLng);

    expect(approxLat).toBe(28.61);
    expect(approxLng).toBe(77.21);
  });
});
