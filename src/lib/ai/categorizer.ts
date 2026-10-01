import { APPROVED_CATEGORIES, type JobCategory } from "@/types";

export interface AICategorizationResult {
  category: JobCategory;
  skills: string[];
  summary: string;
  keywords: string[];
  suggestedBudgetMinPaise: number;
  suggestedBudgetMaxPaise: number;
  confidence: number; // 0.0 to 1.0
  source: "gemini" | "heuristic_fallback";
}

/**
 * Heuristic keyword dictionary used as a safe fallback when Gemini API key is missing or offline.
 */
const KEYWORD_MAP: Record<JobCategory, { keywords: string[]; skills: string[]; baseMin: number; baseMax: number }> = {
  "Plumbing": {
    keywords: ["pipe", "leak", "tap", "sink", "drain", "water", "toilet", "flush", "faucet", "tank", "plumber"],
    skills: ["Pipe Fitting", "Tap Repair", "Drain Unclogging", "Sanitary Installation"],
    baseMin: 35000,
    baseMax: 100000,
  },
  "Electrical Work": {
    keywords: ["wire", "switch", "fan", "light", "fuse", "short circuit", "socket", "geyser", "inverter", "mcb", "electrician"],
    skills: ["Wiring", "Switchboard Repair", "Fan Installation", "Appliance Inspection"],
    baseMin: 30000,
    baseMax: 90000,
  },
  "Home Cleaning": {
    keywords: ["clean", "mop", "sweep", "dust", "deep cleaning", "bathroom", "kitchen", "sofa", "vacuum", "maid"],
    skills: ["Deep Cleaning", "Floor Mopping", "Kitchen Degreasing", "Bathroom Sanitization"],
    baseMin: 40000,
    baseMax: 150000,
  },
  "Carpentry": {
    keywords: ["wood", "door", "table", "chair", "furniture", "hinge", "lock", "cabinet", "shelf", "carpenter"],
    skills: ["Furniture Assembly", "Lock Repair", "Door Alignment", "Wood Polishing"],
    baseMin: 45000,
    baseMax: 120000,
  },
  "Painting": {
    keywords: ["paint", "brush", "wall", "color", "primer", "waterproof", "distemper", "whitewash", "painter"],
    skills: ["Wall Painting", "Primer Application", "Waterproofing", "Patch Plastering"],
    baseMin: 80000,
    baseMax: 300000,
  },
  "Delivery": {
    keywords: ["deliver", "courier", "parcel", "pickup", "drop", "bring", "package", "errand", "groceries"],
    skills: ["Two-Wheeler Driving", "Parcel Handling", "Route Navigation", "Timely Delivery"],
    baseMin: 15000,
    baseMax: 50000,
  },
  "Moving and Packing": {
    keywords: ["shift", "move", "pack", "boxes", "relocation", "truck", "tempo", "luggage", "heavy"],
    skills: ["Heavy Lifting", "Bubble Wrapping", "Furniture Loading", "Unpacking"],
    baseMin: 100000,
    baseMax: 400000,
  },
  "Gardening": {
    keywords: ["plant", "garden", "lawn", "grass", "trim", "pot", "soil", "watering", "fertilizer", "gardener"],
    skills: ["Pruning", "Lawn Mowing", "Soil Preparation", "Plant Health"],
    baseMin: 35000,
    baseMax: 80000,
  },
  "Cooking": {
    keywords: ["cook", "chef", "food", "meal", "roti", "curry", "dinner", "lunch", "breakfast", "kitchen"],
    skills: ["North Indian Cooking", "South Indian Cooking", "Meal Prep", "Kitchen Hygiene"],
    baseMin: 50000,
    baseMax: 150000,
  },
  "Tutoring": {
    keywords: ["tutor", "teach", "math", "science", "english", "homework", "school", "exam", "student", "class"],
    skills: ["Subject Mentoring", "Conceptual Clarity", "Test Prep", "Homework Assistance"],
    baseMin: 40000,
    baseMax: 120000,
  },
  "Computer and Technical Support": {
    keywords: ["laptop", "computer", "wifi", "router", "printer", "software", "windows", "slow", "virus", "tech"],
    skills: ["OS Reinstallation", "Printer Setup", "Wi-Fi Troubleshooting", "Data Recovery"],
    baseMin: 40000,
    baseMax: 120000,
  },
  "Event Assistance": {
    keywords: ["event", "party", "wedding", "decoration", "catering", "usher", "host", "help", "gathering"],
    skills: ["Guest Management", "Decor Setup", "Food Serving", "Stage Coordination"],
    baseMin: 50000,
    baseMax: 180000,
  },
  "Personal Assistance": {
    keywords: ["assist", "elderly", "queue", "bill payment", "shopping", "care", "companion", "escort"],
    skills: ["Errand Running", "Elderly Care Support", "Communication", "Time Management"],
    baseMin: 40000,
    baseMax: 100000,
  },
  "Other Services": {
    keywords: ["other", "general", "miscellaneous", "fix", "repair"],
    skills: ["General Assistance", "Manual Labor"],
    baseMin: 30000,
    baseMax: 80000,
  },
};

/**
 * Categorize job description using Google Gemini API or intelligent heuristic fallback.
 */
export async function categorizeJobDescription(
  title: string,
  description: string
): Promise<AICategorizationResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  const combinedText = `${title}\n${description}`.trim();

  if (apiKey && apiKey.trim().length > 10) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are an AI assistant for HelpHun, an Indian hyperlocal micro-job marketplace.
Classify the following job posting into one of these EXACT categories:
${APPROVED_CATEGORIES.join(", ")}

Respond STRICTLY in JSON format without markdown code blocks:
{
  "category": "one of the exact categories listed above",
  "skills": ["skill 1", "skill 2", "skill 3"],
  "summary": "1 concise sentence summary",
  "keywords": ["keyword 1", "keyword 2"],
  "suggestedBudgetMinRupees": 300,
  "suggestedBudgetMaxRupees": 800,
  "confidence": 0.95
}

Job Title: ${title}
Job Description: ${description}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: "application/json",
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          const validCategory = APPROVED_CATEGORIES.includes(parsed.category)
            ? (parsed.category as JobCategory)
            : fallbackClassify(combinedText).category;

          return {
            category: validCategory,
            skills: Array.isArray(parsed.skills) ? parsed.skills.slice(0, 5) : ["General Assistance"],
            summary: parsed.summary || title,
            keywords: Array.isArray(parsed.keywords) ? parsed.keywords.slice(0, 6) : [],
            suggestedBudgetMinPaise: (parsed.suggestedBudgetMinRupees || 300) * 100,
            suggestedBudgetMaxPaise: (parsed.suggestedBudgetMaxRupees || 800) * 100,
            confidence: Math.min(Math.max(parsed.confidence || 0.9, 0.5), 1.0),
            source: "gemini",
          };
        }
      }
    } catch {
      // Fallback silently if network or API key issues arise
    }
  }

  // Graceful rule-based heuristic fallback
  return fallbackClassify(combinedText);
}

function fallbackClassify(text: string): AICategorizationResult {
  const lower = text.toLowerCase();
  let bestCategory: JobCategory = "Other Services";
  let maxMatches = 0;

  for (const [category, data] of Object.entries(KEYWORD_MAP)) {
    const matches = data.keywords.reduce((acc, kw) => (lower.includes(kw) ? acc + 1 : acc), 0);
    if (matches > maxMatches) {
      maxMatches = matches;
      bestCategory = category as JobCategory;
    }
  }

  const categoryMeta = KEYWORD_MAP[bestCategory];
  return {
    category: bestCategory,
    skills: categoryMeta.skills,
    summary: text.slice(0, 100).trim() + (text.length > 100 ? "..." : ""),
    keywords: categoryMeta.keywords.slice(0, 4),
    suggestedBudgetMinPaise: categoryMeta.baseMin,
    suggestedBudgetMaxPaise: categoryMeta.baseMax,
    confidence: maxMatches > 0 ? Math.min(0.7 + maxMatches * 0.05, 0.95) : 0.6,
    source: "heuristic_fallback",
  };
}
