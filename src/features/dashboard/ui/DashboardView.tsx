import { useEffect, useState } from 'react';

import { useAuth } from '../../../context/hooks/useAuth';
import { useCharacterState } from '../../../context/hooks/useCharacterState';
import { AsyncState } from '../../../shared/components/AsyncState';
import { ClassIntroModal } from '../../character/ui/components/ClassIntroModal';
import { TierUpModal } from '../../character/ui/components/TierUpModal';
import { DietSummaryCard } from '../../diet/ui/components/DietSummaryCard';
import { useDiet } from '../../diet/ui/hooks/useDiet';
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

  // First-visit class system intro. Shown once per browser, only while the
  // user is at tier 0 (novato) with no pending choice yet — a returning user
  // who already chose a vocation never sees it. localStorage flag keeps the
  // dismissal across reloads.
  const [classIntroDismissed, setClassIntroDismissed] = useState(
    () => localStorage.getItem('class_intro_seen') === '1'
  );
  const showClassIntroModal =
    characterState !== null &&
    characterState.currentTier === 0 &&
    characterState.pendingChoice === null &&
    !classIntroDismissed;

  const handleDismissClassIntro = (): void => {
    localStorage.setItem('class_intro_seen', '1');
    setClassIntroDismissed(true);
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
        <div>
          <DashboardHeader userName={user?.name} />
          {streakStatus?.isAtRisk && (
            <div className="my-4">
              <StreakWarningCard status={streakStatus} />
            </div>
          )}
          <div className="my-4">
            <StartWorkoutButton />
          </div>
          {characterError && !characterState && (
            <div className="mt-4 border-2 border-red-500/40 bg-card p-3 text-center font-pixel-mono text-base text-red-300">
              {characterError}
            </div>
          )}
          {/* Glance-only stats panel: tile grid with mini bars. The full
              CharacterBadge + 6-bar StatsPanel live in /perfil so we don't
              duplicate the visual weight here. "VER TODO" link bridges them. */}
          <div className="mt-4">
            <StatsPanelCompact
              stats={stats?.pilpilar ?? null}
              loading={statsLoading}
              error={statsError}
            />
          </div>
          <div className="mt-4">
            <DashboardCards {...cards} />
          </div>
          {/* WeeklySummary alone on its row — its 3-row stat layout looks
              right at full width. Recommended + Diet pair below in a 2-col
              grid because both have similar visual weight and content
              density, so neither one ends up orphaned. */}
          <div className="mt-4">
            <WeeklySummaryCard summary={summary} />
          </div>
          <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <RecommendedRoutineCard />
            <DietSummaryCard
              diet={diet}
              loading={dietLoading}
              refreshing={dietRefreshing}
              error={dietError}
              onRefresh={dietRefetch}
            />
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

          {characterState && (
            <ClassIntroModal
              open={showClassIntroModal}
              noviceName={characterState.novice.name}
              onClose={handleDismissClassIntro}
            />
          )}
        </div>
      )}
    </AsyncState>
  );
};
