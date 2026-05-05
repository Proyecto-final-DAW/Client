import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

import { AsyncState } from '../../../shared/components/AsyncState';
import { HeroRoutineCard } from './components/HeroRoutineCard';
import { TemplateCard } from './components/TemplateCard';
import { TemplateFilters } from './components/TemplateFilters';
import { TemplateGrid } from './components/TemplateGrid';
import { useTemplateCatalog } from './hooks/useTemplateCatalog';

export const TemplatesView = (): React.JSX.Element => {
  const {
    loading,
    error,
    filters,
    setFilters,
    recommendedTemplates,
    recommendedTemplateIds,
    filteredTemplates,
  } = useTemplateCatalog();

  const [browseOpen, setBrowseOpen] = useState(false);

  return (
    <AsyncState
      loading={loading}
      error={error}
      data={filteredTemplates}
      loadingLabel="CARGANDO RUTINAS"
    >
      {() => {
        const [topPick, ...alsoForYou] = recommendedTemplates;

        return (
          <section className="text-ink">
            <div className="mx-auto max-w-4xl">
              <header className="mb-6">
                <p className="font-pixel text-[9px] tracking-widest text-green-500">
                  ▶ RUTINAS
                </p>
                <h1 className="mt-2 font-pixel text-base sm:text-lg tracking-widest text-green-400 [text-shadow:0_0_16px_rgba(34,197,94,0.55)]">
                  TU PLAN
                </h1>
                <p className="mt-2 font-pixel-mono text-lg text-ink-muted">
                  Aplica un plan y se crearán tus sesiones automaticamente.
                </p>
              </header>

              {topPick && (
                <div className="mb-8">
                  <HeroRoutineCard template={topPick} />
                </div>
              )}

              {alsoForYou.length > 0 && (
                <section className="mb-10">
                  <h2 className="mb-3 font-pixel text-[10px] tracking-widest text-green-500">
                    ▸ TAMBIEN PARA TI
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {alsoForYou.map((template) => (
                      <TemplateCard
                        key={`rec-${template.id}`}
                        template={template}
                        recommended
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Browse all — collapsed by default to keep the page calm. */}
              <section
                className={`relative border-2 transition-colors ${
                  browseOpen
                    ? 'border-green-500/30 bg-[#0a0a10]/80'
                    : 'border-border bg-card/60'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setBrowseOpen((open) => !open)}
                  aria-expanded={browseOpen}
                  className="w-full flex items-center justify-between px-4 py-3 font-pixel text-[10px] tracking-widest text-ink-muted hover:text-green-400 transition-colors"
                >
                  <span>BUSCAR MAS RUTINAS</span>
                  {browseOpen ? (
                    <ChevronUpIcon className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  )}
                </button>

                {browseOpen && (
                  <div className="border-t-2 border-border/80 px-4 pb-5 pt-4 flex flex-col gap-5">
                    <TemplateFilters value={filters} onChange={setFilters} />
                    <TemplateGrid
                      templates={filteredTemplates}
                      recommendedTemplateIds={recommendedTemplateIds}
                      emptyTitle="Sin resultados"
                      emptyDescription="Prueba a quitar algun filtro."
                    />
                  </div>
                )}
              </section>
            </div>
          </section>
        );
      }}
    </AsyncState>
  );
};
