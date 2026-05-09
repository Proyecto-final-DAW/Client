import { UserCircleIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

import { PixelCorners } from '@shared/components/PixelCorners';
import {
  STAT_CONFIG,
  STAT_ORDER,
} from '@features/stats/core/domain/models/StatConfig';

type StatKey = (typeof STAT_ORDER)[number];

/**
 * Mirrors `MAX_STAT_LEVEL` on the server (progression.service.ts). 99 is
 * the in-app ceiling — T6 LEYENDA requires every stat at 99, and there's
 * no level 100. Putting the cap here lets the marketing card render
 * `value/99` instead of the cosmetic `/100` it used to show, which
 * implied a different scale than the one inside the app.
 */
const MAX_STAT_LEVEL = 99;

/**
 * Marketing-mock stat *levels*. Sourced from STAT_CONFIG so the icons
 * and accent colours match what the user sees once they sign in —
 * previously this card had its own heroicons and an unrelated palette,
 * which made the in-app dashboard feel like a different product the
 * moment you logged in. Same icons, same colours: same character.
 */
const STAT_VALUES: Record<StatKey, number> = {
  strength: 88,
  resistance: 78,
  stamina: 82,
  agility: 70,
  tenacity: 60,
  vigor: 74,
};

/**
 * Hero LVL is the average of stat levels in-app (see `StatsFromDTO`).
 * Mirroring that here keeps the marketing card internally consistent —
 * showing LVL 23 with stats in the 60-88 range made it look like the
 * level pill and the bars belonged to different characters. Stats reach
 * 99 in-app, so a high-stat preview deservedly shows a high LVL.
 */
const HERO_LEVEL = Math.round(
  STAT_ORDER.reduce((sum, key) => sum + STAT_VALUES[key], 0) / STAT_ORDER.length
);

const StatRow = ({ statKey }: { statKey: StatKey }): React.JSX.Element => {
  const config = STAT_CONFIG[statKey];
  const value = STAT_VALUES[statKey];
  const Icon = config.icon;
  const accent = config.accentColor;

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border-2 border-border"
        style={{ backgroundColor: `${accent}1f` }}
      >
        <Icon className="h-4 w-4" style={{ color: accent }} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <span className="font-pixel text-[8px] tracking-widest text-ink truncate">
            {config.name.toUpperCase()}
          </span>
          <span
            className="font-pixel text-[8px] tracking-widest shrink-0"
            style={{ color: accent }}
          >
            {value}
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-sm bg-[#1e1e2e]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(value / MAX_STAT_LEVEL) * 100}%` }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="h-full"
            style={{
              backgroundColor: accent,
              boxShadow: `0 0 8px ${accent}66`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * Theatrical character preview for the landing hero. Renders a fake
 * GUERRERO with a pixel-art avatar, a level badge, frase del lore and
 * the same six stats the user will see inside the app. Picked GUERRERO
 * over BERSERKER because the latter is a specialist class some users
 * never reach — the marketing card needs to read as "this is the kind
 * of identity you'll build", not "here's a niche endgame archetype".
 */
export const HeroStatsPanel = (): React.JSX.Element => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-md mx-auto border-2 border-green-500/60 bg-card p-5 sm:p-6 shadow-[0_0_0_4px_rgba(10,10,15,0.8),0_0_50px_rgba(34,197,94,0.4),0_20px_50px_rgba(0,0,0,0.8)]"
    >
      <PixelCorners size="md" className="border-green-500/60" />

      {/* Identity row — anonymous avatar (placeholder until per-class
          icons exist) + name + rank pill */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b-2 border-border">
        <div className="relative shrink-0">
          <div className="flex h-16 w-16 items-center justify-center border-2 border-green-500/40 bg-green-500/10 shadow-[0_0_18px_rgba(34,197,94,0.35)]">
            <UserCircleIcon className="h-10 w-10 text-green-400" />
          </div>
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center justify-center border-2 border-green-700 bg-green-500 px-1.5 py-0.5 font-pixel text-[7px] tracking-widest text-[#0a0a0f] shadow-[0_0_8px_rgba(34,197,94,0.55)]">
            LVL {HERO_LEVEL}
          </span>
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p className="font-pixel text-[8px] tracking-widest text-green-500">
            ◆ VOCACION
          </p>
          <p className="mt-1 font-pixel text-base text-green-400 [text-shadow:2px_2px_0_#000,0_0_14px_rgba(34,197,94,0.45)]">
            GUERRERO
          </p>
        </div>
      </div>

      <p className="mb-4 font-pixel-mono text-base italic leading-snug text-ink">
        “La fuerza que entrenas hoy es el escudo que llevas mañana.”
      </p>

      {/* All six stats. Two columns on small screens up so a 6-row
          column doesn't push the panel taller than the headline next
          to it. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
        {STAT_ORDER.map((key) => (
          <StatRow key={key} statKey={key} />
        ))}
      </div>
    </motion.div>
  );
};
