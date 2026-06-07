# PRD — sofit

## 1. Overview
A simple, mobile-friendly web app named **sofit** for one user (single profile). On first launch she signs in with Google, completes a short onboarding (age, sex, height, current weight), then picks one fitness goal and receives an AI-generated weekly plan with meal and workout summary tables, clear exercise cue cards, and a grocery shopping list (organized for HEB). The app tracks a daily "done / not done" streak to keep her motivated.

No accounts beyond a single sign-in. Data is stored in Firebase (Firestore) so it syncs across her devices and survives a cleared browser, with offline support so the app still works without a connection.

## 2. Goals & Non-Goals

### Goals
- Collect basic profile details once via a short, friendly onboarding (age, sex, height, current weight).
- Let the user pick one of five goals and generate a matching workout + nutrition plan.
- Show clear exercise cue cards with simple form notes and easier options.
- Track a simple daily completion: each day is either **done** or **not done**.
- Show a current streak and best streak to motivate consistency.
- Work great on a phone (this is the primary device).
- Persist all state in Firestore, with Firebase offline persistence providing the local cache so it survives closing the browser/app and syncs across devices.

### Non-Goals
- No multiple users / profiles (single user only; one sign-in account).
- No calorie counting, macros, weigh-ins, or detailed logging.
- No custom backend, database server, social features, or multiple sign-in methods.
- No social / sharing features.

## 3. User
A single user: a 45-year-old woman, 112 lbs. Plans are tuned for her — bone and muscle health emphasis, lean (not aggressive) weight-loss approach, no gym equipment assumed (bodyweight + light items like water jugs/cans). She is not technical; the UI must be obvious and friendly.

## 4. Core Flow
1. **First open:** The app is gated behind Google sign-in.
2. **Onboarding:** A short welcome collects age, sex, height, and current weight (one screen, four fields). Saved to Firestore; shown only when the signed-in user has no profile.
3. **Goal picker screen:** Five goal cards. She taps one.
4. **AI generation:** A Firebase Cloud Function generates a personalized 7-day meal/workout plan and saves it to Firestore.
5. **Plan screen:** Shows her chosen goal's weekly meal table, weekly workout table, exercise cue cards, and HEB shopping list.
6. **Tracking:** A "Mark today as done" button. Once tapped, today is complete and the streak updates. A small calendar/streak display shows recent days and current + best streak.
7. She can change her goal at any time (a "change goal" link) and edit her profile details from a settings link. Changing profile or goal regenerates the plan, but keeps her streak — streak is about showing up, not which plan.

## 5. Goals & Plan Content
There are five goals. Use the exact workout and nutrition content from the reference HTML file (provided alongside this PRD). Each goal has:
- An icon, title, and one-line description.
- A weekly workout: a list of days, each with exercises (name, sets×reps or duration, and a one-line "how to").
- A nutrition section: a HEB shopping list grouped by department (Produce, Meat & Seafood, Dairy & Eggs, Pantry) plus 3–4 simple meal ideas and one helpful note.

The five goals:
1. **Build Strength** — 3 days/week, bodyweight + light weights.
2. **Improve Cardio** — 4 days/week, walking + intervals.
3. **Increase Flexibility** — daily gentle stretching/mobility.
4. **General Health** — 4 days/week, balanced mix.
5. **Weight Loss** — 4 days/week, cardio + strength; protein-forward nutrition.

**Dietary rule (applies to ALL nutrition lists): no beef and no pork.** Poultry, seafood, eggs, dairy, and plant proteins are fine.

> Copy the `PLANS` and `NUTRITION` data objects verbatim from the reference HTML — they're already written and tuned. Do not regenerate the content.

## 6. Onboarding & Profile
On first launch (when no profile exists in storage), show a single, friendly onboarding screen before the goal picker. Collect:

| Field | Input type | Notes |
|---|---|---|
| Age | number | years |
| Sex | select | Female / Male / Prefer not to say — defaults to Female |
| Height | number + unit | feet/inches **or** cm; store internally in cm |
| Current weight | number + unit | lbs **or** kg; store internally in kg |

Behavior:
- Pre-fill sensible defaults for this user (age 45, Female, 5'0", 112 lbs) but keep all fields editable.
- Save to Firestore under the signed-in user's `users/{uid}` document. Firestore offline persistence provides the local cached copy; do not use `localStorage` as the canonical store.
- A "Settings" / "Edit details" link (small, top corner of the plan screen) lets her change these later.
- Validate gently: numbers must be positive and within human ranges; never block with harsh errors — just nudge.

How the profile is used (keep it light — these do NOT change the bodyweight exercises themselves):
- **Greeting / personalization** — e.g. a friendly header.
- **Healthy-range note** — compute BMI from height + weight and show a one-line, non-judgmental note (e.g. "You're in a healthy range — great foundation for building strength.").
- **Gentle goal guidance** — if she picks **Weight Loss** but her BMI is already in or below the healthy range, show a soft, supportive note suggesting strength/toning may serve her better, without blocking the choice. Tone must be encouraging, never alarming. This is general wellness guidance, not medical advice — include a brief reminder to consult a doctor before major changes.

## 7. Exercise Visuals / Guidance
The first animated stick-figure approach was not clear enough. Replace abstract exercise animations with clearer exercise guidance:

- Show each exercise as a cue card with name, sets/reps or duration, a concise "how to" cue, and an easier option.
- Do not use unclear generic stick-figure animations.
- Later, better options could include curated licensed videos, static photo references, or AI-generated image assets, but v1 should avoid hot-linked third-party clips and focus on clear written cues.

## 8. Streak / Tracking Logic
- One completion per calendar day. Tapping "Mark today as done" sets today = done; tapping again un-marks it (toggle, in case of a mistake).
- **Current streak:** number of consecutive days ending today (or yesterday, if today isn't marked yet) that are done. If a day is missed (not done) and it's no longer "today," the streak resets to 0.
- **Best streak:** the longest run of consecutive done-days ever recorded.
- Store each done-day as a date string (`YYYY-MM-DD`). Compute streaks from that set.
- Use the device's local date (not UTC) so "today" matches her timezone.
- Show: a big current-streak number ("🔥 5 day streak"), best streak underneath, and a small strip of the last ~7–14 days with done days filled in.

## 9. Data & Persistence (Firebase)
Use **Firebase** for storage and sign-in so data syncs across devices and survives a cleared browser.

**Auth:** Firebase Authentication with a single sign-in method — Google sign-in (least friction). The app is gated behind sign-in; all data is tied to the authenticated user's UID.

**Firestore data model:** one document per user, keyed by UID:
```
users/{uid}:
  profile:    { age, sex, heightCm, weightKg }
  goal:       "<goal key>"          // e.g. "strength"
  generatedPlan: { weeklyMeals, weeklyWorkouts, groceryList, helpfulNotes }
  doneDates:  ["YYYY-MM-DD", ...]   // days marked done
  updatedAt:  <server timestamp>
```
Keep it to a single small document — no need for subcollections at this scale. Write `doneDates` as an array (use `arrayUnion` / `arrayRemove` for the daily toggle).

**Offline support:** enable Firestore offline persistence so the app works with no connection and syncs when back online. Firestore is canonical after sign-in; local cache is an implementation detail owned by Firebase.

**Load logic:** after sign-in, read the user doc. If no `profile`, show onboarding; else if no `goal`, show the picker; else show the plan.

**Security rules (REQUIRED — implementer must include):** lock all reads/writes so a user can only access their own `users/{uid}` document:
```
match /users/{uid} {
  allow read, write: if request.auth != null && request.auth.uid == uid;
}
```
An open Firestore is the most common and most costly mistake here — these rules are not optional.

> **Config & secrets note for the build:** Do NOT hard-code real Firebase project config or any keys into files that get shared around. Scaffold the Firebase wiring with clearly-marked placeholders (e.g. `FIREBASE_CONFIG_HERE`); the owner will paste the real config and publish the security rules themselves. Firebase web config is technically public, but the security rules are what protect the data.

## 10. Deployment & Structure
- **Firebase Hosting** serves the app.
- **Firebase Cloud Functions** are required for AI plan generation. Do not call any third-party AI API from the frontend.
- Suggested layout: a standard Firebase web project (`firebase.json`, `firestore.rules`, hosting `public/` or a built `dist/`).
- Provide a short `README` with the exact steps to add the Firebase config, deploy hosting, and publish the Firestore rules.

## 11. Platform & Tech
- Single-page web app, mobile-first (primary use is on a phone).
- Use a minimal Vite + React + TypeScript setup.
- Use the Firebase JS SDK (modular v9+).
- Installable to the home screen as a PWA (nice-to-have): web manifest + viewport meta so it opens full-screen and feels like an app.
- Target: iOS Safari and Android Chrome. Tap targets large enough for thumbs.

## 12. Design
- Clean, calm, minimal — warm off-white background, a single green accent, serif display font for headings (e.g., Fraunces) paired with a clean sans (e.g., Outfit) for body. Match the reference HTML's aesthetic.
- Mobile layout: single column, generous spacing, large tap targets, sticky "Mark today as done" button at the bottom on the plan screen.
- Smooth, subtle transitions between picker and plan; a small celebratory touch when a streak increases (e.g., the flame scales up briefly).

## 13. Acceptance Criteria
- [ ] User signs in once (Google sign-in); data is tied to their UID.
- [ ] On first launch, onboarding collects age, sex, height, and weight, and saves them to Firestore.
- [ ] Profile details can be edited later and persist across devices and reloads.
- [ ] Picking a goal generates and saves a personalized weekly meal/workout plan.
- [ ] Plan screen shows meals in a table with weekdays as rows and breakfast, lunch, dinner as columns.
- [ ] Plan screen shows workouts in a table with weekdays as rows.
- [ ] Exercise guidance uses clear cue cards, not generic stick-figure animations.
- [ ] Choosing Weight Loss at a healthy/low BMI shows a gentle, supportive note (not a hard block).
- [ ] No nutrition list contains beef or pork.
- [ ] "Mark today as done" toggles today and updates the current streak immediately.
- [ ] Current and best streak calculate correctly across day boundaries and missed days.
- [ ] Profile, goal, and done-days sync across devices via Firestore.
- [ ] Changing the goal does not reset the streak.
- [ ] Firestore security rules restrict access to the signed-in user's own document.
- [ ] No Firebase config or secrets are hard-coded into shared files (placeholders only).
- [ ] App still loads and functions offline (Firestore offline persistence), syncing when reconnected.
- [ ] Layout is comfortable and fully usable on a phone screen.

## 14. Future Enhancements (not in v1)
These are out of scope for the first build but the architecture should not preclude them. Document only — do not implement now.

**Additional AI features (planned).** Two narrowly-scoped helpers, to be added later via **Firebase Cloud Functions**:
1. **"What can I make tonight?"** — she optionally names a few ingredients on hand; the function returns 1–2 simple meal ideas built from her goal's HEB shopping list, always respecting the no-beef / no-pork rule.
2. **"Swap this exercise"** — suggests an equivalent movement when one is uncomfortable or equipment is unavailable.

**Required architecture for AI (critical):** the AI model's API key must live **only** in a Cloud Function (server-side) — never in the frontend, where it would be readable and abusable. The app calls the Cloud Function; the function calls the model and returns the result. Add reasonable rate limiting on the function to control cost. Keep these features additive and optional — the core plan + streak must work without them.

**Deliberately excluded (not planned):** open-ended chatbot (invites medical questions the app should not answer), AI-generated workout plans (the tuned plans are the source of truth; do not let AI regenerate them), and any calorie/macro targets (counterproductive for an already-lean user and intentionally omitted).

> Wellness disclaimer: this app provides general wellness guidance, not medical advice. Any AI suggestions must stay within meal ideas and exercise substitutions, and should defer to a doctor for health concerns.

## 15. Reference
Use the provided `sofit-nutrition-app.html` as the source of truth for all plan/nutrition content and visual style. This PRD adds Google sign-in, single-user streak tracking, onboarding, animated exercise visuals, and Firebase persistence on top of it.
