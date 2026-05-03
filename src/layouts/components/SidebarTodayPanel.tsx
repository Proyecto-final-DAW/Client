import {
  CalendarDaysIcon,
  FireIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

import { useCharacterState } from '../../context/hooks/useCharacterState';
import { useStats } from '../../features/stats/ui/hooks/useStats';
import { useStreakStatus } from '../../features/streak/ui/hooks/useStreakStatus';
import { PixelCorners } from '../../shared/components/PixelCorners';

/**
 * Compact "today" panel rendered in the sidebar so the user always sees
 * their current streak / hero level / next-milestone progress without
 * having to navigate to the dashboard.
 *
 * Pulls data from the same hooks the rest of the app already uses, so
 * cache and refetch work transparently.
 */
export const SidebarTodayPanel = (): React.JSX.Element => {
  const { state: character } = useCharacterState();
  const { stats } = useStats();
  const { status: streakStatus } = useStreakStatus();

  // Always show an integer hero level (no halves from mid-level XP averaging).
  const heroLevel = Math.floor(character?.heroLevel ?? stats?.level ?? 1);
  const streak = streakStatus?.currentStreak ?? 0;
  const xpInLevel = stats?.pilpilar.length
    ? Math.round(
        stats.pilpilar.reduce((sum, p) => sum + p.value, 0) /
          stats.pilpilar.length
      )
    : 0;
  const xpPercent = Math.min(100, xpInLevel);

  return (
    <section className="relative border-2 border-green-500/40 bg-[#0d0d14] p-3">
      <PixelCorners size="sm" className="border-green-500/40" />

      <p className="font-['Press_Start_2P'] text-[8px] tracking-widest text-green-500 mb-3">
        ▸ HOY
      </p>

      {/* Hero level + XP bar */}
      <div className="mb-3">
        <div className="flex items-baseline justify-between mb-1">
          <span className="font-['Press_Start_2P'] text-[8px] tracking-widest text-[#a1a1aa]">
            HEROE LVL
          </span>
          <span className="font-['Press_Start_2P'] text-[10px] text-green-400 [text-shadow:0_0_8px_rgba(34,197,94,0.6)]">
            {heroLevel}
          </span>
        </div>
        <div className="h-1.5 w-full border border-green-500/30 bg-[#0a0a0f] overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-700 shadow-[0_0_6px_rgba(34,197,94,0.6)]"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
      </div>

      {/* Streak */}
      <div className="mb-2 flex items-center gap-2">
        <FireIcon
          className={`h-4 w-4 shrink-0 ${streak > 0 ? 'text-orange-400' : 'text-[#52525b]'}`}
        />
        <span className="font-['Press_Start_2P'] text-sm text-[#e4e4e7]">
          Racha:{' '}
          <span className="font-['Press_Start_2P'] text-[9px] text-orange-400">
            {streak}
          </span>
        </span>
      </div>

      {/* Title (RPG flavor) */}
      <div className="flex items-center gap-2">
        <TrophyIcon className="h-4 w-4 shrink-0 text-yellow-500/70" />
        <span className="font-['Press_Start_2P'] text-sm text-[#a1a1aa] truncate">
          {stats?.title ?? '—'}
        </span>
      </div>

      {/* Days-of-week mini calendar slot kept here for future expansion. */}
      <div className="mt-3 hidden sm:flex items-center gap-2 border-t border-[#1e1e2e] pt-3">
        <CalendarDaysIcon className="h-4 w-4 shrink-0 text-[#52525b]" />
        <span className="font-['Press_Start_2P'] text-sm text-[#71717a]">
          {new Intl.DateTimeFormat('es-ES', {
            day: 'numeric',
            month: 'short',
          }).format(new Date())}
        </span>
      </div>
    </section>
  );
};
