export function SetupRequired() {
  return (
    <main className="app-shell center-shell">
      <section className="panel setup-panel">
        <p className="eyebrow">sofit setup</p>
        <h1>Firebase config needed</h1>
        <p className="lede">
          Add your Firebase web app values to a local <code>.env</code> file using <code>.env.example</code> as the template.
        </p>
        <div className="note">
          The app intentionally ships with placeholders only. Once the config is present, Google sign-in and Firestore sync will turn on.
        </div>
      </section>
    </main>
  );
}
