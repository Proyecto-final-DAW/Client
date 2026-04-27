import type { RoutineTemplate } from '../../core/domain/models/RoutineTemplate';
import { TemplateGrid } from './TemplateGrid';

type Props = {
  templates: RoutineTemplate[];
};

export const RecommendedTemplatesSection = (
  props: Props
): React.JSX.Element | null => {
  if (props.templates.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-baseline gap-3 mb-3">
        <h2 className="font-['Press_Start_2P'] text-[11px] tracking-widest text-green-400">
          ★ RECOMENDADAS PARA TI
        </h2>
        <p className="font-['VT323'] text-base text-[#71717a]">
          Según tu perfil de onboarding
        </p>
      </div>
      <TemplateGrid
        templates={props.templates}
        cardKeyPrefix="rec-"
        forceRecommended
      />
    </div>
  );
};
