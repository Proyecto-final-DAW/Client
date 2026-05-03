import { useEffect, useState } from 'react';

import { useAuth } from '../../../context/hooks/useAuth';
import { useCharacterState } from '../../../context/hooks/useCharacterState';
import { AsyncState } from '../../../shared/components/AsyncState';
import { TierUpModal } from '../../character/ui/components/TierUpModal';
import { DietSummaryCard } from '../../diet/ui/components/DietSummaryCard';
import { useDiet } from '../../diet/ui/hooks/useDiet';
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
          {/* Character badge lives in /perfil (its home). The compact level
              + streak summary is always available in the sidebar HOY panel. */}
          {characterError && !characterState && (
            <div className="mt-4 border-2 border-red-500/40 bg-[#0d0d14] p-3 text-center font-['VT323'] text-base text-red-300">
              {characterError}
            </div>
          )}
          <DashboardCards {...cards} />
          <div className="mt-4">
            <RecommendedRoutineCard />
          </div>
          <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <WeeklySummaryCard summary={summary} />
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
        </div>
      )}
    </AsyncState>
  );
};
