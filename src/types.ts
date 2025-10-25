export type HabitCategory = "wellbeing" | "health" | "movement" | "home" | "learning";

export interface TaskTemplate {
  id: string;
  title: string;
  description: string;
  category: HabitCategory;
  targetPerDay: number;
}

export interface TaskInstance extends TaskTemplate {
  completed: boolean;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  score: number;
  positives: string[];
  negatives: string[];
  completedTaskIds: string[];
}

export interface RankingItem {
  label: string;
  count: number;
}

export interface CalendarDayScore {
  date: string;
  score: number;
}
