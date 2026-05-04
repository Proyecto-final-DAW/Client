import { motion } from 'framer-motion';

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
    <motion.section
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
      }}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-5 md:grid-cols-3 items-stretch"
    >
      <StreakCard streak={props.streak} trainingDays={props.trainingDays} />
      <LastWorkoutCard lastWorkoutDaysAgo={props.lastWorkoutDaysAgo} />
      <GlobalLevelCard globalLevel={globalLevel} />
    </motion.section>
  );
};
