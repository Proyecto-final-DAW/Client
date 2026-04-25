import { ExerciseSearch } from './components/ExerciseSearch';

export const ExercisesView = (): React.JSX.Element => {
  return (
    <div className="flex min-h-screen items-start bg-background p-6">
      <div className="w-full max-w-5xl mx-auto">
        <ExerciseSearch />
      </div>
    </div>
  );
};
