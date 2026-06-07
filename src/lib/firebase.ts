import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type Auth,
} from "firebase/auth";
import {
  arrayRemove,
  arrayUnion,
  deleteField,
  doc,
  initializeFirestore,
  onSnapshot,
  persistentLocalCache,
  persistentMultipleTabManager,
  serverTimestamp,
  setDoc,
  type Firestore,
  type Unsubscribe,
} from "firebase/firestore";
import type { PersonalPlan } from "./personalPlan";
import type { GoalKey } from "./plans";
import type { Profile } from "./profile";

export type UserDoc = {
  profile?: Profile;
  goal?: GoalKey;
  doneDates?: string[];
  generatedPlan?: PersonalPlan;
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const hasFirebaseConfig = Object.values(firebaseConfig).every(
  (value) => typeof value === "string" && value.length > 0 && value !== "FIREBASE_CONFIG_HERE",
);

type FirebaseServices = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  provider: GoogleAuthProvider;
};

let services: FirebaseServices | undefined;

export function getFirebaseServices() {
  if (!hasFirebaseConfig) return undefined;
  if (services) return services;

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
  });
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  services = { app, auth, db, provider };
  return services;
}

export function signInWithGoogle() {
  const current = getFirebaseServices();
  if (!current) throw new Error("Firebase config is missing.");
  return signInWithPopup(current.auth, current.provider);
}

export function signOutOfSofit() {
  const current = getFirebaseServices();
  if (!current) throw new Error("Firebase config is missing.");
  return signOut(current.auth);
}

export function watchUserDoc(uid: string, onChange: (data: UserDoc) => void, onError: (error: Error) => void): Unsubscribe {
  const current = getFirebaseServices();
  if (!current) throw new Error("Firebase config is missing.");

  return onSnapshot(
    doc(current.db, "users", uid),
    { includeMetadataChanges: true },
    (snapshot) => {
      onChange(snapshot.exists() ? (snapshot.data() as UserDoc) : { doneDates: [] });
    },
    onError,
  );
}

export function saveProfile(uid: string, profile: Profile) {
  const current = getFirebaseServices();
  if (!current) throw new Error("Firebase config is missing.");

  return setDoc(
    doc(current.db, "users", uid),
    {
      profile,
      doneDates: [],
      generatedPlan: deleteField(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export function saveGoal(uid: string, goal: GoalKey) {
  const current = getFirebaseServices();
  if (!current) throw new Error("Firebase config is missing.");

  return setDoc(
    doc(current.db, "users", uid),
    { goal, generatedPlan: deleteField(), updatedAt: serverTimestamp() },
    { merge: true },
  );
}

export function toggleDoneDate(uid: string, date: string, isDone: boolean) {
  const current = getFirebaseServices();
  if (!current) throw new Error("Firebase config is missing.");

  return setDoc(
    doc(current.db, "users", uid),
    {
      doneDates: isDone ? arrayRemove(date) : arrayUnion(date),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function generatePersonalPlan(profile: Profile, goal: GoalKey) {
  const current = getFirebaseServices();
  if (!current) throw new Error("Firebase config is missing.");
  if (!current.auth.currentUser) throw new Error("Sign in before generating a plan.");

  const token = await current.auth.currentUser.getIdToken();
  const response = await fetch(`https://us-central1-${firebaseConfig.projectId}.cloudfunctions.net/generatePersonalPlanHttp`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ profile, goal }),
  });
  const data = (await response.json()) as PersonalPlan | { error?: string };

  if (!response.ok) {
    throw new Error("error" in data && data.error ? data.error : "Could not generate the plan yet.");
  }

  return data as PersonalPlan;
}
