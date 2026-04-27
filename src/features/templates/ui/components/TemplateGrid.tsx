import type { RoutineTemplate } from '../../core/domain/models/RoutineTemplate';
import { TemplateCard } from './TemplateCard';

type Props = {
  templates: RoutineTemplate[];
  recommendedTemplateIds?: Set<string>;
  emptyMessage?: string;
  emptyHint?: string;
  cardKeyPrefix?: string;
  forceRecommended?: boolean;
};

export const TemplateGrid = (props: Props): React.JSX.Element => {
  const {
    templates,
    recommendedTemplateIds,
    emptyMessage,
    emptyHint,
    cardKeyPrefix = '',
    forceRecommended = false,
  } = props;

  if (templates.length === 0) {
    return (
      <div className="border-2 border-[#1e1e2e] bg-[#0d0d14] py-12 text-center">
        <p className="font-['Press_Start_2P'] text-[10px] tracking-widest text-[#a1a1aa]">
          {emptyMessage ?? 'SIN RESULTADOS'}
        </p>
        {emptyHint && (
          <p className="font-['VT323'] text-base text-[#71717a] mt-2">
            {emptyHint}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <TemplateCard
          key={`${cardKeyPrefix}${template.id}`}
          template={template}
          recommended={
            forceRecommended || recommendedTemplateIds?.has(template.id)
          }
        />
      ))}
    </div>
  );
};
