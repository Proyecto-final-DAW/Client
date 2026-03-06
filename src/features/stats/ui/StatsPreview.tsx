import { StatsPanel } from './components/StatsPanel';
import { useStats } from './hooks/useStats';

export const StatsPreview = () => {
  const { stats, loading, error } = useStats();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <StatsPanel
          stats={stats?.pilpilar ?? null}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};
