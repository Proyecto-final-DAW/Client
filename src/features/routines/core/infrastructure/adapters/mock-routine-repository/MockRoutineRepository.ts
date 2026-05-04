import type { Exercise } from '../../../../../exercises/core/domain/models/Exercise';
import type { RoutineRepository } from '../../../application/ports/RoutineRepository';
import type { Routine } from '../../../domain/models/Routine';

const MOCK_EXERCISE_CATALOG: Exercise[] = [
  {
    id: 'bench-press',
    name: 'Press banca',
    target: 'pectorals',
    equipment: 'barbell',
    difficulty: 'intermediate',
    imageUrl: '/images/exercises/bench-press.jpg',
  },
  {
    id: 'incline-dumbbell-press',
    name: 'Press inclinado mancuernas',
    target: 'pectorals',
    equipment: 'dumbbell',
    difficulty: 'intermediate',
    imageUrl: '/images/exercises/incline-dumbbell-press.jpg',
  },
  {
    id: 'dips',
    name: 'Fondos',
    target: 'pectorals',
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    imageUrl: '/images/exercises/dips.jpg',
  },
  {
    id: 'lateral-raises',
    name: 'Elevaciones laterales',
    target: 'delts',
    equipment: 'dumbbell',
    difficulty: 'beginner',
    imageUrl: '/images/exercises/lateral-raises.jpg',
  },
  {
    id: 'squat',
    name: 'Sentadilla',
    target: 'quads',
    equipment: 'barbell',
    difficulty: 'intermediate',
    imageUrl: '/images/exercises/squat.jpg',
  },
  {
    id: 'leg-press',
    name: 'Prensa',
    target: 'quads',
    equipment: 'machine',
    difficulty: 'beginner',
    imageUrl: '/images/exercises/leg-press.jpg',
  },
  {
    id: 'romanian-deadlift',
    name: 'Peso muerto rumano',
    target: 'hamstrings',
    equipment: 'barbell',
    difficulty: 'intermediate',
    imageUrl: '/images/exercises/romanian-deadlift.jpg',
  },
  {
    id: 'pull-up',
    name: 'Dominadas',
    target: 'lats',
    equipment: 'bodyweight',
    difficulty: 'intermediate',
    imageUrl: '/images/exercises/pull-up.jpg',
  },
  {
    id: 'barbell-row',
    name: 'Remo con barra',
    target: 'traps',
    equipment: 'barbell',
    difficulty: 'intermediate',
    imageUrl: '/images/exercises/barbell-row.jpg',
  },
  {
    id: 'biceps-curl',
    name: 'Curl biceps',
    target: 'biceps',
    equipment: 'dumbbell',
    difficulty: 'beginner',
    imageUrl: '/images/exercises/biceps-curl.jpg',
  },
];

const MOCK_ROUTINES: Routine[] = [
  {
    id: '1',
    name: 'Push Day',
    description: null,
    exercises: [
      MOCK_EXERCISE_CATALOG[0],
      MOCK_EXERCISE_CATALOG[1],
      MOCK_EXERCISE_CATALOG[2],
      MOCK_EXERCISE_CATALOG[3],
    ],
  },
  {
    id: '2',
    name: 'Pierna',
    description: null,
    exercises: [
      MOCK_EXERCISE_CATALOG[4],
      MOCK_EXERCISE_CATALOG[5],
      MOCK_EXERCISE_CATALOG[6],
    ],
  },
  {
    id: '3',
    name: 'Espalda y biceps',
    description: null,
    exercises: [
      MOCK_EXERCISE_CATALOG[7],
      MOCK_EXERCISE_CATALOG[8],
      MOCK_EXERCISE_CATALOG[9],
    ],
  },
];

export class MockRoutineRepository implements RoutineRepository {
  private routines: Routine[] = structuredClone(MOCK_ROUTINES);

  async getRoutines(_token?: string): Promise<Routine[]> {
    await this.delay();

    return structuredClone(this.routines);
  }

  async createRoutine(name: string, _token?: string): Promise<Routine> {
    await this.delay();

    const newRoutine: Routine = {
      id: crypto.randomUUID(),
      name,
      description: null,
      exercises: [],
    };

    this.routines = [...this.routines, newRoutine];

    return structuredClone(newRoutine);
  }

  async addExercise(
    routine: Routine,
    exercise: Exercise,
    _token?: string
  ): Promise<Routine> {
    await this.delay();

    const alreadyExists = routine.exercises.some(
      (current) => current.id === exercise.id
    );
    const nextExercises = alreadyExists
      ? routine.exercises
      : [...routine.exercises, exercise];

    return this.replaceExercises(routine.id, nextExercises);
  }

  async removeExercise(
    routine: Routine,
    exerciseId: string,
    _token?: string
  ): Promise<Routine> {
    await this.delay();

    const nextExercises = routine.exercises.filter(
      (exercise) => exercise.id !== exerciseId
    );

    return this.replaceExercises(routine.id, nextExercises);
  }

  async reorderExercises(
    routine: Routine,
    exercises: Exercise[],
    _token?: string
  ): Promise<Routine> {
    await this.delay();
    return this.replaceExercises(routine.id, exercises);
  }

  async deleteRoutine(routineId: string, _token?: string): Promise<void> {
    await this.delay();

    this.routines = this.routines.filter((routine) => routine.id !== routineId);
  }

  private replaceExercises(routineId: string, exercises: Exercise[]): Routine {
    let updatedRoutine: Routine | undefined;

    this.routines = this.routines.map((routine) => {
      if (routine.id !== routineId) return routine;

      updatedRoutine = { ...routine, exercises };
      return updatedRoutine;
    });

    if (!updatedRoutine) {
      throw new Error('Rutina no encontrada');
    }

    return structuredClone(updatedRoutine);
  }

  private async delay(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
}
