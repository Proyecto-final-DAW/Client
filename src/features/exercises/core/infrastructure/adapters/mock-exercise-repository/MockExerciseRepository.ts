import type { ExerciseRepository } from '../../../application/ports/ExerciseRepository';
import type { Exercise } from '../../../domain/models/Exercise';

const MOCK_EXERCISES: Exercise[] = [
  {
    name: 'Barbell Bench Press',
    gifUrl: 'https://v2.exercisedb.io/image/ANb4HQlSHmRVZo',
    target: 'pectorals',
  },
  {
    name: 'Push Up',
    gifUrl: 'https://v2.exercisedb.io/image/HRDMHObEL6AMGN',
    target: 'pectorals',
  },
  {
    name: 'Pull Up',
    gifUrl: 'https://v2.exercisedb.io/image/AuJhWEkiA2QRAX',
    target: 'lats',
  },
  {
    name: 'Squat',
    gifUrl: 'https://v2.exercisedb.io/image/qFQMp0j3j2IAZN',
    target: 'quads',
  },
  {
    name: 'Deadlift',
    gifUrl: 'https://v2.exercisedb.io/image/5fOhDNwiIiZnNF',
    target: 'glutes',
  },
];

export class MockExerciseRepository implements ExerciseRepository {
  async searchExercises(search?: string, muscle?: string): Promise<Exercise[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return MOCK_EXERCISES.filter((exercise) => {
      const matchesMuscle = muscle ? exercise.target === muscle : true;
      const matchesSearch = search
        ? exercise.name.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesMuscle && matchesSearch;
    });
  }
}
