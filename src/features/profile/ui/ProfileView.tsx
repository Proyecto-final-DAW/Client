import { LoadingPixel } from '../../../shared/components/LoadingPixel';
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

  if (loading) {
    return <LoadingPixel />;
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p
          role="alert"
          className="font-['VT323'] text-xl text-red-400 border-2 border-red-500/40 bg-red-500/10 px-4 py-3"
        >
          ✕ {error || 'No se pudo cargar el perfil'}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-6 text-2xl font-bold text-zinc-100">Mi perfil</h2>

      <div className="flex flex-col gap-6">
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
  );
};
