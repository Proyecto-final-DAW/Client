import type { MilestonesRepository } from '../../../application/ports/MilestonesRepository';
import type { Milestone } from '../../../domain/models/Milestone';

const toISO = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

const MOCK_MILESTONES: Milestone[] = [
  {
    id: 1,
    name: 'Primera sesión',
    description: 'Registra tu primer entrenamiento.',
    conditionType: 'TOTAL_SESSIONS',
    conditionValue: 1,
    icon: 'trophy',
    unlocked: true,
    unlockedAt: toISO(21),
  },
  {
    id: 2,
    name: 'Racha de 7 días',
    description: 'Entrena 7 días seguidos.',
    conditionType: 'STREAK',
    conditionValue: 7,
    icon: 'flame',
    unlocked: true,
    unlockedAt: toISO(0),
  },
  {
    id: 3,
    name: '10 sesiones',
    description: 'Completa 10 sesiones en total.',
    conditionType: 'TOTAL_SESSIONS',
    conditionValue: 10,
    icon: 'trophy',
    unlocked: true,
    unlockedAt: toISO(6),
  },
  {
    id: 4,
    name: 'Fuerza nivel 5',
    description: 'Alcanza nivel 5 en cualquier stat.',
    conditionType: 'STAT_LEVEL',
    conditionValue: 5,
    icon: 'bolt',
    unlocked: true,
    unlockedAt: toISO(3),
  },
  {
    id: 5,
    name: '1000 kg levantados',
    description: 'Acumula 1000 kg de volumen total.',
    conditionType: 'TOTAL_WEIGHT',
    conditionValue: 1000,
    icon: 'dumbbell',
    unlocked: false,
    unlockedAt: null,
  },
  {
    id: 6,
    name: 'Racha de 30 días',
    description: 'Entrena 30 días seguidos.',
    conditionType: 'STREAK',
    conditionValue: 30,
    icon: 'flame',
    unlocked: false,
    unlockedAt: null,
  },
  {
    id: 7,
    name: 'Nivel 10 en un stat',
    description: 'Alcanza nivel 10 en cualquier stat.',
    conditionType: 'STAT_LEVEL',
    conditionValue: 10,
    icon: 'star',
    unlocked: false,
    unlockedAt: null,
  },
  {
    id: 8,
    name: '50 sesiones',
    description: 'Completa 50 sesiones en total.',
    conditionType: 'TOTAL_SESSIONS',
    conditionValue: 50,
    icon: 'trophy',
    unlocked: false,
    unlockedAt: null,
  },
  {
    id: 9,
    name: '10000 kg levantados',
    description: 'Acumula 10 toneladas de volumen total.',
    conditionType: 'TOTAL_WEIGHT',
    conditionValue: 10000,
    icon: 'dumbbell',
    unlocked: false,
    unlockedAt: null,
  },
  {
    id: 10,
    name: 'Centenario',
    description: 'Completa 100 sesiones en total.',
    conditionType: 'TOTAL_SESSIONS',
    conditionValue: 100,
    icon: 'crown',
    unlocked: false,
    unlockedAt: null,
  },
];

export class MockMilestonesRepository implements MilestonesRepository {
  async getAllWithStatus(): Promise<Milestone[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_MILESTONES;
  }
}
