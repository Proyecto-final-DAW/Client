import type { DietRepository } from '../../../application/ports/DietRepository';
import type { Diet } from '../../../domain/models/Diet';
import type { DietLogResult } from '../../../domain/models/DietLogGains';
import type { DietStreakState } from '../../../domain/models/DietStreakState';

const MOCK_DIET: Diet = {
  dailyCalories: 2200,
  proteinGrams: 150,
  fatGrams: 70,
  carbGrams: 250,
};

// Module-level so back-to-back calls in the same dev session show
// streak progression instead of always resetting to "first day".
let mockStreak = 4;
let mockBestStreak = 7;
let mockLoggedToday = false;
let mockVigorXp = 45;
let mockVigorLevel = 3;

const DIET_VIGOR_GAIN = 10;
const xpThresholdForLevel = (level: number): number => 100 + level * 15;

const today = (): string => new Date().toISOString().slice(0, 10);

export class MockDietRepository implements DietRepository {
  async getDiet(): Promise<Diet> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return MOCK_DIET;
  }

  async getStreakState(): Promise<DietStreakState> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      dietStreak: mockStreak,
      bestDietStreak: mockBestStreak,
      lastDietDate: mockLoggedToday ? today() : null,
      loggedToday: mockLoggedToday,
    };
  }

  async logToday(): Promise<DietLogResult> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const beforeXp = mockVigorXp;
    const beforeLevel = mockVigorLevel;
    const wasLoggedToday = mockLoggedToday;

    if (!mockLoggedToday) {
      mockStreak += 1;
      mockBestStreak = Math.max(mockBestStreak, mockStreak);
      mockLoggedToday = true;
      mockVigorXp += DIET_VIGOR_GAIN;
      while (mockVigorXp >= xpThresholdForLevel(mockVigorLevel)) {
        mockVigorXp -= xpThresholdForLevel(mockVigorLevel);
        mockVigorLevel += 1;
      }
    }

    return {
      state: {
        dietStreak: mockStreak,
        bestDietStreak: mockBestStreak,
        lastDietDate: today(),
        loggedToday: true,
      },
      gains: wasLoggedToday
        ? null
        : {
            delta: DIET_VIGOR_GAIN,
            beforeXp,
            beforeLevel,
            afterXp: mockVigorXp,
            afterLevel: mockVigorLevel,
            streak: mockStreak,
          },
    };
  }
}
