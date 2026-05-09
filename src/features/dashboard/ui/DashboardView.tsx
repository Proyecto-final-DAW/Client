import { useEffect, useState } from 'react';

import { useAuth } from '../../../context/hooks/useAuth';
import { useCharacterState } from '../../../context/hooks/useCharacterState';
import { OriginStoryIntro } from '../../character/ui/components/OriginStoryIntro';
import { TierUpModal } from '../../character/ui/components/TierUpModal';
import { useStats } from '../../stats/ui/hooks/useStats';
import { useStreakStatus } from '../../streak/ui/hooks/useStreakStatus';
import { DashboardCTAHero } from './components/DashboardCTAHero';
import { DashboardHero } from './components/DashboardHero';
import { DashboardStatsCard } from './components/DashboardStatsCard';
import { StreakCard } from './components/StreakCard';
import { StreakWarningCard } from './components/StreakWarningCard';
import { useCards } from './hooks/useCards';

/**
 * Dashboard — 4 purpose-driven cards instead of one bloated panel.
 *
 *  Row 1: Hero card (full width). Identity, class, frase. The "wow"
 *         opener — substantial, not a slim strip.
 *  Row 2: CTA (2/3) + Racha (1/3). Action and recurring habit, side
 *         by side. Heights match because both are flex-h-full.
 *  Row 3: Stats card (full width). 6 pillars in 2 columns + link to
 *         /perfil for the full character sheet.
 *
 * Earlier versions either crammed everything into a single mega-panel
 * (info overload) or used a slim identity strip that read as empty.
 * Cards-with-purpose is the right shape; what was missing was visual
 * weight inside each card — fixed here with bigger avatars, the class
 * frase, halos and shadow rings.
 */
export const Dashboard = (): React.JSX.Element => {
  const { user } = useAuth();
  const { cards } = useCards();
  const { status: streakStatus } = useStreakStatus();
  const { stats, loading: statsLoading, error: statsError } = useStats();
  const {
    state: characterState,
    error: characterError,
    choosing: characterChoosing,
    chooseClass,
  } = useCharacterState();

  const [dismissedTier, setDismissedTier] = useState<number | null>(null);
  const pendingTier = characterState?.pendingChoice?.tier ?? null;

  useEffect(() => {
    if (pendingTier === null) {
      setDismissedTier(null);
    }
  }, [pendingTier]);

  // Per-user flag — the previous global `origin_story_seen` key meant a
  // second account on the same browser would never see the intro because
  // someone (or a previous test run) had already dismissed it. Scoping
  // to user.id makes every freshly-onboarded user see the popup once.
  const originStoryStorageKey =
    user?.id != null ? `origin_story_seen_${user.id}` : null;

  const [originStoryDismissed, setOriginStoryDismissed] = useState(
    () =>
      originStoryStorageKey !== null &&
      localStorage.getItem(originStoryStorageKey) === '1'
  );

  useEffect(() => {
    if (originStoryStorageKey === null) {
      setOriginStoryDismissed(true);
      return;
    }
    setOriginStoryDismissed(
      localStorage.getItem(originStoryStorageKey) === '1'
    );
  }, [originStoryStorageKey]);

  const showOriginStory =
    originStoryStorageKey !== null && !originStoryDismissed;

  const handleDismissOriginStory = (): void => {
    if (originStoryStorageKey !== null) {
      localStorage.setItem(originStoryStorageKey, '1');
    }
    setOriginStoryDismissed(true);
  };

  const showTierUpModal =
    characterState?.pendingChoice !== null &&
    characterState?.pendingChoice !== undefined &&
    dismissedTier !== characterState.pendingChoice.tier;

  const handleConfirmChoice = async (classId: string): Promise<void> => {
    if (!characterState?.pendingChoice) return;
    try {
      await chooseClass(characterState.pendingChoice.tier, classId);
    } catch {
      // characterError carries the message; modal stays open for retry.
    }
  };

  const handleDismiss = (): void => {
    if (pendingTier !== null) setDismissedTier(pendingTier);
  };

  // Brand-new users start with all 6 stats at level 1 / 0 XP. Any
  // training nudges at least one stat past that floor, so a single
  // pillar showing progress is a reliable "has trained before" signal.
  const hasTrainedBefore =
    stats?.pillar.some((p) => p.level > 1 || p.value > 0) ?? false;

  // `lastWorkoutDaysAgo` is mapped null→0 in CardsFromDTO, so the
  // 0-value alone can't distinguish "trained today" from "never
  // trained". Combine with hasTrainedBefore to catch the new-user
  // case where the field is structurally 0.
  const trainedToday =
    hasTrainedBefore && (cards?.lastWorkoutDaysAgo ?? -1) === 0;

  return (
    <div className="mx-auto max-w-4xl space-y-5 sm:space-y-6">
      {streakStatus?.isAtRisk && <StreakWarningCard status={streakStatus} />}

      {characterError && !characterState && (
        <div className="border-2 border-red-500/40 bg-card p-3 text-center font-pixel-mono text-base text-red-300">
          {characterError}
        </div>
      )}

      <DashboardHero
        name={user?.name ?? 'Heroe'}
        profileImage={user?.profileImage ?? null}
        characterState={characterState}
      />

      <DashboardCTAHero
        hasTrainedBefore={hasTrainedBefore}
        trainedToday={trainedToday}
      />

      {/* Stats + racha side by side from md (tablet) onwards, heights
          matched. Previous breakpoint was lg (1024px), which made the
          768-1023px range stack both as full-width — wasted real
          estate on every tablet. `items-stretch` forces both cards to
          the same row height (the taller one wins — usually the racha
          card with its full month calendar); stats card uses
          `flex-1 auto-rows-fr` internally to spread its 3 rows so the
          bars don't leave a void at the bottom. */}
      <section className="grid grid-cols-1 items-stretch gap-5 sm:gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <DashboardStatsCard
            stats={stats?.pillar ?? null}
            loading={statsLoading}
            error={statsError}
          />
        </div>
        <div className="md:col-span-1">
          {cards && (
            <StreakCard
              streak={cards.streak}
              trainingDays={cards.trainingDays}
              sessionsThisWeek={cards.sessionsThisWeek}
              weeklyTarget={cards.weeklyTarget}
            />
          )}
        </div>
      </section>

      {characterState?.pendingChoice && (
        <TierUpModal
          open={showTierUpModal}
          pendingChoice={characterState.pendingChoice}
          choosing={characterChoosing}
          onConfirm={handleConfirmChoice}
          onClose={handleDismiss}
        />
      )}

      <OriginStoryIntro
        name={user?.name ?? 'Heroe'}
        open={showOriginStory}
        onClose={handleDismissOriginStory}
      />
    </div>
  );
};
