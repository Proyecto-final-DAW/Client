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
};

export const TemplateDetailHeader = (props: Props): React.JSX.Element => {
  const { template } = props;
  const exerciseCount = countExercises(template);

  return (
    <header className="relative border-2 border-green-500/40 bg-[#0d0d14] p-5 mb-6">
      <PixelCorners size="md" className="border-green-500/60" />

      <h1 className="font-['Press_Start_2P'] text-sm sm:text-base leading-relaxed text-green-400 [text-shadow:0_0_16px_rgba(34,197,94,0.55)]">
        {template.name}
      </h1>

      <p className="font-['Press_Start_2P'] text-lg text-[#a1a1aa] mt-3">
        {template.description}
      </p>

      <div className="flex flex-wrap gap-2 mt-4">
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

      <p className="font-['Press_Start_2P'] text-sm text-[#71717a] mt-3">
        {totalExercises(exerciseCount, template.daysPerWeek)} ·{' '}
        {template.estimatedDurationMin} min/sesion
      </p>
    </header>
  );
};
