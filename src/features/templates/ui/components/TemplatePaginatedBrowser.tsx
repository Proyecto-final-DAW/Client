import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { EmptyState } from '@shared/components/EmptyState';
import { useEffect, useState } from 'react';

import type { RoutineTemplate } from '../../core/domain/models/RoutineTemplate';
import { TemplateCard } from './TemplateCard';

type Props = {
  templates: RoutineTemplate[];
  recommendedTemplateIds?: Set<string>;
  /**
   * Set of template `name` strings the user already applied. The
   * apply hook stamps `description = template.name` on each created
   * routine; the parent collects those into a Set and passes it
   * here so each card can flip to its "EN USO" state. Without this
   * the browse grid stayed green even for the user's current plan.
   */
  appliedTemplateNames?: ReadonlySet<string>;
  emptyTitle?: string;
  emptyDescription?: string;
};

const PAGE_SIZE = 4;

/**
 * Paginated grid of templates for the "BUSCAR MAS RUTINAS" panel. Shows
 * `PAGE_SIZE` cards per page so the user doesn't get a wall of options;
 * the previous flat grid rendered every match at once and overwhelmed
 * the page when the catalog grew.
 *
 * Page resets to 0 whenever the underlying list changes (e.g. filter
 * applied) — staying on page 5 of a list that just became 1 item is
 * confusing.
 */
export const TemplatePaginatedBrowser = (props: Props): React.JSX.Element => {
  const {
    templates,
    recommendedTemplateIds,
    appliedTemplateNames,
    emptyTitle,
    emptyDescription,
  } = props;
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [templates]);

  if (templates.length === 0) {
    return (
      <EmptyState
        title={emptyTitle ?? 'Sin resultados'}
        description={emptyDescription}
      />
    );
  }

  const totalPages = Math.max(1, Math.ceil(templates.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const start = safePage * PAGE_SIZE;
  const visible = templates.slice(start, start + PAGE_SIZE);

  const goPrev = (): void => setPage((p) => Math.max(0, p - 1));
  const goNext = (): void => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {visible.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            recommended={recommendedTemplateIds?.has(template.id)}
            inUse={appliedTemplateNames?.has(template.name)}
          />
        ))}
      </div>

      {/* Pager — flecha izq · contador · flecha der. Solo se renderiza
          si hay mas de una pagina, asi una sola card no cuelga "1/1"
          debajo. */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={goPrev}
            disabled={safePage === 0}
            aria-label="Pagina anterior"
            className="inline-flex h-10 w-10 items-center justify-center border-2 border-green-500/40 bg-page text-green-400 transition-all hover:border-green-400 hover:bg-green-500/10 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-green-500/40 disabled:hover:bg-page"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>

          <span className="font-pixel text-[10px] tracking-widest text-green-400 min-w-[5rem] text-center">
            {safePage + 1} / {totalPages}
          </span>

          <button
            type="button"
            onClick={goNext}
            disabled={safePage === totalPages - 1}
            aria-label="Pagina siguiente"
            className="inline-flex h-10 w-10 items-center justify-center border-2 border-green-500/40 bg-page text-green-400 transition-all hover:border-green-400 hover:bg-green-500/10 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-green-500/40 disabled:hover:bg-page"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};
