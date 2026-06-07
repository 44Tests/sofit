import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { BrandLogo } from "./components/BrandLogo";
import { GoalPicker } from "./components/GoalPicker";
import { GeneratePlanScreen } from "./components/GeneratePlanScreen";
import { PlanScreen } from "./components/PlanScreen";
import { ProfileForm } from "./components/ProfileForm";
import { SetupRequired } from "./components/SetupRequired";
import { SignInScreen } from "./components/SignInScreen";
import {
  generatePersonalPlan,
  getFirebaseServices,
  hasFirebaseConfig,
  saveGoal,
  saveProfile,
  signInWithGoogle,
  signOutOfSofit,
  toggleDoneDate,
  watchUserDoc,
  type UserDoc,
} from "./lib/firebase";
import type { GoalKey } from "./lib/plans";
import type { Profile } from "./lib/profile";

type Mode = "normal" | "editProfile" | "changeGoal";

export function App() {
  const services = useMemo(() => getFirebaseServices(), []);
  const [authReady, setAuthReady] = useState(!hasFirebaseConfig);
  const [user, setUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<UserDoc | null>(null);
  const [docReady, setDocReady] = useState(false);
  const [mode, setMode] = useState<Mode>("normal");
  const [busyAuth, setBusyAuth] = useState(false);
  const [busyGoal, setBusyGoal] = useState<GoalKey | "">("");
  const [busyDone, setBusyDone] = useState(false);
  const [busyPlan, setBusyPlan] = useState(false);
  const [planError, setPlanError] = useState("");
  const [error, setError] = useState("");
  const [docError, setDocError] = useState("");

  useEffect(() => {
    if (!services) return undefined;

    return onAuthStateChanged(services.auth, (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
      setUserDoc(null);
      setDocReady(false);
      setDocError("");
      setMode("normal");
    });
  }, [services]);

  useEffect(() => {
    if (!user) {
      setDocReady(true);
      return undefined;
    }

    setDocReady(false);
    setDocError("");
    const slowTimer = window.setTimeout(() => {
      setDocError("Firestore is taking longer than expected. Check that Firestore is enabled and rules are deployed.");
      setDocReady(true);
    }, 12000);

    const unsubscribe = watchUserDoc(
      user.uid,
      (data) => {
        window.clearTimeout(slowTimer);
        setUserDoc({ ...data, doneDates: data.doneDates ?? [] });
        setDocError("");
        setDocReady(true);
      },
      (watchError) => {
        window.clearTimeout(slowTimer);
        setDocError(watchError.message);
        setDocReady(true);
      },
    );

    return () => {
      window.clearTimeout(slowTimer);
      unsubscribe();
    };
  }, [user]);

  if (!hasFirebaseConfig) {
    return <SetupRequired />;
  }

  if (!authReady) {
    return <Loading label="Opening sofit..." />;
  }

  if (!user) {
    return (
      <SignInScreen
        busy={busyAuth}
        error={error}
        onSignIn={async () => {
          setBusyAuth(true);
          setError("");
          try {
            await signInWithGoogle();
          } catch (signInError) {
            setError(signInError instanceof Error ? signInError.message : "Google sign-in did not finish.");
          } finally {
            setBusyAuth(false);
          }
        }}
      />
    );
  }

  if (!docReady) {
    return <Loading label="Loading your plan..." />;
  }

  if (!userDoc) {
    return (
      <LoadError
        message={docError || "Could not load your Firestore profile yet."}
        onRetry={() => window.location.reload()}
        onSignOut={async () => {
          await signOutOfSofit();
        }}
      />
    );
  }

  if (!userDoc.profile || mode === "editProfile") {
    return (
      <ProfileForm
        initialProfile={userDoc.profile}
        title={userDoc.profile ? "Edit your details" : "A few details first"}
        submitLabel={userDoc.profile ? "Update details" : "Continue"}
        onCancel={userDoc.profile ? () => setMode("normal") : undefined}
        onSave={async (profile: Profile) => {
          await saveProfile(user.uid, profile);
          setMode("normal");
        }}
      />
    );
  }

  if (!userDoc.goal || mode === "changeGoal") {
    return (
      <GoalPicker
        profile={userDoc.profile}
        savingGoal={busyGoal}
        onEditProfile={() => setMode("editProfile")}
        onPick={async (goal: GoalKey) => {
          setBusyGoal(goal);
          setError("");
          try {
            await saveGoal(user.uid, goal);
            setPlanError("");
            setMode("normal");
          } catch (saveError) {
            setError(saveError instanceof Error ? saveError.message : "Could not save that goal yet.");
          } finally {
            setBusyGoal("");
          }
        }}
      />
    );
  }

  if (!userDoc.generatedPlan) {
    return (
      <GeneratePlanScreen
        profile={userDoc.profile}
        goal={userDoc.goal}
        busy={busyPlan}
        error={planError}
        onChangeGoal={() => setMode("changeGoal")}
        onEditProfile={() => setMode("editProfile")}
        onGenerate={async () => {
          setBusyPlan(true);
          setPlanError("");
          try {
            await generatePersonalPlan(userDoc.profile!, userDoc.goal!);
          } catch (generateError) {
            setPlanError(
              generateError instanceof Error
                ? generateError.message
                : "Could not generate the plan yet. Please try again.",
            );
          } finally {
            setBusyPlan(false);
          }
        }}
      />
    );
  }

  return (
    <>
      {error ? <div className="toast">{error}</div> : null}
      <PlanScreen
        profile={userDoc.profile}
        goal={userDoc.goal}
        generatedPlan={userDoc.generatedPlan}
        doneDates={userDoc.doneDates ?? []}
        userName={user.displayName?.split(" ")[0] ?? ""}
        saving={busyDone}
        onChangeGoal={() => setMode("changeGoal")}
        onEditProfile={() => setMode("editProfile")}
        onSignOut={async () => {
          await signOutOfSofit();
        }}
        onToggleToday={async (today, isDone) => {
          setBusyDone(true);
          setError("");
          try {
            await toggleDoneDate(user.uid, today, isDone);
          } catch (toggleError) {
            setError(toggleError instanceof Error ? toggleError.message : "Could not update today yet.");
          } finally {
            setBusyDone(false);
          }
        }}
      />
    </>
  );
}

function LoadError({
  message,
  onRetry,
  onSignOut,
}: {
  message: string;
  onRetry: () => void;
  onSignOut: () => Promise<void>;
}) {
  return (
    <main className="app-shell center-shell">
      <section className="panel setup-panel">
        <BrandLogo />
        <h1>Plan did not load</h1>
        <p className="lede">{message}</p>
        <div className="note">
          If this mentions permissions, deploy Firestore rules with <code>firebase deploy --only firestore:rules</code>.
        </div>
        <div className="form-actions">
          <button className="ghost-btn" onClick={onSignOut}>
            Sign out
          </button>
          <button className="primary-btn" onClick={onRetry}>
            Try again
          </button>
        </div>
      </section>
    </main>
  );
}

function Loading({ label }: { label: string }) {
  return (
    <main className="app-shell center-shell">
      <div className="loader" aria-label={label}>
        <span />
        <p>{label}</p>
      </div>
    </main>
  );
}
