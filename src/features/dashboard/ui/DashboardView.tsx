import { DashboardCards } from './components/DashboardCards';
import { WeeklySummaryCard } from './components/weekly-summary/WeeklySummaryCard';
import { useCards } from './hooks/useCards';
import { useWeeklySummary } from './hooks/useWeeklySummary';

export const Dashboard = (): React.JSX.Element | null => {
  const { cards, loading, error } = useCards();
  const {
    summary,
    loading: summaryLoading,
    error: summaryError,
  } = useWeeklySummary();

  if (loading || summaryLoading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;
  if (summaryError) return <p>{summaryError}</p>;
  if (!cards || !summary) return null;

  return (
    <div>
      <h1>Dashboard</h1>
      <DashboardCards {...cards} />
      <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <WeeklySummaryCard summary={summary} />
      </section>
    </div>
  );
};
