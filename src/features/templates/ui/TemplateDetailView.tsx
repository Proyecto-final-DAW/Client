import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AsyncState } from '../../../shared/components/AsyncState';
import { useRoutines } from '../../routines/ui/hooks/useRoutines';
import { ApplyTemplateChoiceDialog } from './components/ApplyTemplateChoiceDialog';
import { TemplateActions } from './components/TemplateActions';
import { TemplateDetailHeader } from './components/TemplateDetailHeader';
import { TemplateRoutineList } from './components/TemplateRoutineList';
import { useApplyTemplate } from './hooks/useApplyTemplate';
import { useTemplateDetail } from './hooks/useTemplateDetail';

export const TemplateDetailView = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { template, loading, error } = useTemplateDetail();
  const { apply, applying, error: applyError } = useApplyTemplate();
  // Pull the current routines so we can detect the "stacking" case
  // (user already has routines + applies another template). Without
  // this gate, every template tap added more days on top of whatever
  // was already saved — the panteon-de-rutinas the user reported.
  const { routines, deleteRoutine } = useRoutines();

  const [choiceOpen, setChoiceOpen] = useState(false);
  // Locks the apply button while the replace-then-apply pipeline is
  // mid-flight, since the loop straddles two hooks (deleteRoutine
  // and apply) and `applying` only covers the second half.
  const [replacing, setReplacing] = useState(false);

  const runApply = async (replaceFirst: boolean): Promise<void> => {
    if (!template) return;
    setChoiceOpen(false);
    if (replaceFirst) {
      setReplacing(true);
      try {
        // Sequential delete — `useRoutines.deleteRoutine` handles its
        // own error state. Best-effort: if a delete fails we still
        // try to apply the template so the user isn't stuck halfway.
        for (const r of routines) {
          await deleteRoutine(r.id);
        }
      } finally {
        setReplacing(false);
      }
    }
    const created = await apply(template);
    if (created) {
      navigate('/routines');
    }
  };

  const handleApplyClick = (): void => {
    if (!template) return;
    if (routines.length > 0) {
      setChoiceOpen(true);
      return;
    }
    void runApply(false);
  };

  return (
    <AsyncState
      loading={loading}
      error={error}
      data={template}
      loadingLabel="CARGANDO PLANTILLA"
      emptyTitle="Plantilla no encontrada"
      emptyDescription="Es posible que el enlace haya cambiado o que la plantilla ya no exista."
      emptyCta={{ label: 'Volver al catalogo', to: '/templates' }}
    >
      {(template) => (
        <section className="text-ink">
          <div className="mx-auto max-w-4xl">
            <button
              type="button"
              onClick={() => navigate('/templates')}
              className="font-pixel text-[8px] tracking-widest text-ink-faint hover:text-green-400 transition-colors mb-4"
            >
              ◀ VOLVER
            </button>

            <TemplateDetailHeader template={template} />

            <TemplateRoutineList routines={template.routines} />

            {applyError && (
              <p
                role="alert"
                className="mt-6 font-pixel text-base text-red-400 border-2 border-red-500/40 bg-red-500/10 px-4 py-3"
              >
                ✕ {applyError}
              </p>
            )}

            <TemplateActions
              applying={applying || replacing}
              onSkip={() => navigate('/dashboard')}
              onApply={handleApplyClick}
            />
          </div>

          <ApplyTemplateChoiceDialog
            open={choiceOpen}
            existingCount={routines.length}
            incomingCount={template.routines.length}
            onReplace={() => void runApply(true)}
            onAdd={() => void runApply(false)}
            onCancel={() => setChoiceOpen(false)}
          />
        </section>
      )}
    </AsyncState>
  );
};
