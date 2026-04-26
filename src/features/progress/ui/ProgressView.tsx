import type React from 'react';

import { WeightProgressContent } from './components/WeightProgressContent';

export const ProgressView = (): React.JSX.Element => {
  return (
    <main className="min-h-screen bg-gray-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        <header>
          <p className="text-sm text-blue-400">Progreso</p>
          <h1 className="text-3xl font-bold text-white">Seguimiento de peso</h1>
          <p className="text-sm text-gray-400">
            Visualiza cómo evoluciona tu peso a lo largo del tiempo.
          </p>
        </header>

        <WeightProgressContent />
      </section>
    </main>
  );
};
