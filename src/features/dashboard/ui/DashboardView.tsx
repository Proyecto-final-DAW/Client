import { useEffect, useState } from 'react';

import { useAuth } from '../../../context/hooks/useAuth';
import { useCharacterState } from '../../../context/hooks/useCharacterState';
import {
  ClassRevealModal,
  type RevealedClass,
} from '../../character/ui/components/ClassRevealModal';
import { OriginStoryIntro } from '../../character/ui/components/OriginStoryIntro';
import { RankUpModal } from '../../character/ui/components/RankUpModal';
import { TierUpModal } from '../../character/ui/components/TierUpModal';
import { useRankUpDetector } from '../../character/ui/hooks/useRankUpDetector';
import { useStats } from '../../stats/ui/hooks/useStats';
import { useStreakStatus } from '../../streak/ui/hooks/useStreakStatus';
import { DashboardCTAHero } from './components/DashboardCTAHero';
import { DashboardHero } from './components/DashboardHero';
import { DashboardStatsCard } from './components/DashboardStatsCard';
import { StreakCard } from './components/StreakCard';
import { StreakIntroModal } from './components/StreakIntroModal';
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

  // Auto-promotion celebration for B / A / S. E/D/C have their own
  // choice modal; this one fires once the server reports we crossed
  // the next auto gate and the user hasn't acknowledged it yet (state
  // is per-user in localStorage). Suppress it whenever a TierUpModal
  // is already on screen so two dialogs never stack.
  const { pendingCelebration, acknowledge: acknowledgeRankUp } =
    useRankUpDetector(characterState, user?.id ?? null);

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

  // Streak rules explainer — same one-time-per-user pattern as the
  // origin story above. Fires AFTER the origin story has been
  // dismissed so we don't pile two modals on the brand-new user; the
  // streak modal also waits until streakStatus has loaded so the
  // weekly target it advertises is the user's real number.
  const streakIntroStorageKey =
    user?.id != null ? `streak_intro_seen_${user.id}` : null;

  const [streakIntroDismissed, setStreakIntroDismissed] = useState(
    () =>
      streakIntroStorageKey !== null &&
      localStorage.getItem(streakIntroStorageKey) === '1'
  );

  useEffect(() => {
    if (streakIntroStorageKey === null) {
      setStreakIntroDismissed(true);
      return;
    }
    setStreakIntroDismissed(
      localStorage.getItem(streakIntroStorageKey) === '1'
    );
  }, [streakIntroStorageKey]);

  const showStreakIntro =
    streakIntroStorageKey !== null &&
    !streakIntroDismissed &&
    !showOriginStory &&
    streakStatus !== null;

  const handleDismissStreakIntro = (): void => {
    if (streakIntroStorageKey !== null) {
      localStorage.setItem(streakIntroStorageKey, '1');
    }
    setStreakIntroDismissed(true);
    // Manual-open path also closes through here, so make sure both
    // signals reset together — otherwise tapping the fire icon a
    // second time would no-op (open ref still true).
    setStreakHelpOpen(false);
  };

  // Manual help trigger from the StreakCard fire icon. Independent
  // of the once-per-user auto-trigger so re-opening the modal stays
  // available indefinitely; the same `handleDismiss…` resets both
  // pathways on close.
  const [streakHelpOpen, setStreakHelpOpen] = useState(false);

  const showTierUpModal =
    characterState?.pendingChoice !== null &&
    characterState?.pendingChoice !== undefined &&
    dismissedTier !== characterState.pendingChoice.tier;

  // Reveal of the class the user just picked. Captured BEFORE the
  // chooseClass call resolves because afterwards `pendingChoice`
  // clears and we'd have no way to look the picked option back up.
  // Shown once `chooseClass` succeeds and the TierUpModal has had a
  // beat to exit — the user wanted "una pasada" instead of the modal
  // silently dismissing.
  const [revealedClass, setRevealedClass] = useState<RevealedClass | null>(
    null
  );

  const handleConfirmChoice = async (classId: string): Promise<void> => {
    if (!characterState?.pendingChoice) return;

    // Snapshot the chosen card BEFORE the request — once the server
    // confirms, `pendingChoice` becomes null and the options vanish.
    // We need name / frase / stat for the reveal hero.
    const pending = characterState.pendingChoice;
    const picked = pending.options.find((option) => option.id === classId);
    const reveal: RevealedClass | null = picked
      ? {
          tier: pending.tier,
          id: picked.id,
          name: picked.name,
          frase: picked.frase,
          // Same per-tier headline-stat resolution as TierUpModal so the
          // reveal accent matches the card the user clicked:
          //   T1 vocation    → dominantStat
          //   T2 spec        → secondaryStat
          //   T3 legendary   → first requiredStats entry
          stat:
            pending.tier === 1
              ? (pending.options.find((o) => o.id === classId)?.dominantStat ??
                null)
              : pending.tier === 2
                ? (pending.options.find((o) => o.id === classId)
                    ?.secondaryStat ?? null)
                : (pending.options.find((o) => o.id === classId)
                    ?.requiredStats[0] ?? null),
        }
      : null;

    try {
      await chooseClass(pending.tier, classId);
      // Only show the reveal on success — a failed request keeps the
      // TierUpModal open with an error message and we don't want to
      // double-render an "ascent" beat for a choice that didn't land.
      if (reveal) setRevealedClass(reveal);
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

  // `lastWorkoutDaysAgo` now preserves null for "never trained"
  // (CardsFromDTO no longer coerces null → 0), so 0 unambiguously
  // means "trained today". The hasTrainedBefore guard remains as a
  // belt-and-braces check while the wider migration through the rest
  // of the app catches up.
  const trainedToday = hasTrainedBefore && cards?.lastWorkoutDaysAgo === 0;

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
              // Forwarded to the inner TrainingCalendar so the user
              // can't scroll the month picker back past their account
              // creation — there's no data there.
              accountCreatedAt={
                user?.created_at ? new Date(user.created_at) : null
              }
              onShowHelp={() => setStreakHelpOpen(true)}
            />
          )}
        </div>
      </section>

      {characterState?.pendingChoice && (
        <TierUpModal
          open={showTierUpModal}
          pendingChoice={characterState.pendingChoice}
          choosing={characterChoosing}
          // Surface `chooseClass` failures inline so a network blip or
          // server rejection doesn't leave the user staring at a modal
          // that silently re-enabled itself. The same string was
          // already in the provider; we just had no place to render it
          // while the modal covered the dashboard.
          error={characterError}
          onConfirm={handleConfirmChoice}
          onClose={handleDismiss}
        />
      )}

      {/* Celebration reveal — pops AFTER the TierUpModal exits on a
          successful choice. Stays mounted while open so the
          AnimatePresence exit transition is allowed to complete. */}
      <ClassRevealModal
        open={revealedClass !== null}
        reveal={revealedClass}
        onClose={() => setRevealedClass(null)}
      />

      {pendingCelebration && characterState && !showTierUpModal && (
        <RankUpModal
          open
          rank={pendingCelebration}
          state={characterState}
          onClose={acknowledgeRankUp}
        />
      )}

      <OriginStoryIntro
        name={user?.name ?? 'Heroe'}
        open={showOriginStory}
        onClose={handleDismissOriginStory}
      />

      <StreakIntroModal
        open={showStreakIntro || streakHelpOpen}
        weeklyTarget={streakStatus?.target ?? 3}
        onClose={handleDismissStreakIntro}
      />
    </div>
  );
};
