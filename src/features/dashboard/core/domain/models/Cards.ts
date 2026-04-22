export interface Cards {
  streak: number;
  lastWorkoutDaysAgo: number;
  stats: {
    strength: number;
    resistance: number;
    stamina: number;
    agility: number;
    tenacity: number;
    vigor: number;
  };
}
