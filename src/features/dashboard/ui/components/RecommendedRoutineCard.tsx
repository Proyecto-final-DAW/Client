import type React from 'react';
import { Link } from 'react-router-dom';

import { PixelCorners } from '../../../../shared/components/PixelCorners';
import { useTemplateCatalog } from '../../../templates/ui/hooks/useTemplateCatalog';

const GOAL_LABEL: Record<string, string> = {
  GAIN_MUSCLE: 'Ganar musculo',
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
      <article className="relative flex h-full flex-col items-center justify-center border-2 border-border bg-card p-6 text-center">
        <PixelCorners size="md" className="border-border-muted" />
        <p className="font-pixel text-[10px] tracking-widest text-ink-muted">
          ▸ RUTINA RECOMENDADA
        </p>
        <p className="mx-auto mt-4 max-w-md font-pixel-mono text-base leading-tight text-ink-muted">
          Completa tu perfil (equipamiento y experiencia) para que te
          recomendemos un plan.
        </p>
        <div className="mt-5">
          <Link
            to="/templates"
            className="inline-block font-pixel text-[9px] tracking-widest border-2 border-border px-4 py-3 text-ink-muted hover:border-green-500/40 hover:text-green-400 transition-colors"
          >
            VER PLANTILLAS
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="relative flex h-full flex-col border-2 border-green-500/60 bg-card p-6 sm:p-8 shadow-[0_0_0_4px_rgba(10,10,15,0.6),0_0_60px_rgba(34,197,94,0.18)]">
      <PixelCorners size="md" className="border-green-500/60" />

      <header>
        <span className="inline-flex items-center gap-2 border-2 border-green-500/50 bg-green-500/10 px-3 py-1.5 font-pixel text-[9px] sm:text-[10px] tracking-widest text-green-400 [text-shadow:0_0_8px_rgba(34,197,94,0.45)]">
          ★ RECOMENDADA PARA TI
        </span>
        <h3 className="mt-4 font-pixel text-sm sm:text-base leading-relaxed text-green-400 [text-shadow:0_0_14px_rgba(34,197,94,0.55)] break-words">
          {top.name.toUpperCase()}
        </h3>
        <p className="mt-3 font-pixel-mono text-base leading-snug text-[#d4d4d8]">
          {top.description}
        </p>
      </header>

      {/* my-auto centers the footer vertically in the leftover space below
          the header. Auto margins on top AND bottom split the spare height
          evenly, so the action block sits in the visual center of the card
          instead of pinned to either edge. */}
      <div className="my-auto pt-5 border-t-2 border-border flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <dl className="grid grid-cols-3 gap-x-8 gap-y-1">
          <div>
            <dt className="font-pixel text-[7px] tracking-widest text-ink-faint">
              OBJETIVO
            </dt>
            <dd className="mt-2 font-pixel-mono text-base text-green-400">
              {GOAL_LABEL[top.goal] ?? top.goal}
            </dd>
          </div>
          <div>
            <dt className="font-pixel text-[7px] tracking-widest text-ink-faint">
              NIVEL
            </dt>
            <dd className="mt-2 font-pixel-mono text-base text-green-400">
              {LEVEL_LABEL[top.level] ?? top.level}
            </dd>
          </div>
          <div>
            <dt className="font-pixel text-[7px] tracking-widest text-ink-faint">
              DIAS
            </dt>
            <dd className="mt-2 font-pixel-mono text-base text-green-400">
              {top.daysPerWeek}/sem
            </dd>
          </div>
        </dl>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Link
            to="/templates"
            className="font-pixel text-[9px] tracking-widest border-2 border-border-muted px-4 py-3 text-ink-muted hover:border-green-500/40 hover:text-green-400 transition-colors text-center"
          >
            VER MAS
          </Link>
          <Link
            to={`/templates/${top.id}`}
            className="font-pixel text-[10px] tracking-widest bg-green-500 text-[#0a0a0f] px-5 py-3 border-b-4 border-green-700 hover:bg-green-400 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(34,197,94,0.35)] text-center"
          >
            ▶ ABRIR
          </Link>
        </div>
      </div>
    </article>
  );
};
