import type {
  CharacterRepository,
  CharacterStateOrOnboarding,
} from '../../../application/ports/CharacterRepository';
import type {
  LegendaryClass,
  NoviceClass,
  SpecializationClass,
  VocationClass,
} from '../../../domain/models/CharacterClass';
import type {
  CharacterState,
  PendingChoiceTier,
} from '../../../domain/models/CharacterState';

/**
 * Self-contained mock for the character feature. Holds a small fixture of
 * classes (one per tier, one lineage) so the developer can drive the full
 * T0 → T1 → T2 → T3 → T4 → T5 → T6 lifecycle offline without the server.
 *
 * Use the env flag in `ui/adapter.ts` to swap this in.
 */

const NOVICE: NoviceClass = {
  id: 'ESCUDERO',
  tier: 0,
  name: 'Escudero',
  frase: 'Todo heroe empezo siendo nadie.',
};

const VOCATION_GUERRERO: VocationClass = {
  id: 'GUERRERO',
  tier: 1,
  name: 'Guerrero',
  frase: 'Cada cicatriz es una victoria que sobrevivio.',
  dominantStat: 'strength',
};

const SPEC_BERSERKER: SpecializationClass = {
  id: 'BERSERKER',
  tier: 2,
  name: 'Berserker',
  frase: 'Solo deja de luchar cuando ya no queda enemigo.',
  lineage: 'GUERRERO',
  secondaryStat: 'endurance',
  legendaryOptions: ['CABALLERO_APOCALIPTICO', 'TITAN'],
};

const LEG_TITAN: LegendaryClass = {
  id: 'TITAN',
  tier: 3,
  name: 'Titan',
  frase: 'Los dioses lo enterraron. La tierra lo devolvio.',
  iconHint: '⚔',
  requiredStats: ['strength'],
  transcendentName: 'Primordial',
  transcendentFrase: 'Antes del verbo, ya tenia nombre.',
};

const initialState = (): CharacterState => ({
  currentTier: 0,
  heroLevel: 0,
  novice: NOVICE,
  vocation: null,
  specialization: null,
  legendary: null,
  legendaryStage: null,
  isMaestroSupremo: false,
  isLeyenda: false,
  pendingChoice: {
    tier: 1,
    options: [VOCATION_GUERRERO],
    recommendedId: 'GUERRERO',
  },
});

export class MockCharacterRepository implements CharacterRepository {
  private state: CharacterState = initialState();

  async getState(): Promise<CharacterStateOrOnboarding> {
    await this.delay();
    return { kind: 'state', state: structuredClone(this.state) };
  }

  async chooseClass(
    tier: PendingChoiceTier,
    classId: string
  ): Promise<CharacterStateOrOnboarding> {
    await this.delay();

    if (this.state.pendingChoice?.tier !== tier) {
      throw new Error(`No pending choice at tier ${tier}`);
    }

    if (tier === 1) {
      this.state = {
        ...this.state,
        currentTier: 1,
        vocation: VOCATION_GUERRERO,
        pendingChoice: {
          tier: 2,
          options: [SPEC_BERSERKER],
          recommendedId: 'BERSERKER',
        },
      };
    } else if (tier === 2) {
      this.state = {
        ...this.state,
        currentTier: 2,
        specialization: SPEC_BERSERKER,
        pendingChoice: {
          tier: 3,
          options: [LEG_TITAN],
          recommendedId: 'TITAN',
        },
      };
    } else {
      // T3 picked → auto-promote through T4 (TRANSCENDENT) and T5 (Maestro Supremo).
      this.state = {
        ...this.state,
        currentTier: 5,
        legendary: LEG_TITAN,
        legendaryStage: 'TRANSCENDENT',
        isMaestroSupremo: true,
        pendingChoice: null,
      };
    }

    void classId; // identity is fixed in this mock; kept for future extensions
    return { kind: 'state', state: structuredClone(this.state) };
  }

  private async delay(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
}
