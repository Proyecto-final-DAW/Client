import type React from 'react';

import { SessionHistoryContent } from './components/SessionHistoryContent';

export const SessionHistoryView = (): React.JSX.Element => {
  return (
    <main className="min-h-screen bg-gray-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        <header>
          <p className="text-sm font-medium text-blue-400">Historial</p>
          <h1 className="mt-2 text-3xl font-bold text-white">
            Historial de sesiones
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Revisa tus entrenamientos anteriores, rutinas asociadas y notas.
          </p>
        </header>

        <SessionHistoryContent />
      </section>
    </main>
  );
};
