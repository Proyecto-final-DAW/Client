import { ExerciseSearch } from './components/ExerciseSearch';

export const ExercisesView = (): React.JSX.Element => {
  return (
    <div className="mx-auto max-w-5xl text-ink">
      <header className="mb-6">
        <p className="font-pixel text-[9px] tracking-widest text-green-500">
          ▶ EJERCICIOS
        </p>
        <h1 className="mt-2 font-pixel text-base sm:text-lg tracking-widest text-green-400 [text-shadow:0_0_16px_rgba(34,197,94,0.55)]">
          BIBLIOTECA
        </h1>
        <p className="mt-2 font-pixel text-base sm:text-lg text-ink-muted">
          Busca por nombre o filtra por grupo muscular.
        </p>
      </header>

      <ExerciseSearch />
    </div>
  );
};
