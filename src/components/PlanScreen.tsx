import { useMemo } from "react";
import type { PersonalPlan } from "../lib/personalPlan";
import { bmiNote, type Profile } from "../lib/profile";
import { PLANS, type GoalKey } from "../lib/plans";
import { calculateBestStreak, calculateCurrentStreak, getTodayString, recentDays } from "../lib/streaks";

type PlanScreenProps = {
  profile: Profile;
  goal: GoalKey;
  generatedPlan: PersonalPlan;
  doneDates: string[];
  userName: string;
  saving: boolean;
  onToggleToday: (today: string, isDone: boolean) => Promise<void>;
  onChangeGoal: () => void;
  onEditProfile: () => void;
  onSignOut: () => Promise<void>;
};

export function PlanScreen({
  profile,
  goal,
  generatedPlan,
  doneDates,
  userName,
  saving,
  onToggleToday,
  onChangeGoal,
  onEditProfile,
  onSignOut,
}: PlanScreenProps) {
  const plan = PLANS[goal];
  const today = getTodayString();
  const done = new Set(doneDates);
  const todayDone = done.has(today);
  const currentStreak = calculateCurrentStreak(doneDates, today);
  const bestStreak = calculateBestStreak(doneDates);
  const days = useMemo(() => recentDays(14), []);

  return (
    <main className="app-shell plan-shell">
      <header className="topbar">
        <span className="brand">sofit</span>
        <div className="top-actions">
          <button className="link-btn" onClick={onEditProfile}>
            Settings
          </button>
          <button className="link-btn" onClick={onSignOut}>
            Sign out
          </button>
        </div>
      </header>

      <section className="intro plan-intro">
        <button className="back-btn" onClick={onChangeGoal}>
          Choose a different goal
        </button>
        <p className="eyebrow">{plan.eyebrow}</p>
        <h1>{generatedPlan.title || plan.title}</h1>
        <p className="lede">Hi {userName || "there"} — {generatedPlan.summary}</p>
        <div className="note">{bmiNote(profile, goal)}</div>
      </section>

      <section className={`panel streak-panel ${todayDone ? "done-today" : ""}`}>
        <div>
          <div className="streak-number">
            <span>{currentStreak}</span>
            <span className="flame" aria-hidden="true">
              🔥
            </span>
          </div>
          <p className="streak-label">{currentStreak === 1 ? "day streak" : "day streak"}</p>
          <p className="best-streak">Best streak: {bestStreak} {bestStreak === 1 ? "day" : "days"}</p>
        </div>
        <div className="day-strip" aria-label="Recent completion days">
          {days.map((day) => (
            <div key={day.date} className={`day-dot ${done.has(day.date) ? "filled" : ""} ${day.date === today ? "today" : ""}`}>
              <span>{day.label}</span>
              <strong>{day.day}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Meals This Week</h2>
        <p className="sub">Simple meals, no beef or pork.</p>
        <div className="table-wrap">
          <table className="summary-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Breakfast</th>
                <th>Lunch</th>
                <th>Dinner</th>
              </tr>
            </thead>
            <tbody>
              {generatedPlan.weeklyMeals.map((meal) => (
                <tr key={meal.day}>
                  <th>{meal.day}</th>
                  <td>{meal.breakfast}</td>
                  <td>{meal.lunch}</td>
                  <td>{meal.dinner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h2>Workout Week</h2>
        <p className="sub">A clear weekly rhythm with rest and recovery built in.</p>
        <div className="table-wrap">
          <table className="summary-table workout-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Focus</th>
                <th>Workout</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {generatedPlan.weeklyWorkouts.map((workout) => (
                <tr key={workout.day}>
                  <th>{workout.day}</th>
                  <td>{workout.focus}</td>
                  <td>{workout.workout}</td>
                  <td>{workout.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h2>Exercise Cues</h2>
        <p className="sub">Clear form notes are more useful here than abstract animations.</p>
        <div className="cue-list">
          {generatedPlan.weeklyWorkouts.flatMap((workout) =>
            workout.exercises.map((exercise) => (
              <article className="cue-card" key={`${workout.day}-${exercise.name}`}>
                <div className="cue-day">{workout.day}</div>
                <div>
                  <div className="exercise-head">
                    <strong>{exercise.name}</strong>
                    <span>{exercise.prescription}</span>
                  </div>
                  <p>{exercise.how}</p>
                  <p className="easier-option">
                    <b>Easier option:</b> {exercise.easierOption}
                  </p>
                </div>
              </article>
            )),
          )}
        </div>
      </section>

      <section className="panel">
        <h2>HEB Shopping List</h2>
        <p className="sub">Organized by department. No beef or pork.</p>
        <div className="grocery-groups">
          {Object.entries(generatedPlan.groceryList).map(([group, items]) => (
            <div className="grocery-group" key={group}>
              <h3>{group}</h3>
              <ul>
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {generatedPlan.helpfulNotes.map((note) => (
          <div className="note" key={note}>
            {note}
          </div>
        ))}
      </section>

      <div className="sticky-action">
        <button className={`primary-btn done-btn ${todayDone ? "marked" : ""}`} onClick={() => onToggleToday(today, todayDone)} disabled={saving}>
          {saving ? "Saving..." : todayDone ? "Today is done" : "Mark today as done"}
        </button>
      </div>
    </main>
  );
}
