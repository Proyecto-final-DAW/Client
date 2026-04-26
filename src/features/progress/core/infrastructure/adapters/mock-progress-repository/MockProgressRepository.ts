import type { ProgressRepository } from '../../../application/ports/ProgressRepository';
import type { ExerciseProgressPoint } from '../../../domain/models/ExerciseProgressPoint';
import type { PerformedExercise } from '../../../domain/models/PerformedExercise';
import type {
  Progress,
  RegisterWeightInput,
} from '../../../domain/models/Progress';

type MockExercise = {
  id: string;
  name: string;
  base: number;
  gain: number;
};

const EXERCISES: MockExercise[] = [
  { id: 'bench-press', name: 'Press banca', base: 50, gain: 1.25 },
  { id: 'squat', name: 'Sentadilla', base: 70, gain: 2.5 },
  { id: 'deadlift', name: 'Peso muerto', base: 85, gain: 2.5 },
  { id: 'overhead-press', name: 'Press militar', base: 30, gain: 1.0 },
  { id: 'bicep-curl', name: 'Curl bíceps', base: 12, gain: 0.5 },
];

const SESSIONS = 10;
const DAYS_BACK = 90;

const SEED_HISTORY: Progress[] = [
  { date: new Date('2026-04-01'), weight: 72 },
  { date: new Date('2026-04-05'), weight: 71.5 },
  { date: new Date('2026-04-10'), weight: 71 },
  { date: new Date('2026-04-15'), weight: 70.8 },
  { date: new Date('2026-04-20'), weight: 70.5 },
];

const toISODate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const buildProgression = (exercise: MockExercise): ExerciseProgressPoint[] => {
  const today = new Date();
  const points: ExerciseProgressPoint[] = [];
  const spacing = Math.floor(DAYS_BACK / SESSIONS);

  for (let i = 0; i < SESSIONS; i++) {
    const daysAgo = DAYS_BACK - i * spacing;
    const date = new Date(today);
    date.setDate(today.getDate() - daysAgo);

    const variance = i === 5 ? -exercise.gain : 0;
    const maxWeight = exercise.base + i * exercise.gain + variance;
    const reps = 5 + (i % 3);

    points.push({
      date: toISODate(date),
      maxWeight: Math.round(maxWeight * 4) / 4,
      reps,
    });
  }

  return points;
};

export class MockProgressRepository implements ProgressRepository {
  private history: Progress[] = structuredClone(SEED_HISTORY);

  async getPerformedExercises(
    userId: number,
    token: string
  ): Promise<PerformedExercise[]> {
    void userId;
    void token;
    await this.delay(200);
    return EXERCISES.map(({ id, name }) => ({ id, name }));
  }

  async getExerciseProgress(
    userId: number,
    exerciseId: string,
    token: string
  ): Promise<ExerciseProgressPoint[]> {
    void userId;
    void token;
    await this.delay(300);
    const exercise = EXERCISES.find((e) => e.id === exerciseId);
    if (!exercise) return [];
    return buildProgression(exercise);
  }

  async getWeightHistory(
    _userId: number,
    _token?: string
  ): Promise<Progress[]> {
    await this.delay(300);

    return structuredClone(this.history);
  }

  async registerWeight(
    _userId: number,
    input: RegisterWeightInput,
    _token?: string
  ): Promise<Progress> {
    await this.delay(300);

    const entry: Progress = {
      date: new Date(input.date),
      weight: input.weight,
    };

    this.history = [...this.history, entry];

    return structuredClone(entry);
  }

  private async delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
