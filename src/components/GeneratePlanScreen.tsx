import { bmiNote, type Profile } from "../lib/profile";
import { PLANS, type GoalKey } from "../lib/plans";

type GeneratePlanScreenProps = {
  profile: Profile;
  goal: GoalKey;
  busy: boolean;
  error: string;
  onGenerate: () => Promise<void>;
  onChangeGoal: () => void;
  onEditProfile: () => void;
};

export function GeneratePlanScreen({
  profile,
  goal,
  busy,
  error,
  onGenerate,
  onChangeGoal,
  onEditProfile,
}: GeneratePlanScreenProps) {
  const plan = PLANS[goal];

  return (
    <main className="app-shell center-shell">
      <section className="panel generate-panel">
        <button className="back-btn" onClick={onChangeGoal}>
          Choose a different goal
        </button>
        <p className="eyebrow">Personalized plan</p>
        <h1>{busy ? "Building your week" : "Create your weekly plan"}</h1>
        <p className="lede">
          sofit will use your profile and {plan.title.toLowerCase()} goal to create a practical week of meals and workouts.
        </p>
        <div className="note">{bmiNote(profile, goal)}</div>
        <div className="generate-actions">
          <button className="ghost-btn" onClick={onEditProfile} disabled={busy}>
            Edit details
          </button>
          <button className="primary-btn" onClick={onGenerate} disabled={busy}>
            {busy ? "Generating..." : "Generate my plan"}
          </button>
        </div>
        {busy ? (
          <div className="generate-loader">
            <span />
            <p>Creating meals, workouts, and form cues...</p>
          </div>
        ) : null}
        {error ? <p className="form-error">{error}</p> : null}
      </section>
    </main>
  );
}
