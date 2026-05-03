import { useAuth } from '../../../context/hooks/useAuth';
import { AsyncState } from '../../../shared/components/AsyncState';
import { DietSummaryCard } from '../../diet/ui/components/DietSummaryCard';
import { useDiet } from '../../diet/ui/hooks/useDiet';
import { useStreakStatus } from '../../streak/ui/hooks/useStreakStatus';
import { DashboardCards } from './components/DashboardCards';
import { DashboardHeader } from './components/DashboardHeader';
import { StartWorkoutButton } from './components/StartWorkoutButton';
import { StreakWarningCard } from './components/StreakWarningCard';
import { WeeklySummaryCard } from './components/weekly-summary/WeeklySummaryCard';
import { useCards } from './hooks/useCards';
import { useWeeklySummary } from './hooks/useWeeklySummary';

export const Dashboard = (): React.JSX.Element => {
  const { user } = useAuth();
  const { cards, loading, error, refetch: refetchCards } = useCards();
  const {
    summary,
    loading: summaryLoading,
    error: summaryError,
    refetch: refetchSummary,
  } = useWeeklySummary();
  const {
    diet,
    loading: dietLoading,
    refreshing: dietRefreshing,
    error: dietError,
    refetch: dietRefetch,
  } = useDiet();
  const { status: streakStatus } = useStreakStatus();

  const combinedData = cards && summary ? { cards, summary } : null;
  const handleRetry = (): void => {
    void refetchCards();
    void refetchSummary();
  };

  return (
    <AsyncState
      loading={loading || summaryLoading}
      error={error ?? summaryError}
      data={combinedData}
      onRetry={handleRetry}
      loadingLabel="CARGANDO DASHBOARD"
    >
      {({ cards, summary }) => (
        <div>
          <DashboardHeader userName={user?.name} />
          {streakStatus?.isAtRisk && (
            <div className="my-4">
              <StreakWarningCard status={streakStatus} />
            </div>
          )}
          <div className="my-4">
            <StartWorkoutButton />
          </div>
          <DashboardCards {...cards} />
          <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <WeeklySummaryCard summary={summary} />
            <DietSummaryCard
              diet={diet}
              loading={dietLoading}
              refreshing={dietRefreshing}
              error={dietError}
              onRefresh={dietRefetch}
            />
          </section>
        </div>
      )}
    </AsyncState>
  );
};
