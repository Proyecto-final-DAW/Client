import { useAuth } from '../../../context/hooks/useAuth';
import { LoadingPixel } from '../../../shared/components/LoadingPixel';
import { DashboardCards } from './components/DashboardCards';
import { DashboardHeader } from './components/DashboardHeader';
import { useCards } from './hooks/useCards';

export const Dashboard = (): React.JSX.Element | null => {
  const { user } = useAuth();
  const { cards, loading, error } = useCards();

  if (loading) {
    return <LoadingPixel />;
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p
          role="alert"
          className="font-['VT323'] text-xl text-red-400 border-2 border-red-500/40 bg-red-500/10 px-4 py-3"
        >
          ✕ {error}
        </p>
      </div>
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
