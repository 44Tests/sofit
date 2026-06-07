export type MealRow = {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
};

export type WorkoutExercise = {
  name: string;
  prescription: string;
  how: string;
  easierOption: string;
};

export type WorkoutRow = {
  day: string;
  focus: string;
  workout: string;
  notes: string;
  exercises: WorkoutExercise[];
};

export type PersonalPlan = {
  title: string;
  summary: string;
  weeklyMeals: MealRow[];
  weeklyWorkouts: WorkoutRow[];
  groceryList: Record<string, string[]>;
  helpfulNotes: string[];
  generatedAt?: string;
};

export const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
