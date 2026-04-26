import { useAuth } from '../../../context/hooks/useAuth';
import { LoadingPixel } from '../../../shared/components/LoadingPixel';
import { DietSummaryCard } from '../../diet/ui/components/DietSummaryCard';
import { useDiet } from '../../diet/ui/hooks/useDiet';
import { DashboardCards } from './components/DashboardCards';
import { DashboardHeader } from './components/DashboardHeader';
import { WeeklySummaryCard } from './components/weekly-summary/WeeklySummaryCard';
import { useCards } from './hooks/useCards';
import { useWeeklySummary } from './hooks/useWeeklySummary';

export const Dashboard = (): React.JSX.Element | null => {
  const { user } = useAuth();
  const { cards, loading, error } = useCards();
  const {
    summary,
    loading: summaryLoading,
    error: summaryError,
  } = useWeeklySummary();
  const {
    diet,
    loading: dietLoading,
    refreshing: dietRefreshing,
    error: dietError,
    refetch: dietRefetch,
  } = useDiet();

  if (loading || summaryLoading) {
    return <LoadingPixel />;
  }

  if (error || summaryError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p
          role="alert"
          className="font-['VT323'] text-xl text-red-400 border-2 border-red-500/40 bg-red-500/10 px-4 py-3"
        >
          ✕ {error ?? summaryError}
        </p>
      </div>
    );
  }

  if (!cards || !summary) return null;

  return (
    <div>
      <DashboardHeader userName={user?.name} />
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
  );
};
