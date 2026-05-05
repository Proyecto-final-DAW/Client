import { useEffect, useState } from 'react';

import { useAuth } from '../../../context/hooks/useAuth';
import { useCharacterState } from '../../../context/hooks/useCharacterState';
import { AsyncState } from '../../../shared/components/AsyncState';
import { OriginStoryIntro } from '../../character/ui/components/OriginStoryIntro';
import { TierUpModal } from '../../character/ui/components/TierUpModal';
import { DietSummaryCard } from '../../diet/ui/components/DietSummaryCard';
import { useDiet } from '../../diet/ui/hooks/useDiet';
import { ProfileHeroBanner } from '../../profile/ui/components/ProfileHeroBanner';
import { StatsPanelCompact } from '../../stats/ui/components/StatsPanelCompact';
import { useStats } from '../../stats/ui/hooks/useStats';
import { useStreakStatus } from '../../streak/ui/hooks/useStreakStatus';
import { DashboardCards } from './components/DashboardCards';
import { DashboardHeader } from './components/DashboardHeader';
import { RecommendedRoutineCard } from './components/RecommendedRoutineCard';
import { StartWorkoutButton } from './components/StartWorkoutButton';
import { StreakWarningCard } from './components/StreakWarningCard';
import { WeeklySummaryCard } from './components/weekly-summary/WeeklySummaryCard';
import { useCards } from './hooks/useCards';
import { useWeeklySummary } from './hooks/useWeeklySummary';

export const Dashboard = (): React.JSX.Element => {
  const { user } = useAuth();
  const { cards, loading, error, refetch: refetchCards } = useCards();
  const {
    summary,
    loading: summaryLoading,
    error: summaryError,
    refetch: refetchSummary,
  } = useWeeklySummary();
  const {
    diet,
    loading: dietLoading,
    refreshing: dietRefreshing,
    error: dietError,
    refetch: dietRefetch,
  } = useDiet();
  const { status: streakStatus } = useStreakStatus();
  const {
    state: characterState,
    error: characterError,
    choosing: characterChoosing,
    chooseClass,
  } = useCharacterState();
  const { stats, loading: statsLoading, error: statsError } = useStats();

  // Per-tier dismissal: clicking "MAS TARDE" hides the modal for the current
  // tier only. When a new pending choice arrives (e.g. T2 after T1), the
  // modal opens again automatically.
  const [dismissedTier, setDismissedTier] = useState<number | null>(null);
  const pendingTier = characterState?.pendingChoice?.tier ?? null;

  useEffect(() => {
    if (pendingTier === null) {
      setDismissedTier(null);
    }
  }, [pendingTier]);

  // First-visit origin story. Fires once per browser, on the user's very
  // first landing on the dashboard — typically right after onboarding. A
  // 5-panel narrative that frames the user as an Iniciado at the start of
  // a 7-rank journey. localStorage flag keeps the dismissal across reloads
  // so returning users never see it twice.
  const [originStoryDismissed, setOriginStoryDismissed] = useState(
    () => localStorage.getItem('origin_story_seen') === '1'
  );
  const showOriginStory = !originStoryDismissed;

  const handleDismissOriginStory = (): void => {
    localStorage.setItem('origin_story_seen', '1');
    setOriginStoryDismissed(true);
  };

  const combinedData = cards && summary ? { cards, summary } : null;
  const handleRetry = (): void => {
    void refetchCards();
    void refetchSummary();
  };

  const showTierUpModal =
    characterState?.pendingChoice !== null &&
    characterState?.pendingChoice !== undefined &&
    dismissedTier !== characterState.pendingChoice.tier;

  const handleConfirmChoice = async (classId: string): Promise<void> => {
    if (!characterState?.pendingChoice) return;
    try {
      await chooseClass(characterState.pendingChoice.tier, classId);
      // Success: state updates automatically via context. If the next tier
      // also has a pending choice, the modal will re-open with it.
    } catch {
      // Error message is already in characterError; the modal stays open so
      // the user can retry or dismiss.
    }
  };

  const handleDismiss = (): void => {
    if (pendingTier !== null) setDismissedTier(pendingTier);
  };

  return (
    <AsyncState
      loading={loading || summaryLoading}
      error={error ?? summaryError}
      data={combinedData}
      onRetry={handleRetry}
      loadingLabel="CARGANDO DASHBOARD"
    >
      {({ cards, summary }) => (
        // max-w-7xl caps the dashboard on ultrawide monitors so cards don't
        // grow into elongated horizontal slabs. Below 1280px (lg) it has
        // no effect — the layout adapts via the 2-col grid further down.
        <div className="mx-auto max-w-7xl">
          <DashboardHeader userName={user?.name} />

          {/* Identity strip — full width since it's the user's "character
              sheet" header, the same component is reused on /perfil. */}
          <div className="my-4">
            <ProfileHeroBanner
              name={user?.name ?? 'Heroe'}
              profileImage={user?.profileImage ?? null}
              characterState={characterState}
            />
          </div>

          {streakStatus?.isAtRisk && (
            <div className="my-4">
              <StreakWarningCard status={streakStatus} />
            </div>
          )}

          {/* Primary CTA — auto-width centered (used to be a full-width
              slab that visually dominated everything below it). */}
          <div className="my-4 flex justify-center">
            <StartWorkoutButton />
          </div>

          {characterError && !characterState && (
            <div className="mt-4 border-2 border-red-500/40 bg-card p-3 text-center font-pixel-mono text-base text-red-300">
              {characterError}
            </div>
          )}

          {/* 2-col body. Left column (lg:col-span-2) holds action content
              (rutina, dieta) — the things the user acts on. Right column is
              passive context (stats glance, streak) — the things the user
              checks. Splitting reduces total page height by ~40% and ends
              the previous "long thin column of full-width slabs" feel. */}
          <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="flex flex-col gap-4 lg:col-span-2">
              <RecommendedRoutineCard />
              <DietSummaryCard
                diet={diet}
                loading={dietLoading}
                refreshing={dietRefreshing}
                error={dietError}
                onRefresh={dietRefetch}
              />
            </div>

            <div className="flex flex-col gap-4">
              <StatsPanelCompact
                stats={stats?.pilpilar ?? null}
                loading={statsLoading}
                error={statsError}
              />
              <DashboardCards {...cards} />
            </div>
          </section>

          {/* WeeklySummary alone on its row — its 3-row stat layout reads
              right at full width below the 2-col body. */}
          <div className="mt-4">
            <WeeklySummaryCard summary={summary} />
          </div>

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
      )}
    </AsyncState>
  );
};
