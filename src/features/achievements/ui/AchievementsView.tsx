import { MilestoneCard } from './components/MilestoneCard';
import { useMilestones } from './hooks/useMilestones';

export const AchievementsView = (): React.JSX.Element => {
  const { milestones, loading, error } = useMilestones();

  if (loading) {
    return <p className="text-zinc-400">Cargando logros...</p>;
  }

  if (error) {
    return (
      <p
        role="alert"
        className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400"
      >
        {error}
      </p>
    );
  }

  const unlockedCount = milestones.filter((m) => m.unlocked).length;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <h2 className="text-2xl font-bold text-zinc-100">Mis logros</h2>
        <p className="text-sm text-zinc-400">
          <span className="font-bold text-emerald-400">{unlockedCount}</span>
          <span className="text-zinc-600">/</span>
          <span>{milestones.length}</span> desbloqueados
        </p>
      </div>

      {milestones.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-zinc-400">Aún no hay logros disponibles.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {milestones.map((milestone) => (
            <MilestoneCard key={milestone.id} milestone={milestone} />
          ))}
        </div>
      )}
    </div>
  );
};
