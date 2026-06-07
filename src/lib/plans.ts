export type GoalKey = "strength" | "cardio" | "flexibility" | "health" | "weightloss";

export type AnimationKey =
  | "squat"
  | "pushup"
  | "bridge"
  | "birddog"
  | "stepup"
  | "calf"
  | "plank"
  | "leglift"
  | "row"
  | "press"
  | "curl"
  | "deadbug"
  | "walk"
  | "stretch";

export type Exercise = {
  nm: string;
  rx: string;
  how: string;
  anim: AnimationKey;
};

export type Plan = {
  icon: string;
  title: string;
  short: string;
  eyebrow: string;
  sub: string;
  workout: Array<{
    day: string;
    ex: Exercise[];
  }>;
};

export type Nutrition = {
  sub: string;
  groups: Record<string, string[]>;
  meals: Array<[string, string]>;
  note: string;
};

export const goalOrder: GoalKey[] = ["strength", "cardio", "flexibility", "health", "weightloss"];

export const PLANS: Record<GoalKey, Plan> = {
  strength: {
    icon: "💪",
    title: "Build Strength",
    short: "Strength",
    eyebrow: "Strong & capable",
    sub: "3 days a week. Rest a day between sessions. Bone and muscle health matter most after 45 — this keeps you strong.",
    workout: [
      {
        day: "Day 1 — Full Body",
        ex: [
          { nm: "Bodyweight Squats", rx: "3 × 10", how: "Stand tall, sit back like into a chair, knees over toes, stand up.", anim: "squat" },
          { nm: "Wall or Knee Push-ups", rx: "3 × 8", how: "Hands on wall or knees on floor; lower chest, push back up.", anim: "pushup" },
          { nm: "Glute Bridges", rx: "3 × 12", how: "Lie on back, knees bent, lift hips, squeeze, lower slowly.", anim: "bridge" },
          { nm: "Bird-Dog", rx: "3 × 8/side", how: "On hands & knees, extend opposite arm and leg, hold 2 sec.", anim: "birddog" },
        ],
      },
      {
        day: "Day 2 — Lower & Core",
        ex: [
          { nm: "Step-ups (stair/box)", rx: "3 × 10/leg", how: "Step up onto a stair, drive through heel, step down with control.", anim: "stepup" },
          { nm: "Standing Calf Raises", rx: "3 × 15", how: "Rise onto toes, pause, lower slowly. Hold a counter for balance.", anim: "calf" },
          { nm: "Plank", rx: "3 × 20 sec", how: "Forearms down, body in a straight line, squeeze belly.", anim: "plank" },
          { nm: "Side-Lying Leg Lifts", rx: "3 × 12/side", how: "Lie on side, lift top leg up and down with control.", anim: "leglift" },
        ],
      },
      {
        day: "Day 3 — Upper & Pull",
        ex: [
          { nm: "Dumbbell/Water-jug Rows", rx: "3 × 10/arm", how: "Hinge forward, pull weight to ribs, lower slowly.", anim: "row" },
          { nm: "Overhead Press", rx: "3 × 10", how: "Press light dumbbells (or cans) straight overhead, lower.", anim: "press" },
          { nm: "Bicep Curls", rx: "3 × 12", how: "Curl weights up to shoulders, lower slowly.", anim: "curl" },
          { nm: "Dead Bug", rx: "3 × 8/side", how: "On back, lower opposite arm & leg, return. Keep low back down.", anim: "deadbug" },
        ],
      },
    ],
  },
  cardio: {
    icon: "🫀",
    title: "Improve Cardio",
    short: "Cardio",
    eyebrow: "Energy & endurance",
    sub: "4 days a week. Mix easy and brisk efforts. Talk-test: brisk = you can talk but not sing.",
    workout: [
      {
        day: "Day 1 — Brisk Walk",
        ex: [{ nm: "Walk", rx: "30 min", how: "Steady brisk pace. Add a slight incline or hill if you can.", anim: "walk" }],
      },
      {
        day: "Day 2 — Intervals",
        ex: [
          { nm: "Warm-up walk", rx: "5 min", how: "Easy, loosen up.", anim: "walk" },
          { nm: "Fast / Easy intervals", rx: "8 rounds", how: "1 min brisk (almost jogging), 1 min easy. Repeat 8 times.", anim: "walk" },
          { nm: "Cool-down walk", rx: "5 min", how: "Slow it down, let your breath settle.", anim: "walk" },
        ],
      },
      {
        day: "Day 3 — Steady Cardio",
        ex: [{ nm: "Walk, cycle, or swim", rx: "35 min", how: "Comfortable continuous pace you can hold the whole time.", anim: "walk" }],
      },
      {
        day: "Day 4 — Walk + Strength touch",
        ex: [
          { nm: "Brisk walk", rx: "20 min", how: "Steady pace.", anim: "walk" },
          { nm: "Bodyweight Squats", rx: "2 × 12", how: "Sit back and stand; keeps legs strong for cardio.", anim: "squat" },
          { nm: "Glute Bridges", rx: "2 × 12", how: "Lift hips, squeeze, lower slowly.", anim: "bridge" },
        ],
      },
    ],
  },
  flexibility: {
    icon: "🧘",
    title: "Increase Flexibility",
    short: "Flexibility",
    eyebrow: "Mobile & loose",
    sub: "Daily if you like — it's gentle. Move slowly, never bounce, breathe into each stretch. Hold 30 sec each.",
    workout: [
      {
        day: "Morning — Wake Up",
        ex: [
          { nm: "Cat-Cow", rx: "8 slow", how: "On hands & knees, arch then round your back with your breath.", anim: "stretch" },
          { nm: "Standing Forward Fold", rx: "30 sec", how: "Hinge at hips, let arms and head hang. Soft knees.", anim: "stretch" },
          { nm: "Neck & Shoulder Rolls", rx: "5 each way", how: "Slow circles to release tension.", anim: "stretch" },
        ],
      },
      {
        day: "Anytime — Lower Body",
        ex: [
          { nm: "Seated Hamstring Stretch", rx: "30 sec/leg", how: "Sit, reach toward one foot, keep back long.", anim: "stretch" },
          { nm: "Figure-4 Hip Stretch", rx: "30 sec/side", how: "Lie down, ankle on opposite knee, draw thigh toward you.", anim: "stretch" },
          { nm: "Standing Quad Stretch", rx: "30 sec/side", how: "Hold a wall, grab one ankle behind you, knees together.", anim: "stretch" },
        ],
      },
      {
        day: "Evening — Unwind",
        ex: [
          { nm: "Child's Pose", rx: "60 sec", how: "Kneel, sit hips back, reach arms forward, relax.", anim: "stretch" },
          { nm: "Seated Spinal Twist", rx: "30 sec/side", how: "Sit tall, twist gently, look over your shoulder.", anim: "stretch" },
          { nm: "Chest Opener (doorway)", rx: "30 sec", how: "Forearm on door frame, step forward to feel the stretch.", anim: "stretch" },
        ],
      },
    ],
  },
  health: {
    icon: "🌿",
    title: "General Health",
    short: "General health",
    eyebrow: "Balanced & well",
    sub: "4 days a week, a little of everything — strength, movement, and stretching. Sustainable and easy to keep up.",
    workout: [
      {
        day: "Day 1 — Strength",
        ex: [
          { nm: "Bodyweight Squats", rx: "3 × 12", how: "Sit back like into a chair, stand tall.", anim: "squat" },
          { nm: "Knee or Wall Push-ups", rx: "3 × 10", how: "Lower chest, push back up with control.", anim: "pushup" },
          { nm: "Glute Bridges", rx: "3 × 12", how: "Lift hips, squeeze, lower slowly.", anim: "bridge" },
        ],
      },
      {
        day: "Day 2 — Cardio",
        ex: [{ nm: "Brisk Walk", rx: "30 min", how: "Pace where you can talk but not sing.", anim: "walk" }],
      },
      {
        day: "Day 3 — Strength + Core",
        ex: [
          { nm: "Step-ups", rx: "3 × 10/leg", how: "Step onto a stair, drive through the heel.", anim: "stepup" },
          { nm: "Overhead Press", rx: "3 × 10", how: "Press light weights overhead, lower slowly.", anim: "press" },
          { nm: "Plank", rx: "3 × 20 sec", how: "Straight line head to heels, squeeze belly.", anim: "plank" },
        ],
      },
      {
        day: "Day 4 — Walk + Stretch",
        ex: [
          { nm: "Easy Walk", rx: "25 min", how: "Relaxed, enjoyable pace.", anim: "walk" },
          { nm: "Full-body Stretch", rx: "10 min", how: "Hamstrings, hips, chest, and shoulders — hold 30 sec each.", anim: "stretch" },
        ],
      },
    ],
  },
  weightloss: {
    icon: "🍃",
    title: "Weight Loss",
    short: "Weight loss",
    eyebrow: "Lean & energized",
    sub: "4 days a week: cardio to burn, strength to keep muscle. The nutrition list does most of the work here — protein and veg keep you full.",
    workout: [
      {
        day: "Day 1 — Cardio + Core",
        ex: [
          { nm: "Brisk Walk", rx: "35 min", how: "Steady brisk pace; add hills if you can.", anim: "walk" },
          { nm: "Plank", rx: "3 × 25 sec", how: "Straight line, squeeze belly.", anim: "plank" },
        ],
      },
      {
        day: "Day 2 — Full-Body Strength",
        ex: [
          { nm: "Squats", rx: "3 × 12", how: "Sit back and stand; add a weight to make it harder.", anim: "squat" },
          { nm: "Rows (jug/dumbbell)", rx: "3 × 10/arm", how: "Hinge, pull to ribs, lower slowly.", anim: "row" },
          { nm: "Glute Bridges", rx: "3 × 15", how: "Lift hips, squeeze, lower.", anim: "bridge" },
        ],
      },
      {
        day: "Day 3 — Intervals",
        ex: [
          { nm: "Warm-up walk", rx: "5 min", how: "Easy pace.", anim: "walk" },
          { nm: "Brisk / Easy intervals", rx: "10 rounds", how: "1 min fast, 1 min easy. Repeat 10 times.", anim: "walk" },
          { nm: "Cool-down", rx: "5 min", how: "Slow walk to finish.", anim: "walk" },
        ],
      },
      {
        day: "Day 4 — Strength + Walk",
        ex: [
          { nm: "Step-ups", rx: "3 × 12/leg", how: "Step up, drive through heel.", anim: "stepup" },
          { nm: "Overhead Press", rx: "3 × 10", how: "Press light weights overhead.", anim: "press" },
          { nm: "Easy Walk", rx: "20 min", how: "Relaxed pace to finish.", anim: "walk" },
        ],
      },
    ],
  },
};

export const NUTRITION: Record<GoalKey, Nutrition> = {
  strength: {
    sub: "Protein-forward to build and hold muscle. Eat protein at each meal.",
    groups: {
      Produce: ["Spinach", "Sweet potatoes", "Broccoli", "Bell peppers", "Bananas", "Avocados", "Berries"],
      "Meat & Seafood": ["Chicken breast", "Ground turkey", "Salmon fillets", "Tilapia"],
      "Dairy & Eggs": ["Eggs (large)", "Greek yogurt, plain", "Cottage cheese", "Milk or fortified soy milk"],
      Pantry: ["Old-fashioned oats", "Brown rice", "Quinoa", "Black beans", "Lentils", "Almonds", "Peanut butter", "Olive oil"],
    },
    meals: [
      ["Breakfast", "Greek yogurt + berries + oats + a spoon of peanut butter"],
      ["Lunch", "Chicken + brown rice + broccoli, olive oil drizzle"],
      ["Dinner", "Salmon + sweet potato + spinach"],
      ["Snack", "Cottage cheese + banana, or a handful of almonds"],
    ],
    note: "Aim for a palm-sized protein at each meal. Protein after workouts helps muscle repair.",
  },
  cardio: {
    sub: "Steady energy from whole carbs, plus enough protein to recover.",
    groups: {
      Produce: ["Bananas", "Oranges", "Berries", "Spinach", "Carrots", "Bell peppers", "Sweet potatoes"],
      "Meat & Seafood": ["Chicken breast", "Tilapia", "Salmon fillets"],
      "Dairy & Eggs": ["Eggs (large)", "Greek yogurt, plain", "Milk or fortified soy milk"],
      Pantry: ["Old-fashioned oats", "Brown rice", "Whole-grain bread", "Black beans", "Almonds", "Honey", "Olive oil"],
    },
    meals: [
      ["Breakfast", "Oatmeal + banana + honey + a few almonds"],
      ["Lunch", "Chicken + brown rice + carrots and peppers"],
      ["Dinner", "Tilapia + sweet potato + spinach"],
      ["Snack", "Greek yogurt + berries, or fruit before a workout"],
    ],
    note: "Eat a small carb snack (banana, toast) about an hour before longer cardio for energy.",
  },
  flexibility: {
    sub: "Anti-inflammatory whole foods that support joints and recovery.",
    groups: {
      Produce: ["Spinach", "Kale", "Broccoli", "Berries", "Oranges", "Avocados", "Ginger", "Sweet potatoes"],
      "Meat & Seafood": ["Salmon fillets", "Chicken breast", "Sardines"],
      "Dairy & Eggs": ["Eggs (large)", "Greek yogurt, plain"],
      Pantry: ["Walnuts", "Chia seeds", "Olive oil", "Quinoa", "Lentils", "Green tea", "Turmeric"],
    },
    meals: [
      ["Breakfast", "Greek yogurt + berries + chia seeds + walnuts"],
      ["Lunch", "Salmon + quinoa + kale and avocado"],
      ["Dinner", "Chicken + sweet potato + broccoli"],
      ["Snack", "Orange + a small handful of walnuts; green tea"],
    ],
    note: "Stay well hydrated — muscles and joints stretch better when you're not dehydrated.",
  },
  health: {
    sub: "A simple, balanced mix: protein, plenty of veg, whole grains, healthy fats.",
    groups: {
      Produce: ["Spinach", "Broccoli", "Bell peppers", "Carrots", "Tomatoes", "Bananas", "Berries", "Avocados"],
      "Meat & Seafood": ["Chicken breast", "Salmon fillets", "Tilapia", "Ground turkey"],
      "Dairy & Eggs": ["Eggs (large)", "Greek yogurt, plain", "Milk or fortified soy milk"],
      Pantry: ["Old-fashioned oats", "Brown rice", "Quinoa", "Black beans", "Lentils", "Almonds", "Olive oil"],
    },
    meals: [
      ["Breakfast", "Eggs + spinach + whole-grain toast, or yogurt + oats + berries"],
      ["Lunch", "Chicken + quinoa + mixed veg"],
      ["Dinner", "Salmon or turkey + brown rice + broccoli"],
      ["Snack", "Fruit + almonds, or yogurt"],
    ],
    note: "Fill half your plate with vegetables, a quarter protein, a quarter whole grains.",
  },
  weightloss: {
    sub: "High protein + high fiber to stay full on fewer calories. Lean proteins and lots of veg.",
    groups: {
      Produce: ["Spinach", "Broccoli", "Cauliflower", "Zucchini", "Bell peppers", "Cucumber", "Tomatoes", "Berries", "Lemons"],
      "Meat & Seafood": ["Chicken breast", "Ground turkey (lean)", "Tilapia", "Shrimp"],
      "Dairy & Eggs": ["Eggs (large)", "Greek yogurt, plain nonfat", "Cottage cheese, low-fat"],
      Pantry: ["Lentils", "Black beans", "Quinoa", "Old-fashioned oats", "Almonds", "Olive oil (small amount)"],
    },
    meals: [
      ["Breakfast", "Eggs + spinach, or Greek yogurt + berries"],
      ["Lunch", "Big salad + grilled chicken + lemon-olive oil"],
      ["Dinner", "Tilapia or shrimp + roasted broccoli & zucchini"],
      ["Snack", "Cottage cheese + cucumber, or a small handful of almonds"],
    ],
    note: "Protein + veg at every meal keeps you full. Keep starchy carbs smaller; drink water before meals.",
  },
};
