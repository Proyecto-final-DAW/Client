import { Link } from 'react-router-dom';

import { PixelCorners } from '../../../../shared/components/PixelCorners';
import type { RoutineTemplate } from '../../core/domain/models/RoutineTemplate';
import { GOAL_LABELS, LEVEL_LABELS } from '../labels';

type Props = {
  template: RoutineTemplate;
  recommended?: boolean;
};

/**
 * Compact, opaque card. The previous version had a tinted background that
 * looked transparent on top of the pixel-art bg, and showed too many badges.
 * Now: solid bg, name + 2 essential badges (goal + days), description.
 */
export const TemplateCard = (props: Props): React.JSX.Element => {
  const { template, recommended = false } = props;

  const borderClass = recommended
    ? 'border-green-500/60 hover:border-green-400 shadow-[0_0_18px_rgba(34,197,94,0.22)]'
    : 'border-[#1e1e2e] hover:border-green-500/60';

  return (
    <Link
      to={`/templates/${template.id}`}
      className={`group relative flex flex-col gap-3 border-2 bg-[#0d0d14] p-5 transition-colors ${borderClass}`}
    >
      <PixelCorners
        size="sm"
        className={recommended ? 'border-green-400' : 'border-green-500/40'}
      />

      {recommended && (
        <span className="absolute -top-2.5 left-3 font-['Press_Start_2P'] text-[8px] tracking-widest bg-green-500 text-[#0a0a0f] px-2 py-1 [text-shadow:none]">
          ★ RECOMENDADA
        </span>
      )}

      <h3 className="font-['Press_Start_2P'] text-[11px] leading-relaxed text-green-400 [text-shadow:0_0_12px_rgba(34,197,94,0.5)]">
        {template.name}
      </h3>

      <p className="font-['Press_Start_2P'] text-base leading-snug text-[#a1a1aa] line-clamp-3 min-h-[3.6rem]">
        {template.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mt-auto">
        <span className="font-['Press_Start_2P'] text-[8px] tracking-widest border border-green-500/40 bg-green-500/10 text-green-400 px-2 py-1">
          {GOAL_LABELS[template.goal]}
        </span>
        <span className="font-['Press_Start_2P'] text-[8px] tracking-widest border border-[#3f3f46] bg-[#18181b] text-[#a1a1aa] px-2 py-1">
          {LEVEL_LABELS[template.level]}
        </span>
        <span className="font-['Press_Start_2P'] text-[8px] tracking-widest border border-[#3f3f46] bg-[#18181b] text-[#a1a1aa] px-2 py-1">
          {template.daysPerWeek} DIAS/SEM
        </span>
      </div>
    </Link>
  );
};
