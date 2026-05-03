import type {
  ClassTier,
  ClassTierStage,
  LegendaryClass,
  LineageId,
  NoviceClass,
  SpecializationClass,
  StatKey,
  VocationClass,
} from '../../../../domain/models/CharacterClass';
import type {
  CharacterState,
  PendingChoice,
} from '../../../../domain/models/CharacterState';
import type {
  CharacterStateDTO,
  PendingChoiceDTO,
} from '../dtos/GetCharacterStateDTO';

/**
 * DTO → domain mapper for the character state.
 *
 * Validates each field against the domain shape before promoting it. Throws
 * `MappingError` on any inconsistency — the caller (repository) catches and
 * surfaces a useful message. Failing loud here is the whole point of the
 * mapper layer: bad data must not reach the UI.
 */
export class MappingError extends Error {
  constructor(message: string) {
    super(`CharacterStateFromDTO: ${message}`);
    this.name = 'MappingError';
  }
}

const STAT_KEY_SET: ReadonlySet<StatKey> = new Set([
  'strength',
  'endurance',
  'stamina',
  'agility',
  'tenacity',
  'vigor',
]);

const LINEAGE_ID_SET: ReadonlySet<LineageId> = new Set([
  'GUERRERO',
  'PALADIN',
  'CAZADOR',
  'PICARO',
  'MONJE',
  'DRUIDA',
]);

const VALID_TIER_STAGES: ReadonlySet<ClassTierStage> = new Set([
  'NORMAL',
  'TRANSCENDENT',
]);

const requireString = (
  source: Record<string, unknown>,
  key: string,
  context: string
): string => {
  const value = source[key];
  if (typeof value !== 'string' || value.length === 0) {
    throw new MappingError(`${context}: missing or empty "${key}"`);
  }
  return value;
};

const requireStatKey = (
  source: Record<string, unknown>,
  key: string,
  context: string
): StatKey => {
  const value = source[key];
  if (typeof value !== 'string' || !STAT_KEY_SET.has(value as StatKey)) {
    throw new MappingError(`${context}: invalid stat key for "${key}"`);
  }
  return value as StatKey;
};

const requireLineageId = (
  source: Record<string, unknown>,
  key: string,
  context: string
): LineageId => {
  const value = source[key];
  if (typeof value !== 'string' || !LINEAGE_ID_SET.has(value as LineageId)) {
    throw new MappingError(`${context}: invalid lineage id for "${key}"`);
  }
  return value as LineageId;
};

const requireTier = <T extends number>(
  source: Record<string, unknown>,
  expected: T,
  context: string
): T => {
  const value = source.tier;
  if (value !== expected) {
    throw new MappingError(
      `${context}: expected tier ${expected}, got ${String(value)}`
    );
  }
  return value as T;
};

const toNoviceClass = (raw: Record<string, unknown>): NoviceClass => {
  const tier = requireTier(raw, 0, 'novice');
  const id = requireString(raw, 'id', 'novice');
  if (id !== 'ESCUDERO') {
    throw new MappingError(`novice: expected id ESCUDERO, got ${id}`);
  }
  return {
    id: 'ESCUDERO',
    tier,
    name: requireString(raw, 'name', 'novice'),
    frase: requireString(raw, 'frase', 'novice'),
  };
};

const toVocationClass = (raw: Record<string, unknown>): VocationClass => ({
  id: requireLineageId(raw, 'id', 'vocation'),
  tier: requireTier(raw, 1, 'vocation'),
  name: requireString(raw, 'name', 'vocation'),
  frase: requireString(raw, 'frase', 'vocation'),
  dominantStat: requireStatKey(raw, 'dominantStat', 'vocation'),
});

const toSpecializationClass = (
  raw: Record<string, unknown>
): SpecializationClass => {
  const rawOptions: unknown = raw.legendaryOptions;
  if (
    !Array.isArray(rawOptions) ||
    rawOptions.length !== 2 ||
    typeof rawOptions[0] !== 'string' ||
    typeof rawOptions[1] !== 'string'
  ) {
    throw new MappingError(
      'specialization: legendaryOptions must be a tuple of two strings'
    );
  }
  const legendaryOptions: readonly [string, string] = [
    rawOptions[0],
    rawOptions[1],
  ];
  return {
    id: requireString(raw, 'id', 'specialization'),
    tier: requireTier(raw, 2, 'specialization'),
    name: requireString(raw, 'name', 'specialization'),
    frase: requireString(raw, 'frase', 'specialization'),
    lineage: requireLineageId(raw, 'lineage', 'specialization'),
    secondaryStat: requireStatKey(raw, 'secondaryStat', 'specialization'),
    legendaryOptions,
  };
};

const toLegendaryClass = (raw: Record<string, unknown>): LegendaryClass => {
  const requiredStats = raw.requiredStats;
  if (
    !Array.isArray(requiredStats) ||
    requiredStats.length === 0 ||
    requiredStats.some(
      (s) => typeof s !== 'string' || !STAT_KEY_SET.has(s as StatKey)
    )
  ) {
    throw new MappingError(
      'legendary: requiredStats must be a non-empty array of stat keys'
    );
  }
  return {
    id: requireString(raw, 'id', 'legendary'),
    tier: requireTier(raw, 3, 'legendary'),
    name: requireString(raw, 'name', 'legendary'),
    frase: requireString(raw, 'frase', 'legendary'),
    iconHint: requireString(raw, 'iconHint', 'legendary'),
    requiredStats: requiredStats as readonly StatKey[],
    transcendentName: requireString(raw, 'transcendentName', 'legendary'),
    transcendentFrase: requireString(raw, 'transcendentFrase', 'legendary'),
  };
};

const toPendingChoice = (dto: PendingChoiceDTO): PendingChoice => {
  if (dto.tier === 1) {
    return {
      tier: 1,
      options: dto.options.map(toVocationClass),
      recommendedId: dto.recommendedId,
    };
  }
  if (dto.tier === 2) {
    return {
      tier: 2,
      options: dto.options.map(toSpecializationClass),
      recommendedId: dto.recommendedId,
    };
  }
  if (dto.tier === 3) {
    return {
      tier: 3,
      options: dto.options.map(toLegendaryClass),
      recommendedId: dto.recommendedId,
    };
  }
  throw new MappingError(`pendingChoice: unknown tier ${String(dto.tier)}`);
};

const toLegendaryStage = (raw: string | null): ClassTierStage | null => {
  if (raw === null) return null;
  if (!VALID_TIER_STAGES.has(raw as ClassTierStage)) {
    throw new MappingError(`legendaryStage: unknown value "${raw}"`);
  }
  return raw as ClassTierStage;
};

const toCurrentTier = (raw: number): ClassTier => {
  if (!Number.isInteger(raw) || raw < 0 || raw > 6 || raw === 4) {
    // T4 is a stage (TRANSCENDENT) on top of T3, never the literal current_tier
    // for a regular class — but the server may surface 4 transiently. Permit it.
    if (raw === 4) return raw as ClassTier;
    throw new MappingError(`currentTier out of range: ${raw}`);
  }
  return raw as ClassTier;
};

export class CharacterStateFromDTO {
  static fromDTO(dto: CharacterStateDTO): CharacterState {
    return {
      currentTier: toCurrentTier(dto.currentTier),
      heroLevel: dto.heroLevel,
      novice: toNoviceClass(dto.novice),
      vocation: dto.vocation ? toVocationClass(dto.vocation) : null,
      specialization: dto.specialization
        ? toSpecializationClass(dto.specialization)
        : null,
      legendary: dto.legendary ? toLegendaryClass(dto.legendary) : null,
      legendaryStage: toLegendaryStage(dto.legendaryStage),
      isMaestroSupremo: Boolean(dto.isMaestroSupremo),
      isLeyenda: Boolean(dto.isLeyenda),
      pendingChoice: dto.pendingChoice
        ? toPendingChoice(dto.pendingChoice)
        : null,
    };
  }
}
