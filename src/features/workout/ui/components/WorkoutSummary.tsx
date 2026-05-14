import { PixelCorners } from '../../../../shared/components/PixelCorners';
import type { UnlockedMilestonePreview } from '../../core/domain/models/WorkoutSummaryData';

type Props = {
  totalVolume: number;
  totalSets: number;
  exercisesCount: number;
  saved: boolean;
  saving: boolean;
  error: string | null;
  unlockedMilestones: UnlockedMilestonePreview[];
  onSave: () => void;
  onFinish: () => void;
};

const StatCell = (props: {
  label: string;
  value: string;
}): React.JSX.Element => (
  <div className="flex flex-col items-center gap-1 border-2 border-[#1e1e2e] bg-[#0d0d14] px-4 py-5">
    <span className="font-['Press_Start_2P'] text-[8px] tracking-widest text-[#a1a1aa]">
      {props.label}
    </span>
    <span className="font-['Press_Start_2P'] text-base text-green-400 [text-shadow:0_0_12px_rgba(34,197,94,0.5)]">
      {props.value}
    </span>
  </div>
);

export const WorkoutSummary = (props: Props): React.JSX.Element => {
  const {
    totalVolume,
    totalSets,
    exercisesCount,
    saved,
    saving,
    error,
    unlockedMilestones,
    onSave,
    onFinish,
  } = props;

  return (
    <section className="text-[#e4e4e7]">
      <div className="mx-auto max-w-3xl flex flex-col gap-6">
        <header className="relative border-2 border-green-500/40 bg-[#0d0d14] p-5 text-center">
          <PixelCorners size="md" className="border-green-500/60" />
          <p className="font-['Press_Start_2P'] text-[9px] tracking-widest text-[#a1a1aa]">
            ENTRENO COMPLETADO
          </p>
          <h1 className="font-['Press_Start_2P'] text-base sm:text-lg leading-relaxed text-green-400 mt-2 [text-shadow:0_0_16px_rgba(34,197,94,0.55)]">
            ¡BUEN TRABAJO!
          </h1>
        </header>

        <div className="grid grid-cols-3 gap-3">
          <StatCell label="VOLUMEN" value={`${totalVolume} KG`} />
          <StatCell label="SETS" value={String(totalSets)} />
          <StatCell label="EJERCICIOS" value={String(exercisesCount)} />
        </div>

        {saved && unlockedMilestones.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="font-['Press_Start_2P'] text-[10px] tracking-widest text-green-400">
              ★ LOGROS DESBLOQUEADOS
            </h2>
            <ul className="flex flex-col gap-2">
              {unlockedMilestones.map((milestone) => (
                <li
                  key={milestone.id}
                  className="border-2 border-green-500/50 bg-green-500/5 p-3"
                >
                  <p className="font-['Press_Start_2P'] text-[10px] text-green-400">
                    {milestone.name}
                  </p>
                  <p className="font-['Press_Start_2P'] text-base text-[#a1a1aa] mt-1">
                    {milestone.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {error && (
          <p
            role="alert"
            className="font-['Press_Start_2P'] text-base text-red-400 border-2 border-red-500/40 bg-red-500/10 px-4 py-3"
          >
            ✕ {error}
          </p>
        )}

        <div className="flex justify-end">
          {saved ? (
            <button
              type="button"
              onClick={onFinish}
              className="font-['Press_Start_2P'] text-[10px] tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-6 py-3 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(34,197,94,0.35)]"
            >
              ▶ VOLVER AL DASHBOARD
            </button>
          ) : (
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="font-['Press_Start_2P'] text-[10px] tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-6 py-3 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(34,197,94,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:mt-0"
            >
              {saving ? 'GUARDANDO...' : '▶ GUARDAR SESION'}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
