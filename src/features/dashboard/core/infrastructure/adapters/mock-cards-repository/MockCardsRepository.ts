import type { CardsRepository } from '../../../application/ports/CardsRepository';
import type { Cards } from '../../../domain/models/Cards';

const STREAK = 7;

const toISODate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const buildMockTrainingDays = (): string[] => {
  const today = new Date();
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  const trained = new Set<string>();

  for (let i = 0; i < STREAK; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    if (date.getMonth() === today.getMonth()) {
      trained.add(toISODate(date));
    }
  }

  const streakStart = today.getDate() - STREAK + 1;
  const scattered = [2, 4, 7, 9, 12, 15];
  scattered.forEach((day) => {
    if (day >= 1 && day < streakStart && day <= daysInMonth) {
      const date = new Date(today.getFullYear(), today.getMonth(), day);
      trained.add(toISODate(date));
    }
  });

  return Array.from(trained).sort();
};

export class MockCardsRepository implements CardsRepository {
  async getCards(token: string): Promise<Cards> {
    void token;

    await new Promise((resolve) => setTimeout(resolve, 400));

    return {
      streak: STREAK,
      lastWorkoutDaysAgo: 0,
      trainingDays: buildMockTrainingDays(),
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
