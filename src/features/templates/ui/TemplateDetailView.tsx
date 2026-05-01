import { useNavigate } from 'react-router-dom';

import { AsyncState } from '../../../shared/components/AsyncState';
import { TemplateActions } from './components/TemplateActions';
import { TemplateDetailHeader } from './components/TemplateDetailHeader';
import { TemplateRoutineList } from './components/TemplateRoutineList';
import { useApplyTemplate } from './hooks/useApplyTemplate';
import { useTemplateDetail } from './hooks/useTemplateDetail';

export const TemplateDetailView = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { template, loading, error } = useTemplateDetail();
  const { apply, applying, error: applyError } = useApplyTemplate();

  const handleApply = async () => {
    if (!template) return;
    const created = await apply(template);
    if (created) {
      navigate('/routines');
    }
  };

  return (
    <AsyncState
      loading={loading}
      error={error}
      data={template}
      loadingLabel="CARGANDO PLANTILLA"
      emptyTitle="Plantilla no encontrada"
      emptyDescription="Es posible que el enlace haya cambiado o que la plantilla ya no exista."
      emptyCta={{ label: 'Volver al catálogo', to: '/templates' }}
    >
      {(template) => (
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

            {applyError && (
              <p
                role="alert"
                className="mt-6 font-['VT323'] text-base text-red-400 border-2 border-red-500/40 bg-red-500/10 px-4 py-3"
              >
                ✕ {applyError}
              </p>
            )}

            <TemplateActions
              applying={applying}
              onSkip={() => navigate('/dashboard')}
              onApply={handleApply}
            />
          </div>
        </section>
      )}
    </AsyncState>
  );
};
