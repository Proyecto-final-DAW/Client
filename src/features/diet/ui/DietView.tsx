import type React from 'react';

import { DietSummaryCard } from './components/DietSummaryCard';

export const DietView = (): React.JSX.Element => {
  return (
    <main className="min-h-screen bg-gray-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        <header>
          <p className="text-sm font-medium text-blue-400">Dashboard</p>
          <h1 className="mt-2 text-3xl font-bold text-white">
            Resumen nutricional
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-400">
            Consulta tus calorías diarias objetivo y la distribución de macros
            recomendada según tu perfil actual.
          </p>
        </header>

        <DietSummaryCard />
      </section>
    </main>
  );
};
