export interface GetCardsDTO {
  streak: number;
  last_session_date: string;
  training_days_this_month: string[];
  stats: {
    strength: number;
    resistance: number;
    stamina: number;
    agility: number;
    tenacity: number;
    vigor: number;
  };
}
