import { DashboardCards } from './components/DashboardCards';
import { DashboardData } from './core/infrastructure/adapters/DashboardData';

export const Dashboard = (): React.JSX.Element => {
  return (
    <div>
      <h1>Dashboard</h1>
      <DashboardCards
        streak={DashboardData.streak}
        lastWorkout={DashboardData.lastWorkout}
        stats={DashboardData.stats}
      />
    </div>
  );
};
