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
      empty={(m) => m.length === 0}
      loadingLabel="CARGANDO LOGROS"
      emptyTitle="Sin logros"
      emptyDescription="Aún no hay logros disponibles. Vuelve más tarde."
    >
      {(milestones) => {
        const unlockedCount = milestones.filter((m) => m.unlocked).length;
        return (
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex items-baseline justify-between gap-4">
              <h2 className="text-2xl font-bold text-zinc-100">Mis logros</h2>
              <p className="text-sm text-zinc-400">
                <span className="font-bold text-emerald-400">
                  {unlockedCount}
                </span>
                <span className="text-zinc-600">/</span>
                <span>{milestones.length}</span> desbloqueados
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {milestones.map((milestone) => (
                <MilestoneCard key={milestone.id} milestone={milestone} />
              ))}
            </div>
          </div>
        );
      }}
    </AsyncState>
  );
};
