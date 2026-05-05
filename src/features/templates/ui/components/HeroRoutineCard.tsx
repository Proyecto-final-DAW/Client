import { Link } from 'react-router-dom';

import { PixelCorners } from '../../../../shared/components/PixelCorners';
import type { RoutineTemplate } from '../../core/domain/models/RoutineTemplate';
import { LEVEL_LABELS } from '../labels';

type Props = {
  template: RoutineTemplate;
};

/**
 * Hero card surfaced at the top of the templates page — the single best
 * match for the user. Larger, more breathable layout, prominent CTA. The
 * "browse all" experience uses the smaller TemplateCard.
 */
export const HeroRoutineCard = (props: Props): React.JSX.Element => {
  const { template } = props;

  return (
    <article className="relative border-2 border-green-500/60 bg-card p-6 sm:p-8 shadow-[0_0_0_4px_rgba(10,10,15,0.6),0_0_60px_rgba(34,197,94,0.18)]">
      <PixelCorners size="md" className="border-green-500/60" />

      <p className="font-pixel text-[9px] sm:text-[10px] tracking-widest text-green-500">
        ★ MEJOR PARA TI
      </p>

      <h2 className="mt-3 font-pixel text-[12px] sm:text-sm leading-relaxed text-green-400 [text-shadow:0_0_14px_rgba(34,197,94,0.55)] break-words">
        {template.name.toUpperCase()}
      </h2>

      <p className="mt-3 font-pixel-mono text-lg leading-snug text-[#d4d4d8]">
        {template.description}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3 font-pixel-mono text-base text-ink-muted">
        <span className="font-pixel text-[9px] tracking-widest border-2 border-green-500/40 bg-green-500/10 text-green-400 px-2 py-1">
          {LEVEL_LABELS[template.level]}
        </span>
        <span>
          {template.daysPerWeek} días/semana · ~{template.estimatedDurationMin}{' '}
          min/sesión
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Link
          to={`/templates/${template.id}`}
          className="font-pixel text-[10px] tracking-widest bg-green-500 text-[#0a0a0f] px-6 py-3 border-b-4 border-green-700 hover:bg-green-400 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(34,197,94,0.35)] text-center"
        >
          ▶ VER PLAN
        </Link>
      </div>
    </article>
  );
};
