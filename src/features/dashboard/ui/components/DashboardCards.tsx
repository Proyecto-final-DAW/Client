import type { Cards } from '../../core/domain/models/Cards';
import { GlobalLevelCard } from './GlobalLevelCard';
import { LastWorkoutCard } from './LastWorkoutCard';
import { StreakCard } from './StreakCard';

type Props = Cards;

export const DashboardCards = (props: Props): React.JSX.Element => {
  const globalLevel =
    Object.values(props.stats).reduce((acc, val) => acc + val, 0) /
    Object.values(props.stats).length;

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <StreakCard streak={props.streak} />
      <LastWorkoutCard lastWorkoutDaysAgo={props.lastWorkoutDaysAgo} />
      <GlobalLevelCard globalLevel={globalLevel} />
    </section>
  );
};
