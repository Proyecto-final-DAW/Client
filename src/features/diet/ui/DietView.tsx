import { useEffect, useState } from 'react';
import type React from 'react';

import { useAuth } from '../../../context/hooks/useAuth';
import { DietIntroModal } from './components/DietIntroModal';
import { DietStreakCard } from './components/DietStreakCard';
import { DietSummaryCard } from './components/DietSummaryCard';
import { useDiet } from './hooks/useDiet';
import { ACTIVITY_LABEL, GOAL_LABEL } from './labels';

/**
 * Builds the contextual banner shown above the diet card — turns the
 * raw kcal figure into a sentence the user can place ("yo estoy
 * cortando, activo, asi que 2.180 tiene sentido"). Skipped silently if
 * the user object isn't loaded yet.
 */
const useDietContext = (): { goalText: string; activityText: string } => {
  const { user } = useAuth();
  const goal = user?.goals?.[0];
  const activity = user?.activity_level;
  return {
    goalText: goal ? (GOAL_LABEL[goal] ?? goal) : '',
    activityText: activity ? (ACTIVITY_LABEL[activity] ?? activity) : '',
  };
};

export const DietView = (): React.JSX.Element => {
  const { diet, loading, error, refetch } = useDiet();
  const { goalText, activityText } = useDietContext();
  const { user } = useAuth();

  // One-time diet explainer — same per-user localStorage pattern the
  // dashboard uses for OriginStoryIntro / StreakIntroModal so a
  // shared browser doesn't suppress the popup for a second account.
  // Defaults to dismissed when there's no user id yet (modal only
  // makes sense once we know who to scope the flag to).
  const dietIntroStorageKey =
    user?.id != null ? `diet_intro_seen_${user.id}` : null;

  const [dietIntroDismissed, setDietIntroDismissed] = useState(
    () =>
      dietIntroStorageKey !== null &&
      localStorage.getItem(dietIntroStorageKey) === '1'
  );

  useEffect(() => {
    if (dietIntroStorageKey === null) {
      setDietIntroDismissed(true);
      return;
    }
    setDietIntroDismissed(localStorage.getItem(dietIntroStorageKey) === '1');
  }, [dietIntroStorageKey]);

  const showDietIntro = dietIntroStorageKey !== null && !dietIntroDismissed;

  const handleDismissDietIntro = (): void => {
    if (dietIntroStorageKey !== null) {
      localStorage.setItem(dietIntroStorageKey, '1');
    }
    setDietIntroDismissed(true);
  };

  // Joined with a middle dot — same separator used on the rank label of
  // the ProfileHeroBanner ("ESPECIALISTA"), keeps the visual rhythm
  // consistent across pages.
  const contextLine = [goalText, activityText].filter(Boolean).join(' · ');

  return (
    // Full width — no `max-w-*` so the macros donut + 3 macro cards
    // grid uses the entire page width. The DashboardLayout already
    // provides outer padding, so this just stretches to fill it.
    <section className="w-full text-ink">
      <header className="mb-5">
        <p className="font-pixel text-[8px] tracking-widest text-green-500">
          ▶ DIETA
        </p>
        <h1 className="mt-1.5 font-pixel text-xs sm:text-sm tracking-widest text-green-400 [text-shadow:0_0_14px_rgba(34,197,94,0.5)]">
          RESUMEN NUTRICIONAL
        </h1>
        {contextLine ? (
          <p className="mt-2 font-pixel text-[8px] sm:text-[9px] tracking-widest text-ink-muted">
            {contextLine.toUpperCase()}
          </p>
        ) : (
          <p className="mt-2 font-pixel-mono text-base leading-snug text-ink-muted">
            Calorias diarias y distribucion de macros calculadas desde tu
            perfil.
          </p>
        )}
      </header>

      <DietSummaryCard
        diet={diet}
        loading={loading}
        error={error}
        onRefresh={refetch}
        footer={<DietStreakCard />}
      />

      <DietIntroModal open={showDietIntro} onClose={handleDismissDietIntro} />
    </section>
  );
};
