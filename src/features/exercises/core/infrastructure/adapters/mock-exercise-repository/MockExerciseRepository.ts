import type {
  ExerciseRepository,
  ExerciseSearchResult,
} from '../../../application/ports/ExerciseRepository';
import type { Exercise } from '../../../domain/models/Exercise';

const MOCK_EXERCISES: Exercise[] = [
  {
    id: '0025',
    name: 'Barbell Bench Press',
    target: 'pectorals',
    equipment: 'barbell',
    difficulty: 'intermediate',
    imageUrl: '/exercises/image/mock',
  },
  {
    id: '0030',
    name: 'Incline Barbell Bench Press',
    target: 'pectorals',
    equipment: 'barbell',
    difficulty: 'intermediate',
    imageUrl: '/exercises/image/mock',
  },
  {
    id: '0035',
    name: 'Dumbbell Fly',
    target: 'pectorals',
    equipment: 'dumbbell',
    difficulty: 'beginner',
    imageUrl: '/exercises/image/mock',
  },
  {
    id: '0662',
    name: 'Push Up',
    target: 'pectorals',
    equipment: 'body weight',
    difficulty: 'beginner',
    imageUrl: '/exercises/image/mock',
  },
  {
    id: '0652',
    name: 'Pull Up',
    target: 'lats',
    equipment: 'body weight',
    difficulty: 'intermediate',
    imageUrl: '/exercises/image/mock',
  },
  {
    id: '0655',
    name: 'Lat Pulldown',
    target: 'lats',
    equipment: 'cable',
    difficulty: 'beginner',
    imageUrl: '/exercises/image/mock',
  },
  {
    id: '0660',
    name: 'Barbell Row',
    target: 'lats',
    equipment: 'barbell',
    difficulty: 'intermediate',
    imageUrl: '/exercises/image/mock',
  },
  {
    id: '0100',
    name: 'Overhead Press',
    target: 'delts',
    equipment: 'barbell',
    difficulty: 'intermediate',
    imageUrl: '/exercises/image/mock',
  },
  {
    id: '0105',
    name: 'Lateral Raise',
    target: 'delts',
    equipment: 'dumbbell',
    difficulty: 'beginner',
    imageUrl: '/exercises/image/mock',
  },
  {
    id: '0200',
    name: 'Barbell Curl',
    target: 'biceps',
    equipment: 'barbell',
    difficulty: 'beginner',
    imageUrl: '/exercises/image/mock',
  },
  {
    id: '0205',
    name: 'Dumbbell Hammer Curl',
    target: 'biceps',
    equipment: 'dumbbell',
    difficulty: 'beginner',
    imageUrl: '/exercises/image/mock',
  },
  {
    id: '0300',
    name: 'Triceps Pushdown',
    target: 'triceps',
    equipment: 'cable',
    difficulty: 'beginner',
    imageUrl: '/exercises/image/mock',
  },
  {
    id: '0305',
    name: 'Overhead Triceps Extension',
    target: 'triceps',
    equipment: 'dumbbell',
    difficulty: 'intermediate',
    imageUrl: '/exercises/image/mock',
  },
  {
    id: '0043',
    name: 'Barbell Squat',
    target: 'quads',
    equipment: 'barbell',
    difficulty: 'intermediate',
    imageUrl: '/exercises/image/mock',
  },
  {
    id: '0045',
    name: 'Leg Press',
    target: 'quads',
    equipment: 'leverage machine',
    difficulty: 'beginner',
    imageUrl: '/exercises/image/mock',
  },
  {
    id: '0046',
    name: 'Leg Extension',
    target: 'quads',
    equipment: 'leverage machine',
    difficulty: 'beginner',
    imageUrl: '/exercises/image/mock',
  },
  {
    id: '0050',
    name: 'Romanian Deadlift',
    target: 'hamstrings',
    equipment: 'barbell',
    difficulty: 'intermediate',
    imageUrl: '/exercises/image/mock',
  },
  {
    id: '0055',
    name: 'Leg Curl',
    target: 'hamstrings',
    equipment: 'leverage machine',
    difficulty: 'beginner',
    imageUrl: '/exercises/image/mock',
  },
  {
    id: '0032',
    name: 'Deadlift',
    target: 'glutes',
    equipment: 'barbell',
    difficulty: 'expert',
    imageUrl: '/exercises/image/mock',
  },
  {
    id: '0033',
    name: 'Hip Thrust',
    target: 'glutes',
    equipment: 'barbell',
    difficulty: 'intermediate',
    imageUrl: '/exercises/image/mock',
  },
  {
    id: '0400',
    name: 'Crunches',
    target: 'abs',
    equipment: 'body weight',
    difficulty: 'beginner',
    imageUrl: '/exercises/image/mock',
  },
  {
    id: '0405',
    name: 'Hanging Leg Raise',
    target: 'abs',
    equipment: 'body weight',
    difficulty: 'intermediate',
    imageUrl: '/exercises/image/mock',
  },
  {
    id: '0500',
    name: 'Standing Calf Raise',
    target: 'calves',
    equipment: 'leverage machine',
    difficulty: 'beginner',
    imageUrl: '/exercises/image/mock',
  },
  {
    id: '0600',
    name: 'Barbell Shrug',
    target: 'traps',
    equipment: 'barbell',
    difficulty: 'beginner',
    imageUrl: '/exercises/image/mock',
  },
];

const PAGE_SIZE = 4;

export class MockExerciseRepository implements ExerciseRepository {
  async searchExercises(
    search?: string,
    muscle?: string,
    _token?: string,
    _signal?: AbortSignal,
    page = 1,
    limit = PAGE_SIZE
  ): Promise<ExerciseSearchResult> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const filtered = MOCK_EXERCISES.filter((exercise) => {
      const matchesMuscle = muscle ? exercise.target === muscle : true;
      const matchesSearch = search
        ? exercise.name.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesMuscle && matchesSearch;
    });

    const offset = (page - 1) * limit;
    return {
      data: filtered.slice(offset, offset + limit),
      total: filtered.length,
    };
  }
}
