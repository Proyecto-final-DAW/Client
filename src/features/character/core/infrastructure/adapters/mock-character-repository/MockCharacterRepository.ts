import {
  findLegendary,
  findSpecialization,
  findVocation,
  LEGENDARIES,
  NOVICE,
  specializationsByLinage,
  VOCATIONS,
} from '../../../../data/classes';
import type { CharacterRepository } from '../../../application/ports/CharacterRepository';
import type {
  CharacterState,
  PendingChoiceTier,
} from '../../../domain/models/CharacterState';

const initialState = (): CharacterState => ({
  currentTier: 1,
  heroLevel: 12,
  novice: NOVICE,
  vocation: findVocation('GUERRERO') ?? null,
  specialization: null,
  legendary: null,
  legendaryStage: 'NORMAL',
  isMaestroSupremo: false,
  isLeyenda: false,
  pendingChoice: {
    tier: 2,
    options: specializationsByLinage('GUERRERO'),
    recommendedId: 'BERSERKER',
  },
});

export class MockCharacterRepository implements CharacterRepository {
  private state: CharacterState = initialState();

  async getState(_token?: string): Promise<CharacterState> {
    await this.delay();
    return structuredClone(this.state);
  }

  async chooseClass(
    tier: PendingChoiceTier,
    classId: string,
    _token?: string
  ): Promise<CharacterState> {
    await this.delay();

    if (tier === 1) {
      this.state = {
        ...this.state,
        currentTier: 1,
        vocation: findVocation(classId) ?? null,
        pendingChoice: null,
      };
    } else if (tier === 2) {
      this.state = {
        ...this.state,
        currentTier: 2,
        specialization: findSpecialization(classId) ?? null,
        pendingChoice: null,
      };
    } else {
      this.state = {
        ...this.state,
        currentTier: 3,
        legendary: findLegendary(classId) ?? null,
        pendingChoice: null,
      };
    }

    return structuredClone(this.state);
  }

  private async delay(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
}

// Avoid lint complaints if a consumer imports the catalog re-exports above
// without using them directly.
void LEGENDARIES;
void VOCATIONS;
