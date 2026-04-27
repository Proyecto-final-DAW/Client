import { useNavigate } from 'react-router-dom';

import { TemplateActions } from './components/TemplateActions';
import { TemplateDetailHeader } from './components/TemplateDetailHeader';
import { TemplateRoutineList } from './components/TemplateRoutineList';
import { useApplyTemplate } from './hooks/useApplyTemplate';
import { useTemplateDetail } from './hooks/useTemplateDetail';

export const TemplateDetailView = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { template } = useTemplateDetail();
  const { apply, applying, error } = useApplyTemplate();

  if (!template) {
    return (
      <section className="text-[#e4e4e7]">
        <div className="mx-auto max-w-4xl text-center py-16">
          <p className="font-['Press_Start_2P'] text-[10px] tracking-widest text-red-400">
            PLANTILLA NO ENCONTRADA
          </p>
          <button
            type="button"
            onClick={() => navigate('/templates')}
            className="mt-6 font-['Press_Start_2P'] text-[9px] tracking-widest border-2 border-[#1e1e2e] bg-[#0d0d14] text-[#a1a1aa] px-4 py-3 hover:border-green-500/40 hover:text-green-400 transition-colors"
          >
            VOLVER AL CATÁLOGO
          </button>
        </div>
      </section>
    );
  }

  const handleApply = async () => {
    const created = await apply(template);
    if (created) {
      navigate('/routines');
    }
  };

  return (
    <section className="text-[#e4e4e7]">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() => navigate('/templates')}
          className="font-['Press_Start_2P'] text-[8px] tracking-widest text-[#71717a] hover:text-green-400 transition-colors mb-4"
        >
          ◀ VOLVER
        </button>

        <TemplateDetailHeader template={template} />

        <TemplateRoutineList routines={template.routines} />

        {error && (
          <p
            role="alert"
            className="mt-6 font-['VT323'] text-base text-red-400 border-2 border-red-500/40 bg-red-500/10 px-4 py-3"
          >
            ✕ {error}
          </p>
        )}

        <TemplateActions
          applying={applying}
          onSkip={() => navigate('/dashboard')}
          onApply={handleApply}
        />
      </div>
    </section>
  );
};
