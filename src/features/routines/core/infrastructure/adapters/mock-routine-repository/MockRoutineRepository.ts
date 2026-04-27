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
    name: 'Curl bíceps',
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
    exercises: [
      MOCK_EXERCISE_CATALOG[4],
      MOCK_EXERCISE_CATALOG[5],
      MOCK_EXERCISE_CATALOG[6],
    ],
  },
  {
    id: '3',
    name: 'Espalda y bíceps',
    exercises: [
      MOCK_EXERCISE_CATALOG[7],
      MOCK_EXERCISE_CATALOG[8],
      MOCK_EXERCISE_CATALOG[9],
    ],
  },
];

export class MockRoutineRepository implements RoutineRepository {
  private routines: Routine[] = [...MOCK_ROUTINES];

  async getRoutines(): Promise<Routine[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    return this.routines.map((routine) => ({
      ...routine,
      exercises: routine.exercises.map((exercise) => ({ ...exercise })),
    }));
  }

  async createRoutine(name: string): Promise<Routine> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const newRoutine: Routine = {
      id: crypto.randomUUID(),
      name,
      exercises: [],
    };

    this.routines = [...this.routines, newRoutine];

    return { ...newRoutine, exercises: [] };
  }

  async deleteRoutine(routineId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    this.routines = this.routines.filter((routine) => routine.id !== routineId);
  }

  async addExercise(routineId: string, exerciseId: string): Promise<Routine> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const exercise = MOCK_EXERCISE_CATALOG.find(
      (item) => item.id === exerciseId
    );

    if (!exercise) {
      throw new Error('Ejercicio no encontrado');
    }

    let updatedRoutine: Routine | undefined;

    this.routines = this.routines.map((routine) => {
      if (routine.id !== routineId) return routine;

      const alreadyExists = routine.exercises.some(
        (currentExercise) => currentExercise.id === exerciseId
      );

      updatedRoutine = alreadyExists
        ? routine
        : {
            ...routine,
            exercises: [...routine.exercises, exercise],
          };

      return updatedRoutine;
    });

    if (!updatedRoutine) {
      throw new Error('Rutina no encontrada');
    }

    return {
      ...updatedRoutine,
      exercises: updatedRoutine.exercises.map((item) => ({ ...item })),
    };
  }

  async removeExercise(
    routineId: string,
    exerciseId: string
  ): Promise<Routine> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    let updatedRoutine: Routine | undefined;

    this.routines = this.routines.map((routine) => {
      if (routine.id !== routineId) return routine;

      updatedRoutine = {
        ...routine,
        exercises: routine.exercises.filter(
          (exercise) => exercise.id !== exerciseId
        ),
      };

      return updatedRoutine;
    });

    if (!updatedRoutine) {
      throw new Error('Rutina no encontrada');
    }

    return {
      ...updatedRoutine,
      exercises: updatedRoutine.exercises.map((item) => ({ ...item })),
    };
  }

  async reorderExercises(routineId: string, order: string[]): Promise<Routine> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    let updatedRoutine: Routine | undefined;

    this.routines = this.routines.map((routine) => {
      if (routine.id !== routineId) return routine;

      const exercisesById = new Map(
        routine.exercises.map((exercise) => [exercise.id, exercise])
      );

      const reorderedExercises = order
        .map((exerciseId) => exercisesById.get(exerciseId))
        .filter((exercise): exercise is Exercise => Boolean(exercise));

      updatedRoutine = {
        ...routine,
        exercises: reorderedExercises,
      };

      return updatedRoutine;
    });

    if (!updatedRoutine) {
      throw new Error('Rutina no encontrada');
    }

    return {
      ...updatedRoutine,
      exercises: updatedRoutine.exercises.map((item) => ({ ...item })),
    };
  }
}
