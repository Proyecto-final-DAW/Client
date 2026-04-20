import { DashboardCards } from './components/DashboardCards';
import { useCards } from './hooks/useCards';

export const Dashboard = (): React.JSX.Element | null => {
  const { cards, loading, error } = useCards();

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;
  if (!cards) return null;

  return (
    <div>
      <h1>Dashboard</h1>
      <DashboardCards {...cards} />
    </div>
  );
};
