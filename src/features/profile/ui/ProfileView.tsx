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
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-6">
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6">
          <p className="text-red-400">
            {error || 'No se pudo cargar el perfil'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-6">
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
    </div>
  );
};
