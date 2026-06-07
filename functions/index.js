const admin = require("firebase-admin");
const { defineSecret } = require("firebase-functions/params");
const { onRequest } = require("firebase-functions/v2/https");

admin.initializeApp();

const OPENAI_API_KEY = defineSecret("OPENAI_API_KEY");

const planSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "summary", "weeklyMeals", "weeklyWorkouts", "groceryList", "helpfulNotes"],
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    weeklyMeals: {
      type: "array",
      minItems: 7,
      maxItems: 7,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["day", "breakfast", "lunch", "dinner"],
        properties: {
          day: { type: "string" },
          breakfast: { type: "string" },
          lunch: { type: "string" },
          dinner: { type: "string" },
        },
      },
    },
    weeklyWorkouts: {
      type: "array",
      minItems: 7,
      maxItems: 7,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["day", "focus", "workout", "notes", "exercises"],
        properties: {
          day: { type: "string" },
          focus: { type: "string" },
          workout: { type: "string" },
          notes: { type: "string" },
          exercises: {
            type: "array",
            minItems: 0,
            maxItems: 5,
            items: {
              type: "object",
              additionalProperties: false,
              required: ["name", "prescription", "how", "easierOption"],
              properties: {
                name: { type: "string" },
                prescription: { type: "string" },
                how: { type: "string" },
                easierOption: { type: "string" },
              },
            },
          },
        },
      },
    },
    groceryList: {
      type: "object",
      additionalProperties: false,
      required: ["Produce", "Meat & Seafood", "Dairy & Eggs", "Pantry"],
      properties: {
        Produce: {
          type: "array",
          items: { type: "string" },
        },
        "Meat & Seafood": {
          type: "array",
          items: { type: "string" },
        },
        "Dairy & Eggs": {
          type: "array",
          items: { type: "string" },
        },
        Pantry: {
          type: "array",
          items: { type: "string" },
        },
      },
    },
    helpfulNotes: {
      type: "array",
      minItems: 2,
      maxItems: 5,
      items: { type: "string" },
    },
  },
};

exports.generatePersonalPlanHttp = onRequest(
  {
    region: "us-central1",
    invoker: "public",
    timeoutSeconds: 60,
    memory: "512MiB",
    secrets: [OPENAI_API_KEY],
  },
  async (request, response) => {
    applyCors(request, response);

    if (request.method === "OPTIONS") {
      response.status(204).send("");
      return;
    }

    if (request.method !== "POST") {
      response.status(405).json({ error: "Method not allowed." });
      return;
    }

    try {
      const authHeader = request.get("authorization") || "";
      const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

      if (!token) {
        response.status(401).json({ error: "Sign in before generating a plan." });
        return;
      }

      const decoded = await admin.auth().verifyIdToken(token);
      const { profile, goal } = request.body || {};

      if (!isValidProfile(profile) || typeof goal !== "string") {
        response.status(400).json({ error: "Profile and goal are required." });
        return;
      }

      const plan = await createAndSavePlan(decoded.uid, profile, goal);
      response.status(200).json(plan);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: error.message || "Could not generate the plan yet." });
    }
  },
);

async function createAndSavePlan(uid, profile, goal) {
    const userRef = admin.firestore().doc(`users/${uid}`);
    const snapshot = await userRef.get();
    const current = snapshot.exists ? snapshot.data() : {};
    const now = Date.now();
    const lastGeneratedAt = current.lastPlanGeneratedAt?.toMillis?.() || 0;

    if (lastGeneratedAt && now - lastGeneratedAt < 60 * 1000) {
    throw new Error("Please wait a moment before generating another plan.");
    }

    const bmi = profile.weightKg / (profile.heightCm / 100) ** 2;
    const prompt = buildPrompt(profile, goal, bmi);
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY.value()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        store: false,
        instructions:
          "You create conservative, practical wellness plans. You are not a doctor. Avoid medical diagnosis, aggressive weight loss, calorie targets, macros, beef, and pork.",
        input: prompt,
        max_output_tokens: 3500,
        text: {
          format: {
            type: "json_schema",
            name: "sofit_personal_plan",
            strict: true,
            schema: planSchema,
          },
        },
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
    throw new Error(`OpenAI plan generation failed: ${detail.slice(0, 240)}`);
    }

    const data = await response.json();
    const outputText = data.output_text || extractOutputText(data);
    const generatedPlan = JSON.parse(outputText);
    const serialized = JSON.stringify(generatedPlan).toLowerCase();

    if (serialized.includes("beef") || serialized.includes("pork")) {
    throw new Error("Generated plan violated the no beef/no pork rule. Please try again.");
    }

    const planWithTimestamp = {
      ...generatedPlan,
      generatedAt: new Date().toISOString(),
    };

    await userRef.set(
      {
        profile,
        goal,
        generatedPlan: planWithTimestamp,
        lastPlanGeneratedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    return planWithTimestamp;
}

function applyCors(request, response) {
  const origin = request.get("origin") || "";
  const allowedOrigin = getAllowedOrigin(origin);

  if (allowedOrigin) {
    response.set("Access-Control-Allow-Origin", allowedOrigin);
    response.set("Vary", "Origin");
  }

  response.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
  response.set("Access-Control-Max-Age", "3600");
}

function getAllowedOrigin(origin) {
  if (!origin) return "*";
  if (origin.startsWith("http://127.0.0.1:") || origin.startsWith("http://localhost:")) return origin;
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) return origin;
  return "";
}

function buildPrompt(profile, goal, bmi) {
  return `
Create a 7-day personalized plan for sofit.

User profile:
- Age: ${profile.age}
- Sex: ${profile.sex}
- Height: ${Math.round(profile.heightCm)} cm
- Weight: ${Math.round(profile.weightKg * 10) / 10} kg
- BMI: ${Math.round(bmi * 10) / 10}
- Goal: ${goal}

Plan requirements:
- Use Monday through Sunday rows.
- Meals: breakfast, lunch, dinner for every day.
- Grocery list must be grouped for HEB-style shopping departments: Produce, Meat & Seafood, Dairy & Eggs, Pantry.
- Absolutely no beef and no pork.
- Poultry, seafood, eggs, dairy, lentils, beans, nuts, and soy are okay.
- Workouts must fit a 45-year-old beginner/intermediate woman, no gym required, bodyweight and light household weights only.
- Include recovery/rest days; do not invent intense or unsafe intervals.
- If goal is weight loss and BMI is below 25, make it gentle body recomposition, energy, and strength-focused rather than aggressive weight loss.
- For every non-rest workout, include clear exercise cue cards with name, prescription, how, and easierOption.
- Keep text short enough for a mobile table.
- Include a note that this is general wellness guidance and to consult a doctor before major changes.
`;
}

function isValidProfile(profile) {
  return (
    profile &&
    typeof profile.age === "number" &&
    typeof profile.sex === "string" &&
    typeof profile.heightCm === "number" &&
    typeof profile.weightKg === "number" &&
    profile.age > 0 &&
    profile.heightCm > 0 &&
    profile.weightKg > 0
  );
}

function extractOutputText(data) {
  const chunks = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (content.type === "output_text" && content.text) chunks.push(content.text);
    }
  }
  return chunks.join("");
}
