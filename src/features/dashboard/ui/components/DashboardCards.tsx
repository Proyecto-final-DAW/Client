import type { Cards } from '../../core/domain/models/Cards';
import { GlobalLevelCard } from './GlobalLevelCard';
import { LastWorkoutCard } from './LastWorkoutCard';
import { StreakCard } from './StreakCard';

type Props = Cards;

export const DashboardCards = ({
  streak,
  lastWorkoutDaysAgo,
  stats,
}: Props): React.JSX.Element => {
  const globalLevel =
    Object.values(stats).reduce((acc, val) => acc + val, 0) /
    Object.values(stats).length;

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <StreakCard streak={streak} />
      <LastWorkoutCard lastWorkoutDaysAgo={lastWorkoutDaysAgo} />
      <GlobalLevelCard globalLevel={globalLevel} />
    </section>
  );
};
