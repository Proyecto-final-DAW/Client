import { EmptyState } from '../../../../shared/components/EmptyState';
import type { RoutineTemplate } from '../../core/domain/models/RoutineTemplate';
import { TemplateCard } from './TemplateCard';

type Props = {
  templates: RoutineTemplate[];
  recommendedTemplateIds?: Set<string>;
  emptyTitle?: string;
  emptyDescription?: string;
  cardKeyPrefix?: string;
  forceRecommended?: boolean;
};

export const TemplateGrid = (props: Props): React.JSX.Element => {
  const {
    templates,
    recommendedTemplateIds,
    emptyTitle,
    emptyDescription,
    cardKeyPrefix = '',
    forceRecommended = false,
  } = props;

  if (templates.length === 0) {
    return (
      <EmptyState
        title={emptyTitle ?? 'Sin resultados'}
        description={emptyDescription}
      />
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
