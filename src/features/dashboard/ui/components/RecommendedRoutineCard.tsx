import type React from 'react';
import { Link } from 'react-router-dom';

import { useTemplateCatalog } from '../../../templates/ui/hooks/useTemplateCatalog';

const GOAL_LABEL: Record<string, string> = {
  GAIN_MUSCLE: 'Ganar músculo',
  LOSE_FAT: 'Perder grasa',
  MAINTAIN: 'Mantenerse',
  HEALTH: 'Salud',
};

const LEVEL_LABEL: Record<string, string> = {
  BEGINNER: 'Principiante',
  INTERMEDIATE: 'Intermedio',
  ADVANCED: 'Avanzado',
};

/**
 * Top recommendation surfaced on the dashboard so the user sees their best
 * match without having to revisit /templates after onboarding.
 */
export const RecommendedRoutineCard = (): React.JSX.Element | null => {
  const { recommendedTemplates, loading } = useTemplateCatalog();

  if (loading) return null;

  const top = recommendedTemplates[0];
  if (!top) {
    return (
      <article className="border-2 border-[#1e1e2e] bg-[#0d0d14] p-4">
        <p className="font-['Press_Start_2P'] text-[9px] tracking-widest text-[#a1a1aa]">
          ▸ RUTINA RECOMENDADA
        </p>
        <p className="mt-3 font-['VT323'] text-base text-[#a1a1aa]">
          Completa tu perfil (equipamiento y experiencia) para que te
          recomendemos un plan.
        </p>
        <Link
          to="/templates"
          className="mt-4 inline-block font-['Press_Start_2P'] text-[9px] tracking-widest border-2 border-[#1e1e2e] px-3 py-2 text-[#a1a1aa] hover:border-green-500/40 hover:text-green-400 transition-colors"
        >
          VER PLANTILLAS
        </Link>
      </article>
    );
  }

  return (
    <article className="border-2 border-green-500/50 bg-[#0d0d14] p-4 shadow-[0_0_18px_rgba(34,197,94,0.18)]">
      <p className="font-['Press_Start_2P'] text-[9px] tracking-widest text-green-500">
        ★ RECOMENDADA PARA TI
      </p>
      <h3 className="mt-3 font-['Press_Start_2P'] text-[11px] leading-relaxed text-green-400 [text-shadow:0_0_12px_rgba(34,197,94,0.5)]">
        {top.name.toUpperCase()}
      </h3>
      <p className="mt-2 font-['VT323'] text-base leading-tight text-[#d4d4d8]">
        {top.description}
      </p>
      <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div>
          <dt className="font-['Press_Start_2P'] text-[7px] tracking-widest text-[#71717a]">
            OBJETIVO
          </dt>
          <dd className="mt-1 font-['VT323'] text-base text-[#e4e4e7]">
            {GOAL_LABEL[top.goal] ?? top.goal}
          </dd>
        </div>
        <div>
          <dt className="font-['Press_Start_2P'] text-[7px] tracking-widest text-[#71717a]">
            NIVEL
          </dt>
          <dd className="mt-1 font-['VT323'] text-base text-[#e4e4e7]">
            {LEVEL_LABEL[top.level] ?? top.level}
          </dd>
        </div>
        <div>
          <dt className="font-['Press_Start_2P'] text-[7px] tracking-widest text-[#71717a]">
            DÍAS
          </dt>
          <dd className="mt-1 font-['VT323'] text-base text-[#e4e4e7]">
            {top.daysPerWeek}/sem
          </dd>
        </div>
      </dl>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Link
          to="/templates"
          className="font-['Press_Start_2P'] text-[9px] tracking-widest border-2 border-[#1e1e2e] px-3 py-2 text-[#a1a1aa] hover:border-green-500/40 hover:text-green-400 transition-colors"
        >
          VER MÁS
        </Link>
        <Link
          to={`/templates/${top.id}`}
          className="font-['Press_Start_2P'] text-[9px] tracking-widest bg-green-500 text-[#0a0a0f] px-3 py-2 border-b-4 border-green-700 hover:bg-green-400 hover:border-green-600 active:border-b-0 active:mt-1 transition-all"
        >
          ▶ ABRIR
        </Link>
      </div>
    </article>
  );
};
