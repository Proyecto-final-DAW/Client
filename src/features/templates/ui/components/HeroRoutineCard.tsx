import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { PixelCorners } from '@shared/components/PixelCorners';
import { Link } from 'react-router-dom';

import type { RoutineTemplate } from '../../core/domain/models/RoutineTemplate';
import { LEVEL_LABELS } from '../labels';

type Props = {
  template: RoutineTemplate;
  /**
   * True when the user already has routines from this template (any
   * routine whose `description` matches `template.name`). Switches
   * the eyebrow from "MEJOR PARA TI" to a gold "EN USO" badge and
   * recolours the frame so the card reads at a glance as "this is
   * the one you're already on".
   */
  inUse?: boolean;
};

/**
 * Hero card surfaced at the top of the templates page — the single best
 * match for the user. Larger, more breathable layout, prominent CTA. The
 * "browse all" experience uses the smaller TemplateCard.
 */
export const HeroRoutineCard = (props: Props): React.JSX.Element => {
  const { template, inUse = false } = props;

  const frameClass = inUse
    ? 'border-orange-400/70 shadow-[0_0_0_4px_rgba(10,10,15,0.6),0_0_60px_rgba(251,146,60,0.16)]'
    : 'border-green-500/60 shadow-[0_0_0_4px_rgba(10,10,15,0.6),0_0_60px_rgba(34,197,94,0.18)]';

  const titleClass = inUse
    ? 'text-orange-300 [text-shadow:0_0_14px_rgba(251,146,60,0.45)]'
    : 'text-green-400 [text-shadow:0_0_14px_rgba(34,197,94,0.55)]';

  const ctaClass = inUse
    ? 'font-pixel text-[10px] tracking-widest bg-orange-400 text-[#0a0a0f] px-6 py-3 border-b-4 border-orange-600 hover:bg-orange-300 hover:border-orange-500 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(251,146,60,0.32)] text-center'
    : 'font-pixel text-[10px] tracking-widest bg-green-500 text-[#0a0a0f] px-6 py-3 border-b-4 border-green-700 hover:bg-green-400 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(34,197,94,0.35)] text-center';

  return (
    <article className={`relative border-2 bg-card p-6 sm:p-8 ${frameClass}`}>
      <PixelCorners
        size="md"
        className={inUse ? 'border-orange-400/70' : 'border-green-500/60'}
      />

      {inUse ? (
        <p className="inline-flex items-center gap-1.5 font-pixel text-[9px] sm:text-[10px] tracking-widest text-orange-300 [text-shadow:0_0_10px_rgba(251,146,60,0.45)]">
          <CheckCircleIcon className="h-3.5 w-3.5" />
          EN USO
        </p>
      ) : (
        <p className="font-pixel text-[9px] sm:text-[10px] tracking-widest text-green-500">
          ★ MEJOR PARA TI
        </p>
      )}

      <h2
        className={`mt-3 font-pixel text-sm sm:text-base leading-relaxed break-words ${titleClass}`}
      >
        {template.name.toUpperCase()}
      </h2>

      <p className="mt-3 font-pixel-mono text-lg leading-snug text-ink">
        {template.description}
      </p>

      {/* Chip + meta share Press_Start_2P at the same size so the row reads
          as one typographic unit instead of "small label / big prose". */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span
          className={`font-pixel text-[10px] tracking-widest border-2 px-2 py-1 ${
            inUse
              ? 'border-orange-400/50 bg-orange-400/10 text-orange-300'
              : 'border-green-500/40 bg-green-500/10 text-green-400'
          }`}
        >
          {LEVEL_LABELS[template.level]}
        </span>
        <span className="font-pixel text-[10px] tracking-widest text-ink-muted">
          {template.daysPerWeek} DIAS/SEM · ~{template.estimatedDurationMin} MIN
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Link to={`/templates/${template.id}`} className={ctaClass}>
          ▶ VER PLAN
        </Link>
      </div>
    </article>
  );
};
