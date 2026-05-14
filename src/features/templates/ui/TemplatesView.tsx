import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '../../../context/hooks/useAuth';
import { AsyncState } from '../../../shared/components/AsyncState';
import { useRoutines } from '../../routines/ui/hooks/useRoutines';
import { HeroRoutineCard } from './components/HeroRoutineCard';
import { TemplateCard } from './components/TemplateCard';
import { TemplateFilters } from './components/TemplateFilters';
import { TemplatePaginatedBrowser } from './components/TemplatePaginatedBrowser';
import { TemplatesIntroModal } from './components/TemplatesIntroModal';
import { useTemplateCatalog } from './hooks/useTemplateCatalog';

export const TemplatesView = (): React.JSX.Element => {
  const { user } = useAuth();
  const {
    loading,
    error,
    filters,
    setFilters,
    recommendedTemplates,
    recommendedTemplateIds,
    filteredTemplates,
  } = useTemplateCatalog();

  // One-time routines explainer — per-user localStorage flag.
  const templatesIntroStorageKey =
    user?.id != null ? `templates_intro_seen_${user.id}` : null;

  const [templatesIntroDismissed, setTemplatesIntroDismissed] = useState(
    () =>
      templatesIntroStorageKey !== null &&
      localStorage.getItem(templatesIntroStorageKey) === '1'
  );

  useEffect(() => {
    if (templatesIntroStorageKey === null) {
      setTemplatesIntroDismissed(true);
      return;
    }
    setTemplatesIntroDismissed(
      localStorage.getItem(templatesIntroStorageKey) === '1'
    );
  }, [templatesIntroStorageKey]);

  const showTemplatesIntro =
    templatesIntroStorageKey !== null && !templatesIntroDismissed;

  const handleDismissTemplatesIntro = (): void => {
    if (templatesIntroStorageKey !== null) {
      localStorage.setItem(templatesIntroStorageKey, '1');
    }
    setTemplatesIntroDismissed(true);
  };

  // Detect which templates the user already has applied. The apply
  // hook stamps each created routine with `description = template.name`
  // (see useApplyTemplate), so a routine whose description matches a
  // template's name marks that template as in-use. Falls back to an
  // empty Set when routines haven't loaded yet — the worst case is a
  // moment of "MEJOR PARA TI" before flipping to "EN USO".
  const { routines } = useRoutines();
  const appliedTemplateNames = useMemo(() => {
    const names = (routines ?? [])
      .map((r) => r.description)
      .filter((d): d is string => Boolean(d && d.trim().length > 0));
    return new Set(names);
  }, [routines]);

  const [browseOpen, setBrowseOpen] = useState(false);

  return (
    <>
      <TemplatesIntroModal
        open={showTemplatesIntro}
        onClose={handleDismissTemplatesIntro}
      />
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
                    Aplica un plan y se crearan tus sesiones automaticamente.
                  </p>
                </header>

                {topPick && (
                  <div className="mb-8">
                    <HeroRoutineCard
                      template={topPick}
                      inUse={appliedTemplateNames.has(topPick.name)}
                    />
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
                          inUse={appliedTemplateNames.has(template.name)}
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
                      <TemplatePaginatedBrowser
                        templates={filteredTemplates}
                        recommendedTemplateIds={recommendedTemplateIds}
                        appliedTemplateNames={appliedTemplateNames}
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
    </>
  );
};
