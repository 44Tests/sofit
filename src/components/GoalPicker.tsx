import { bmiNote, type Profile } from "../lib/profile";
import { goalOrder, PLANS, type GoalKey } from "../lib/plans";

type GoalPickerProps = {
  profile: Profile;
  onPick: (goal: GoalKey) => Promise<void>;
  onEditProfile: () => void;
  savingGoal: GoalKey | "";
};

export function GoalPicker({ profile, onPick, onEditProfile, savingGoal }: GoalPickerProps) {
  return (
    <main className="app-shell">
      <header className="topbar">
        <span className="brand">sofit</span>
        <button className="link-btn" onClick={onEditProfile}>
          Edit details
        </button>
      </header>

      <section className="intro">
        <p className="eyebrow">Personal plan</p>
        <h1>What's your one goal?</h1>
        <p className="lede">Pick a single focus. You'll get an easy weekly workout and a simple HEB shopping list — no beef or pork.</p>
        <div className="note">{bmiNote(profile)}</div>
      </section>

      <section className="goals" aria-label="Choose a goal">
        {goalOrder.map((key) => {
          const plan = PLANS[key];
          return (
            <button key={key} className="goal-card" onClick={() => onPick(key)} disabled={savingGoal !== ""}>
              <span className="goal-icon">{plan.icon}</span>
              <span>
                <span className="goal-title">{plan.title}</span>
                <span className="goal-desc">{savingGoal === key ? "Saving..." : plan.eyebrow}</span>
              </span>
            </button>
          );
        })}
      </section>
    </main>
  );
}
