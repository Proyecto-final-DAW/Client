import { AsyncState } from '../../../shared/components/AsyncState';
import { MilestoneCard } from './components/MilestoneCard';
import { useMilestones } from './hooks/useMilestones';

export const AchievementsView = (): React.JSX.Element => {
  const { milestones, loading, error, refetch } = useMilestones();

  return (
    <AsyncState
      loading={loading}
      error={error}
      data={milestones}
      onRetry={refetch}
      empty={(m) => m.every((milestone) => !milestone.unlocked)}
      loadingLabel="CARGANDO LOGROS"
      emptyIcon="🏆"
      emptyTitle="Sin logros"
      emptyDescription="Completa tu primer entreno para desbloquear logros."
      emptyCta={{ label: 'Ir a entrenar', to: '/routines' }}
    >
      {(milestones) => {
        const unlockedCount = milestones.filter((m) => m.unlocked).length;
        // Unlocked first (most recent unlock at the very top), locked last.
        // Mutating milestones is safe — useMilestones returns a fresh array.
        const sorted = [...milestones].sort((a, b) => {
          if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
          if (a.unlocked && b.unlocked) {
            const at = a.unlockedAt ? Date.parse(a.unlockedAt) : 0;
            const bt = b.unlockedAt ? Date.parse(b.unlockedAt) : 0;
            return bt - at;
          }
          return 0;
        });
        return (
          <div className="mx-auto max-w-4xl text-[#e4e4e7]">
            <header className="mb-6">
              <p className="font-['Press_Start_2P'] text-[9px] tracking-widest text-green-500">
                ▶ LOGROS
              </p>
              <div className="mt-2 flex flex-wrap items-baseline justify-between gap-3">
                <h1 className="font-['Press_Start_2P'] text-base sm:text-lg tracking-widest text-green-400 [text-shadow:0_0_16px_rgba(34,197,94,0.55)]">
                  HALL OF FAME
                </h1>
                <p className="font-['Press_Start_2P'] text-[10px] tracking-widest text-[#a1a1aa]">
                  <span className="text-green-400">{unlockedCount}</span>
                  <span className="mx-1 text-[#52525b]">/</span>
                  <span>{milestones.length}</span>
                  <span className="ml-2 text-[#71717a]">DESBLOQUEADOS</span>
                </p>
              </div>
            </header>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sorted.map((milestone) => (
                <MilestoneCard key={milestone.id} milestone={milestone} />
              ))}
            </div>
          </div>
        );
      }}
    </AsyncState>
  );
};
