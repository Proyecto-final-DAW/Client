import { Link } from 'react-router-dom';

import { PixelCorners } from '../../../../shared/components/PixelCorners';
import type { RoutineTemplate } from '../../core/domain/models/RoutineTemplate';
import { LEVEL_LABELS } from '../labels';

type Props = {
  template: RoutineTemplate;
  recommended?: boolean;
};

/**
 * Mini card used in the templates browse grid and the "También para ti" rail.
 * Stripped to the essentials — name, level, days/week — to keep the page
 * scannable for new users. Full description / per-day breakdown lives on the
 * detail page.
 */
export const TemplateCard = (props: Props): React.JSX.Element => {
  const { template, recommended = false } = props;

  const borderClass = recommended
    ? 'border-green-500/60 hover:border-green-400 shadow-[0_0_12px_rgba(34,197,94,0.18)]'
    : 'border-border hover:border-green-500/60';

  return (
    <Link
      to={`/templates/${template.id}`}
      className={`group relative flex flex-col gap-2 border-2 bg-card p-4 transition-colors ${borderClass}`}
    >
      <PixelCorners
        size="sm"
        className={recommended ? 'border-green-400' : 'border-green-500/40'}
      />

      <h3 className="font-pixel text-[10px] leading-relaxed text-green-400 [text-shadow:0_0_10px_rgba(34,197,94,0.4)]">
        {template.name}
      </h3>

      <p className="mt-auto font-pixel-mono text-base text-ink-muted leading-tight">
        {LEVEL_LABELS[template.level]} · {template.daysPerWeek} días/sem
      </p>
    </Link>
  );
};
