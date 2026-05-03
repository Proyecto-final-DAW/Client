import { useNavigate } from 'react-router-dom';

import { AsyncState } from '../../../shared/components/AsyncState';
import { RecommendedTemplatesSection } from './components/RecommendedTemplatesSection';
import { TemplateFilters } from './components/TemplateFilters';
import { TemplateGrid } from './components/TemplateGrid';
import { useTemplateCatalog } from './hooks/useTemplateCatalog';

export const TemplatesView = (): React.JSX.Element => {
  const navigate = useNavigate();
  const {
    loading,
    error,
    filters,
    setFilters,
    recommendedTemplates,
    recommendedTemplateIds,
    filteredTemplates,
  } = useTemplateCatalog();

  return (
    <AsyncState
      loading={loading}
      error={error}
      data={filteredTemplates}
      loadingLabel="CARGANDO RUTINAS"
    >
      {() => (
        <section className="text-[#e4e4e7]">
          <div className="mx-auto max-w-6xl">
            <header className="mb-8">
              <p className="font-['Press_Start_2P'] text-[9px] tracking-widest text-green-500">
                ▶ RUTINAS
              </p>
              <h1 className="mt-2 font-['Press_Start_2P'] text-base sm:text-lg tracking-widest text-green-400 [text-shadow:0_0_16px_rgba(34,197,94,0.55)]">
                ELIGE TU PLAN
              </h1>
              <p className="mt-2 font-['Press_Start_2P'] text-base sm:text-lg text-[#a1a1aa]">
                Rutinas semanales listas. Aplicalas y tendras las sesiones de
                cada dia creadas automaticamente.
              </p>
            </header>

            <RecommendedTemplatesSection templates={recommendedTemplates} />

            <div className="mb-4 flex items-baseline gap-3">
              <h2 className="font-['Press_Start_2P'] text-[11px] tracking-widest text-[#a1a1aa]">
                ▸ TODAS LAS RUTINAS
              </h2>
            </div>

            <div className="mb-6">
              <TemplateFilters value={filters} onChange={setFilters} />
            </div>

            <TemplateGrid
              templates={filteredTemplates}
              recommendedTemplateIds={recommendedTemplateIds}
              emptyTitle="Sin resultados"
              emptyDescription="Prueba a quitar algun filtro."
            />

            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="font-['Press_Start_2P'] text-[9px] tracking-widest border-2 border-[#1e1e2e] bg-[#0d0d14] text-[#a1a1aa] px-5 py-3 hover:border-green-500/40 hover:text-green-400 transition-colors"
              >
                ◀ VOLVER AL INICIO
              </button>
            </div>
          </div>
        </section>
      )}
    </AsyncState>
  );
};
