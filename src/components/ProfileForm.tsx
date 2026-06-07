import { FormEvent, useMemo, useState } from "react";
import {
  cmToFeetInches,
  defaultProfile,
  feetInchesToCm,
  kgToPounds,
  poundsToKg,
  type Profile,
  type Sex,
  validateProfile,
} from "../lib/profile";

type ProfileFormProps = {
  initialProfile?: Profile;
  title?: string;
  submitLabel?: string;
  onCancel?: () => void;
  onSave: (profile: Profile) => Promise<void>;
};

type HeightUnit = "imperial" | "metric";
type WeightUnit = "lb" | "kg";

export function ProfileForm({
  initialProfile = defaultProfile,
  title = "A few details first",
  submitLabel = "Save details",
  onCancel,
  onSave,
}: ProfileFormProps) {
  const initialHeight = useMemo(() => cmToFeetInches(initialProfile.heightCm), [initialProfile.heightCm]);
  const [age, setAge] = useState(String(Math.round(initialProfile.age)));
  const [sex, setSex] = useState<Sex>(initialProfile.sex);
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("imperial");
  const [feet, setFeet] = useState(String(initialHeight.feet));
  const [inches, setInches] = useState(String(initialHeight.inches));
  const [centimeters, setCentimeters] = useState(String(Math.round(initialProfile.heightCm)));
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("lb");
  const [pounds, setPounds] = useState(String(Math.round(kgToPounds(initialProfile.weightKg))));
  const [kilograms, setKilograms] = useState(String(Math.round(initialProfile.weightKg)));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const heightCm =
      heightUnit === "imperial" ? feetInchesToCm(Number(feet), Number(inches || 0)) : Number(centimeters);
    const weightKg = weightUnit === "lb" ? poundsToKg(Number(pounds)) : Number(kilograms);
    const nextProfile: Profile = {
      age: Number(age),
      sex,
      heightCm,
      weightKg,
    };
    const validation = validateProfile(nextProfile);

    if (validation) {
      setError(validation);
      return;
    }

    setSaving(true);
    setError("");
    try {
      await onSave(nextProfile);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save yet. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="app-shell center-shell">
      <form className="panel profile-form" onSubmit={handleSubmit}>
        <p className="eyebrow">sofit</p>
        <h1>{title}</h1>
        <p className="lede">These help keep the notes personal. You can adjust them later.</p>

        <label>
          <span>Age</span>
          <input inputMode="numeric" type="number" min="13" max="110" value={age} onChange={(event) => setAge(event.target.value)} />
        </label>

        <label>
          <span>Sex</span>
          <select value={sex} onChange={(event) => setSex(event.target.value as Sex)}>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="prefer_not">Prefer not to say</option>
          </select>
        </label>

        <fieldset>
          <legend>Height</legend>
          <div className="segmented" aria-label="Height unit">
            <button type="button" className={heightUnit === "imperial" ? "active" : ""} onClick={() => setHeightUnit("imperial")}>
              ft/in
            </button>
            <button type="button" className={heightUnit === "metric" ? "active" : ""} onClick={() => setHeightUnit("metric")}>
              cm
            </button>
          </div>
          {heightUnit === "imperial" ? (
            <div className="two-col">
              <label>
                <span>Feet</span>
                <input inputMode="numeric" type="number" min="3" max="8" value={feet} onChange={(event) => setFeet(event.target.value)} />
              </label>
              <label>
                <span>Inches</span>
                <input inputMode="numeric" type="number" min="0" max="11" value={inches} onChange={(event) => setInches(event.target.value)} />
              </label>
            </div>
          ) : (
            <label>
              <span>Centimeters</span>
              <input inputMode="numeric" type="number" min="100" max="230" value={centimeters} onChange={(event) => setCentimeters(event.target.value)} />
            </label>
          )}
        </fieldset>

        <fieldset>
          <legend>Current weight</legend>
          <div className="segmented" aria-label="Weight unit">
            <button type="button" className={weightUnit === "lb" ? "active" : ""} onClick={() => setWeightUnit("lb")}>
              lbs
            </button>
            <button type="button" className={weightUnit === "kg" ? "active" : ""} onClick={() => setWeightUnit("kg")}>
              kg
            </button>
          </div>
          {weightUnit === "lb" ? (
            <label>
              <span>Pounds</span>
              <input inputMode="decimal" type="number" min="66" max="550" value={pounds} onChange={(event) => setPounds(event.target.value)} />
            </label>
          ) : (
            <label>
              <span>Kilograms</span>
              <input inputMode="decimal" type="number" min="30" max="250" value={kilograms} onChange={(event) => setKilograms(event.target.value)} />
            </label>
          )}
        </fieldset>

        {error ? <p className="form-error">{error}</p> : null}

        <div className="form-actions">
          {onCancel ? (
            <button type="button" className="ghost-btn" onClick={onCancel}>
              Cancel
            </button>
          ) : null}
          <button className="primary-btn" type="submit" disabled={saving}>
            {saving ? "Saving..." : submitLabel}
          </button>
        </div>
      </form>
    </main>
  );
}
