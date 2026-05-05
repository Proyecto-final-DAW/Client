import { motion } from 'framer-motion';

import type { Cards } from '../../core/domain/models/Cards';
import { StreakCard } from './StreakCard';

type Props = Cards;

// LastWorkoutCard and GlobalLevelCard were retired from this row:
// - "ULTIMO COMBATE" duplicated information already visible in StreakCard
//   (today's pixel + the streak count).
// - "NIVEL GLOBAL" duplicated the LVL badge on the ProfileHeroBanner
//   rendered at the top of the dashboard.
// Streak stays alone now and stretches the row, which also lets the calendar
// breathe.
export const DashboardCards = (props: Props): React.JSX.Element => {
  return (
    <motion.section
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
      }}
      initial="hidden"
      animate="visible"
    >
      <StreakCard streak={props.streak} trainingDays={props.trainingDays} />
    </motion.section>
  );
};
