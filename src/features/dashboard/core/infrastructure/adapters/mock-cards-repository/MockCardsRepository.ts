import type { CardsRepository } from '../../../application/ports/CardsRepository';
import type { Cards } from '../../../domain/models/Cards';

export class MockCardsRepository implements CardsRepository {
  async getCards(token: string): Promise<Cards> {
    void token;

    await new Promise((resolve) => setTimeout(resolve, 400));

    return {
      streak: 7,
      lastWorkoutDaysAgo: 2,
      stats: {
        strength: 88,
        resistance: 78,
        stamina: 82,
        agility: 70,
        tenacity: 60,
        vigor: 65,
      },
    };
  }
}
