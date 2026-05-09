import { motion } from 'framer-motion';

import { PixelCorners } from '@shared/components/PixelCorners';
import type { StatPilar } from '../../core/domain/models/StatPilar';
import { StatBar } from './StatBar';
import { StatsPanelSkeleton } from './StatsPanelSkeleton';

interface StatsPanelProps {
  stats: StatPilar[] | null;
  loading?: boolean;
  error?: string | null;
}

// Stagger the entrance of the 6 stat bars on mount — each row slides
// up + fades in 80ms after the previous one, so the whole panel
// "draws itself in" rather than appearing all at once. Pairs with the
// bar-fill animation already inside StatBar (the bar grows from 0 to
// the level percentage), which now triggers mid-fade-in for a layered
// effect. Framer Motion's initial+animate only fires once on mount,
// so the cascade isn't replayed on every prop change.
const panelContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const panelItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export const StatsPanel = (
  props: StatsPanelProps
): React.JSX.Element | null => {
  if (props.loading) return <StatsPanelSkeleton />;

  if (props.error) {
    return (
      <div className="relative border-2 border-red-500/40 bg-card p-4">
        <PixelCorners size="sm" className="border-red-500/40" />
        <p className="font-pixel text-base text-red-300">{props.error}</p>
      </div>
    );
  }

  if (!props.stats || props.stats.length === 0) return null;

  return (
    <section className="relative border-2 border-green-500/50 bg-card p-5 shadow-[0_0_18px_rgba(34,197,94,0.18)]">
      <PixelCorners size="md" className="border-green-500/50" />
      <p className="mb-4 font-pixel text-[10px] tracking-widest text-green-500">
        ◆ STATS DEL PERSONAJE
      </p>
      {/* Two-column on wider viewports. The panel now sits full-width
          on /perfil (moved out of the aside so the page balances), so
          stacking all 6 bars in a single column wastes the extra
          width and doubles the panel's height. The grid splits 6 → 3
          rows × 2 cols at md+, falling back to single-column on
          narrow viewports where the StatBar internals don't fit. */}
      <motion.div
        className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2"
        variants={panelContainerVariants}
        initial="hidden"
        animate="visible"
      >
        {props.stats.map((pilar) => (
          <motion.div key={pilar.name} variants={panelItemVariants}>
            <StatBar pilar={pilar} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
