import type { RoutineRepository } from '../../../application/ports/RoutineRepository';
import type { Routine } from '../../../domain/models/Routine';

export class MockRoutineRepository implements RoutineRepository {
  async getRoutines(token: string): Promise<Routine[]> {
    void token;

    await new Promise((resolve) => setTimeout(resolve, 400));

    const initialRoutines: Routine[] = [
      {
        id: 1,
        name: 'Push Day',
        exercises: [
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
        ],
      },
      {
        id: 2,
        name: 'Pierna',
        exercises: [
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
        ],
      },
      {
        id: 3,
        name: 'Espalda y bíceps',
        exercises: [
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
        ],
      },
    ];

    return initialRoutines;
  }
}
