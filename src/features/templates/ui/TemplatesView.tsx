import { useNavigate } from 'react-router-dom';

import { RecommendedTemplatesSection } from './components/RecommendedTemplatesSection';
import { TemplateFilters } from './components/TemplateFilters';
import { TemplateGrid } from './components/TemplateGrid';
import { useTemplateCatalog } from './hooks/useTemplateCatalog';

export const TemplatesView = (): React.JSX.Element => {
  const navigate = useNavigate();
  const {
    filters,
    setFilters,
    recommendedTemplates,
    recommendedTemplateIds,
    filteredTemplates,
  } = useTemplateCatalog();

  return (
    <section className="text-[#e4e4e7]">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-2 mb-6">
          <h1 className="font-['Press_Start_2P'] text-base sm:text-lg tracking-widest text-green-400 [text-shadow:0_0_16px_rgba(34,197,94,0.55)]">
            ▶ ELIGE TU PLAN
          </h1>
          <p className="font-['VT323'] text-lg text-[#a1a1aa]">
            Plantillas listas para empezar. Filtra por objetivo, equipamiento o
            nivel.
          </p>
        </header>

        <RecommendedTemplatesSection templates={recommendedTemplates} />

        <div className="flex items-baseline gap-3 mb-3">
          <h2 className="font-['Press_Start_2P'] text-[11px] tracking-widest text-[#a1a1aa]">
            ▸ TODAS LAS PLANTILLAS
          </h2>
        </div>

        <div className="mb-6">
          <TemplateFilters value={filters} onChange={setFilters} />
        </div>

        <TemplateGrid
          templates={filteredTemplates}
          recommendedTemplateIds={recommendedTemplateIds}
          emptyMessage="SIN RESULTADOS"
          emptyHint="Prueba a quitar algún filtro."
        />

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="font-['Press_Start_2P'] text-[9px] tracking-widest border-2 border-[#1e1e2e] bg-[#0d0d14] text-[#a1a1aa] px-5 py-3 hover:border-green-500/40 hover:text-green-400 transition-colors"
          >
            OMITIR Y CREAR DESPUÉS
          </button>
        </div>
      </div>
    </section>
  );
};
