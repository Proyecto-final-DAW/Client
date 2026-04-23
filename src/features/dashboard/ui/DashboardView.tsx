import { useAuth } from '../../../context/hooks/useAuth';
import { DashboardCards } from './components/DashboardCards';
import { DashboardHeader } from './components/DashboardHeader';
import { useCards } from './hooks/useCards';

export const Dashboard = (): React.JSX.Element | null => {
  const { user } = useAuth();
  const { cards, loading, error } = useCards();

  if (loading) {
    return (
      <p className="font-['Press_Start_2P'] text-[10px] tracking-widest text-green-500 animate-pulse">
        ─ CARGANDO... ─
      </p>
    );
  }

  if (error) {
    return (
      <p
        role="alert"
        className="font-['VT323'] text-lg text-red-400 border-2 border-red-500/40 bg-red-500/10 px-3 py-2"
      >
        ✕ {error}
      </p>
    );
  }

  if (!cards) return null;

  return (
    <div>
      <DashboardHeader userName={user?.name} />
      <DashboardCards {...cards} />
    </div>
  );
};
