export interface GetStatsDTO {
  stats: {
    fuerza: number;
    resistencia: number;
    estamina: number;
    agilidad: number;
    tenacidad: number;
    vigor: number;
  };
  level: number;
  title: string;
}
