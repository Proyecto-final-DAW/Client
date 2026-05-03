import { useCharacterState } from '../../../context/hooks/useCharacterState';
import { AsyncState } from '../../../shared/components/AsyncState';
import { CharacterBadge } from '../../character/ui/components/CharacterBadge';
import { AccountSummary } from './components/AccountSummary';
import { ChangePasswordForm } from './components/ChangePasswordForm';
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

  return (
    <AsyncState
      loading={loading}
      error={error}
      data={profile}
      loadingLabel="CARGANDO PERFIL"
    >
      {(profile) => (
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-bold text-zinc-100">Mi perfil</h2>

          <div className="flex flex-col gap-6">
            {characterState && <CharacterBadge state={characterState} />}
            {!characterState && characterLoading && (
              <div className="border-2 border-green-500/30 bg-[#0d0d14] p-3 text-center font-['Press_Start_2P'] text-[9px] tracking-widest text-green-500/60">
                CARGANDO PERSONAJE…
              </div>
            )}
            {!characterState && !characterLoading && characterError && (
              <div className="border-2 border-red-500/40 bg-[#0d0d14] p-3 text-center font-['VT323'] text-base text-red-300">
                {characterError}
              </div>
            )}

            <AccountSummary
              createdAt={profile.created_at}
              totalSessions={profile.total_sessions}
              bestStreak={profile.best_streak}
              streak={profile.streak}
            />

            <ProfileForm
              profile={profile}
              onSubmit={updateProfile}
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
          </div>
        </div>
      )}
    </AsyncState>
  );
};
