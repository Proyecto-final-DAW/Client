import { useEffect, useState } from 'react';

import { useAuth } from '../../../context/hooks/useAuth';
import { useCharacterState } from '../../../context/hooks/useCharacterState';
import { AsyncState } from '../../../shared/components/AsyncState';
import { StatsPanel } from '../../stats/ui/components/StatsPanel';
import { useStats } from '../../stats/ui/hooks/useStats';
import { AccountSummary } from './components/AccountSummary';
import { ChangePasswordForm } from './components/ChangePasswordForm';
import { ProfileDataView } from './components/ProfileDataView';
import { ProfileForm } from './components/ProfileForm';
import { ProfileHeroBanner } from './components/ProfileHeroBanner';
import { ProfileIntroModal } from './components/ProfileIntroModal';
import { useProfile } from './hooks/useProfile';

export const ProfileView = (): React.JSX.Element => {
  const { user } = useAuth();
  const {
    profile,
    loading,
    error,
    updateProfile,
    updating,
    updateError,
    updateSuccess,
    changePassword,
    changingPassword,
    passwordError,
    passwordSuccess,
  } = useProfile();
  const { state: characterState } = useCharacterState();
  const { stats, loading: statsLoading, error: statsError } = useStats();

  const [editing, setEditing] = useState(false);

  // One-time character explainer — per-user localStorage flag.
  const profileIntroStorageKey =
    user?.id != null ? `profile_intro_seen_${user.id}` : null;

  const [profileIntroDismissed, setProfileIntroDismissed] = useState(
    () =>
      profileIntroStorageKey !== null &&
      localStorage.getItem(profileIntroStorageKey) === '1'
  );

  useEffect(() => {
    if (profileIntroStorageKey === null) {
      setProfileIntroDismissed(true);
      return;
    }
    setProfileIntroDismissed(
      localStorage.getItem(profileIntroStorageKey) === '1'
    );
  }, [profileIntroStorageKey]);

  const showProfileIntro =
    profileIntroStorageKey !== null && !profileIntroDismissed;

  const handleDismissProfileIntro = (): void => {
    if (profileIntroStorageKey !== null) {
      localStorage.setItem(profileIntroStorageKey, '1');
    }
    setProfileIntroDismissed(true);
  };

  return (
    <>
      <ProfileIntroModal
        open={showProfileIntro}
        onClose={handleDismissProfileIntro}
      />
      <AsyncState
        loading={loading}
        error={error}
        data={profile}
        loadingLabel="CARGANDO PERFIL"
      >
        {(profile) => (
          <div className="mx-auto max-w-6xl">
            {/* Slim eyebrow only — the ProfileHeroBanner directly below
              already carries the page identity (rank + class + name +
              level). The previous "MI PERSONAJE" h1 duplicated that
              role and pushed the banner further down the fold. */}
            <header className="mb-4 text-center sm:text-left">
              <p className="font-pixel text-[9px] tracking-widest text-green-500">
                ▶ PERSONAJE
              </p>
            </header>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Left column — banner + character metrics + stats.
                Order: banner (identity) → resumen (dias/combates/record)
                → stats (6 pillars).

                No `lg:self-start`: the aside stretches to the grid row
                height so it ends at the exact same Y as the main
                column (the previous self-start left a small vertical
                offset between the two columns). Sticky still works
                because the parent (the grid container itself) has no
                overflow constraint. */}
              <aside className="flex flex-col gap-5 lg:col-span-1 lg:sticky lg:top-24">
                <ProfileHeroBanner
                  name={profile.name || user?.name || 'Heroe'}
                  profileImage={user?.profileImage ?? null}
                  characterState={characterState}
                />
                <AccountSummary
                  createdAt={profile.created_at}
                  totalSessions={profile.total_sessions}
                  bestStreak={profile.best_streak}
                />
                <StatsPanel
                  stats={stats?.pillar ?? null}
                  loading={statsLoading}
                  error={statsError}
                />
              </aside>

              {/* Right: read-only data card by default, editor with profile form
                AND password change when the user clicks EDITAR. */}
              <div className="flex flex-col gap-5 lg:col-span-2">
                {editing ? (
                  <>
                    <ProfileForm
                      profile={profile}
                      onSubmit={async (data) => {
                        // Close the editor on a clean save. Without this
                        // the form stayed open and the user could keep
                        // editing — making "Guardar" feel like a no-op
                        // when nothing visibly changed (the read-only
                        // view was hidden behind the form).
                        const ok = await updateProfile(data);
                        if (ok) setEditing(false);
                      }}
                      onCancel={() => setEditing(false)}
                      updating={updating}
                      error={updateError}
                      success={updateSuccess}
                    />
                    <ChangePasswordForm
                      onSubmit={changePassword}
                      loading={changingPassword}
                      error={passwordError}
                      success={passwordSuccess}
                    />
                  </>
                ) : (
                  <ProfileDataView
                    profile={profile}
                    onEdit={() => setEditing(true)}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </AsyncState>
    </>
  );
};
