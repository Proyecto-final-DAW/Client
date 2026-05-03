import { useState } from 'react';

import { useCharacterState } from '../../../context/hooks/useCharacterState';
import { AsyncState } from '../../../shared/components/AsyncState';
import { CharacterBadge } from '../../character/ui/components/CharacterBadge';
import { StatsPanel } from '../../stats/ui/components/StatsPanel';
import { useStats } from '../../stats/ui/hooks/useStats';
import { AccountSummary } from './components/AccountSummary';
import { ChangePasswordForm } from './components/ChangePasswordForm';
import { ProfileDataView } from './components/ProfileDataView';
import { ProfileForm } from './components/ProfileForm';
import { useProfile } from './hooks/useProfile';

export const ProfileView = (): React.JSX.Element => {
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
  const {
    state: characterState,
    loading: characterLoading,
    error: characterError,
  } = useCharacterState();
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
        <div className="mx-auto max-w-3xl">
          <header className="mb-6">
            <p className="font-['Press_Start_2P'] text-[9px] tracking-widest text-green-500">
              ▶ PERFIL
            </p>
            <h1 className="mt-2 font-['Press_Start_2P'] text-base sm:text-lg tracking-widest text-green-400 [text-shadow:0_0_16px_rgba(34,197,94,0.55)]">
              MI PERSONAJE
            </h1>
          </header>

          <div className="flex flex-col gap-6">
            {characterState && <CharacterBadge state={characterState} />}
            {!characterState && characterLoading && (
              <div className="border-2 border-green-500/30 bg-[#0d0d14] p-3 text-center font-['Press_Start_2P'] text-[9px] tracking-widest text-green-500/60">
                CARGANDO PERSONAJE…
              </div>
            )}
            {!characterState && !characterLoading && characterError && (
              <div className="border-2 border-red-500/40 bg-[#0d0d14] p-3 text-center font-['Press_Start_2P'] text-base text-red-300">
                {characterError}
              </div>
            )}

            <StatsPanel
              stats={stats?.pilpilar ?? null}
              loading={statsLoading}
              error={statsError}
            />

            <AccountSummary
              createdAt={profile.created_at}
              totalSessions={profile.total_sessions}
              bestStreak={profile.best_streak}
              streak={profile.streak}
            />

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
      )}
    </AsyncState>
  );
};
