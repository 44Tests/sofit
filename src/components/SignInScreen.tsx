import { BrandLogo } from "./BrandLogo";

type SignInScreenProps = {
  onSignIn: () => Promise<void>;
  busy: boolean;
  error: string;
};

export function SignInScreen({ onSignIn, busy, error }: SignInScreenProps) {
  return (
    <main className="app-shell center-shell">
      <section className="welcome">
        <BrandLogo />
        <h1>Your gentle plan, kept in sync.</h1>
        <p className="lede">Sign in once to keep your workout plan, grocery list, and streak available across your devices.</p>
        <button className="primary-btn" onClick={onSignIn} disabled={busy}>
          {busy ? "Opening Google..." : "Continue with Google"}
        </button>
        {error ? <p className="form-error">{error}</p> : null}
      </section>
    </main>
  );
}
