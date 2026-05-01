import { useState } from 'react';

import { useAuth } from '../../../context/hooks/useAuth';
import { AsyncState } from '../../../shared/components/AsyncState';
import { CharacterBadge } from '../../character/ui/components/CharacterBadge';
import { TierUpModal } from '../../character/ui/components/TierUpModal';
import { useCharacterState } from '../../character/ui/hooks/useCharacterState';
import { DietSummaryCard } from '../../diet/ui/components/DietSummaryCard';
import { useDiet } from '../../diet/ui/hooks/useDiet';
import { useStreakStatus } from '../../streak/ui/hooks/useStreakStatus';
import { DashboardCards } from './components/DashboardCards';
import { DashboardHeader } from './components/DashboardHeader';
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
    choosing: characterChoosing,
    chooseClass,
  } = useCharacterState();

  const [tierUpDismissed, setTierUpDismissed] = useState<boolean>(false);

  const combinedData = cards && summary ? { cards, summary } : null;
  const handleRetry = (): void => {
    void refetchCards();
    void refetchSummary();
  };

  const showTierUpModal = Boolean(
    characterState?.pendingChoice && !tierUpDismissed
  );

  const handleConfirmChoice = async (classId: string): Promise<void> => {
    if (!characterState?.pendingChoice) return;
    const success = await chooseClass(
      characterState.pendingChoice.tier,
      classId
    );
    if (success) setTierUpDismissed(false);
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
          {characterState && (
            <div className="mt-4">
              <CharacterBadge state={characterState} />
            </div>
          )}
          <DashboardCards {...cards} />
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
              onClose={() => setTierUpDismissed(true)}
            />
          )}
        </div>
      )}
    </AsyncState>
  );
};
