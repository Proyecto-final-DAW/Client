import type React from 'react';

import { DietSummaryCard } from './components/DietSummaryCard';
import { useDiet } from './hooks/useDiet';

export const DietView = (): React.JSX.Element => {
  const { diet, loading, refreshing, error, refetch } = useDiet();

  return (
    <section className="mx-auto max-w-5xl text-[#e4e4e7]">
      <header className="mb-6">
        <p className="font-['Press_Start_2P'] text-[9px] tracking-widest text-green-500">
          ▶ DIETA
        </p>
        <h1 className="mt-2 font-['Press_Start_2P'] text-base sm:text-lg tracking-widest text-green-400 [text-shadow:0_0_16px_rgba(34,197,94,0.55)]">
          RESUMEN NUTRICIONAL
        </h1>
        <p className="mt-3 font-['VT323'] text-xl leading-snug text-[#a1a1aa]">
          Calorias diarias y distribucion de macros calculadas desde tu perfil.
        </p>
      </header>

      <DietSummaryCard
        diet={diet}
        loading={loading}
        refreshing={refreshing}
        error={error}
        onRefresh={refetch}
      />
    </section>
  );
};
