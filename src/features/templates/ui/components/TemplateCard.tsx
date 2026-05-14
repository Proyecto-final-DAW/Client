import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { PixelCorners } from '@shared/components/PixelCorners';
import { Link } from 'react-router-dom';

import type { RoutineTemplate } from '../../core/domain/models/RoutineTemplate';
import { LEVEL_LABELS } from '../labels';

type Props = {
  template: RoutineTemplate;
  recommended?: boolean;
  /**
   * True when the user already has routines from this template.
   * Wins over `recommended` for visual styling — gold border + EN USO
   * ribbon — because "you already chose this one" is a stronger
   * signal than "we'd recommend it".
   */
  inUse?: boolean;
};

/**
 * Mini card used in the templates browse grid and the "Tambien para ti" rail.
 * Stripped to the essentials — name, level, days/week — to keep the page
 * scannable for new users. Full description / per-day breakdown lives on the
 * detail page.
 */
export const TemplateCard = (props: Props): React.JSX.Element => {
  const { template, recommended = false, inUse = false } = props;

  // Three style tiers: in-use (gold) > recommended (green halo) >
  // neutral.
  const borderClass = inUse
    ? 'border-orange-400/70 hover:border-orange-300 shadow-[0_0_12px_rgba(251,146,60,0.18)]'
    : recommended
      ? 'border-green-500/60 hover:border-green-400 shadow-[0_0_12px_rgba(34,197,94,0.18)]'
      : 'border-border hover:border-green-500/60';

  const cornersClass = inUse
    ? 'border-orange-400/70'
    : recommended
      ? 'border-green-400'
      : 'border-green-500/40';

  const titleClass = inUse
    ? 'text-orange-300 [text-shadow:0_0_10px_rgba(251,146,60,0.35)]'
    : 'text-green-400 [text-shadow:0_0_10px_rgba(34,197,94,0.4)]';

  return (
    <Link
      to={`/templates/${template.id}`}
      className={`group relative flex flex-col gap-2 border-2 bg-card p-4 transition-colors ${borderClass}`}
    >
      <PixelCorners size="sm" className={cornersClass} />

      {inUse && (
        // Top-right ribbon so the badge reads at a glance even when
        // the card is one of many in a grid. The title gets right-
        // padding to clear the ribbon's footprint.
        <span className="pointer-events-none absolute right-0 top-0 inline-flex items-center gap-1 border-l-2 border-b-2 border-orange-400/60 bg-orange-400/15 px-1.5 py-0.5 font-pixel text-[7px] sm:text-[8px] tracking-widest text-orange-300 [text-shadow:0_0_8px_rgba(251,146,60,0.4)]">
          <CheckCircleIcon className="h-3 w-3" />
          EN USO
        </span>
      )}

      <h3
        className={`font-pixel text-[10px] leading-relaxed ${titleClass} ${
          inUse ? 'pr-16 sm:pr-20' : ''
        }`}
      >
        {template.name}
      </h3>

      <p className="mt-auto font-pixel-mono text-base text-ink-muted leading-tight">
        {LEVEL_LABELS[template.level]} · {template.daysPerWeek} dias/sem
      </p>
    </Link>
  );
};
