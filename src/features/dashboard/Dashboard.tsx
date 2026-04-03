import { DashboardCards } from './components/DashboardCards';
import { DashboardData } from './models/DashboardData';

export const Dashboard = (): React.JSX.Element => {
  return (
    <div>
      <h1>Dashboard</h1>
      <DashboardCards data={DashboardData} />
    </div>
  );
};
