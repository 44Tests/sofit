export type Sex = "female" | "male" | "prefer_not";

export type Profile = {
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
};

export const defaultProfile: Profile = {
  age: 45,
  sex: "female",
  heightCm: 152.4,
  weightKg: 50.8023,
};

export function poundsToKg(pounds: number) {
  return pounds * 0.45359237;
}

export function kgToPounds(kg: number) {
  return kg / 0.45359237;
}

export function feetInchesToCm(feet: number, inches: number) {
  return (feet * 12 + inches) * 2.54;
}

export function cmToFeetInches(cm: number) {
  const totalInches = Math.round(cm / 2.54);
  return {
    feet: Math.floor(totalInches / 12),
    inches: totalInches % 12,
  };
}

export function calculateBmi(profile: Profile) {
  const meters = profile.heightCm / 100;
  return profile.weightKg / (meters * meters);
}

export function bmiNote(profile: Profile, goal?: string) {
  const bmi = calculateBmi(profile);

  if (bmi < 18.5) {
    return "A gentle strength and nourishment focus may be a better foundation than weight loss right now. This is general wellness guidance, so check with a doctor before major changes.";
  }

  if (bmi < 25) {
    if (goal === "weightloss") {
      return "You're already in a healthy range. If weight loss is your focus, keep it gentle; strength and toning may serve you beautifully too. Check with a doctor before major changes.";
    }

    return "You're in a healthy range — a great foundation for building strength, energy, and confidence.";
  }

  if (bmi < 30) {
    return "A balanced routine with protein, walking, and strength work can support steady progress without extremes.";
  }

  return "Small, consistent steps are enough to begin. For major changes, it is worth checking in with a doctor first.";
}

export function validateProfile(profile: Profile) {
  if (!Number.isFinite(profile.age) || profile.age < 13 || profile.age > 110) {
    return "Age should be a positive number in a normal human range.";
  }

  if (!Number.isFinite(profile.heightCm) || profile.heightCm < 100 || profile.heightCm > 230) {
    return "Height should be in a normal human range.";
  }

  if (!Number.isFinite(profile.weightKg) || profile.weightKg < 30 || profile.weightKg > 250) {
    return "Weight should be in a normal human range.";
  }

  return "";
}
