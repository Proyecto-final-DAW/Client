export interface Cards {
  streak: number;
  lastWorkoutDaysAgo: number;
  trainingDays: string[];
  stats: {
    strength: number;
    resistance: number;
    stamina: number;
    agility: number;
    tenacity: number;
    vigor: number;
  };
}
