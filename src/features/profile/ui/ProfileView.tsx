import { useState } from 'react';

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

  return (
    <AsyncState
      loading={loading}
      error={error}
      data={profile}
      loadingLabel="CARGANDO PERFIL"
    >
      {(profile) => (
        <div className="mx-auto max-w-6xl">
          <header className="mb-6 text-center sm:text-left">
            <p className="font-pixel text-[9px] tracking-widest text-green-500">
              ▶ PERFIL
            </p>
            <h1 className="mt-2 font-pixel text-base sm:text-lg tracking-widest text-green-400 [text-shadow:0_0_16px_rgba(34,197,94,0.55)]">
              MI PERSONAJE
            </h1>
          </header>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left: identity + character sheet. Sticky on desktop so it stays
                visible while the user scrolls long forms on the right. */}
            <aside className="flex flex-col gap-5 lg:col-span-1 lg:sticky lg:top-24 lg:self-start">
              <ProfileHeroBanner
                name={profile.name || user?.name || 'Heroe'}
                profileImage={user?.profileImage ?? null}
                characterState={characterState}
              />
              <StatsPanel
                stats={stats?.pilpilar ?? null}
                loading={statsLoading}
                error={statsError}
              />
              <AccountSummary
                createdAt={profile.created_at}
                totalSessions={profile.total_sessions}
                bestStreak={profile.best_streak}
              />
            </aside>

            {/* Right: read-only data card by default, editor with profile form
                AND password change when the user clicks EDITAR. No tab strip —
                the card already exposes its own EDITAR button so a separate
                row of tabs would just duplicate the action. */}
            <div className="flex flex-col gap-5 lg:col-span-2">
              {editing ? (
                <>
                  <ProfileForm
                    profile={profile}
                    onSubmit={async (data) => {
                      await updateProfile(data);
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
  );
};
