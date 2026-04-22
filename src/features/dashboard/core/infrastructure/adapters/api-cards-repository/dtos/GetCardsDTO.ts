export interface GetCardsDTO {
  streak: number;
  last_session_date: string;
  stats: {
    strength: number;
    resistance: number;
    stamina: number;
    agility: number;
    tenacity: number;
    vigor: number;
  };
}
