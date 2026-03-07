export interface GetStatsDTO {
  stats: {
    strength: number;
    resistance: number;
    stamina: number;
    agility: number;
    tenacity: number;
    vigor: number;
  };
  level: number;
  title: string;
}
