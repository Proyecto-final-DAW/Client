import { Link } from 'react-router-dom';

import { PixelCorners } from '../../../../shared/components/PixelCorners';
import type { RoutineTemplate } from '../../core/domain/models/RoutineTemplate';
import { countExercises } from '../../core/domain/services/templateMetrics';
import {
  EQUIPMENT_LABELS,
  GOAL_LABELS,
  LEVEL_LABELS,
  totalExercises,
} from '../labels';

type Props = {
  template: RoutineTemplate;
  recommended?: boolean;
};

export const TemplateCard = (props: Props): React.JSX.Element => {
  const { template, recommended = false } = props;
  const exerciseCount = countExercises(template);

  const borderClass = recommended
    ? 'border-green-500/60 bg-green-500/[0.04] hover:border-green-400 shadow-[0_0_16px_rgba(34,197,94,0.18)]'
    : 'border-[#1e1e2e] bg-[#0d0d14] hover:border-green-500/60';

  return (
    <Link
      to={`/templates/${template.id}`}
      className={`group relative flex flex-col gap-3 border-2 p-4 transition-colors ${borderClass}`}
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

      <p className="font-['VT323'] text-base text-[#a1a1aa] line-clamp-3">
        {template.description}
      </p>

      <div className="flex flex-wrap gap-1.5">
        <span className="font-['Press_Start_2P'] text-[8px] tracking-widest border border-green-500/40 bg-green-500/10 text-green-400 px-2 py-1">
          {GOAL_LABELS[template.goal]}
        </span>
        <span className="font-['Press_Start_2P'] text-[8px] tracking-widest border border-[#3f3f46] bg-[#18181b] text-[#a1a1aa] px-2 py-1">
          {EQUIPMENT_LABELS[template.equipment]}
        </span>
        <span className="font-['Press_Start_2P'] text-[8px] tracking-widest border border-[#3f3f46] bg-[#18181b] text-[#a1a1aa] px-2 py-1">
          {LEVEL_LABELS[template.level]}
        </span>
      </div>

      <p className="font-['VT323'] text-sm text-[#71717a]">
        {totalExercises(exerciseCount, template.daysPerWeek)} ·{' '}
        {template.estimatedDurationMin} min
      </p>
    </Link>
  );
};
