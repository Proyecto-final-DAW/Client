import { BoltIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export const RoutinesHeader = () => {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="mb-2 text-sm font-medium text-blue-400">Rutinas</p>
        <h1 className="text-3xl font-bold tracking-tight">
          Tus entrenamientos
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Crea, organiza y reutiliza tus rutinas semanales.
        </p>
      </div>

      <Link
        to="/sessions/new"
        className="inline-flex items-center gap-2 self-start rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-gray-950 transition hover:bg-emerald-400"
      >
        <BoltIcon className="h-4 w-4" />
        Sesión libre
      </Link>
    </div>
  );
};
