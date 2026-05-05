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

type ProfileTab = 'datos' | 'editar' | 'seguridad';

const TABS: { id: ProfileTab; label: string }[] = [
  { id: 'datos', label: 'DATOS' },
  { id: 'editar', label: 'EDITAR' },
  { id: 'seguridad', label: 'SEGURIDAD' },
];

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

  const [tab, setTab] = useState<ProfileTab>('datos');

  return (
    <AsyncState
      loading={loading}
      error={error}
      data={profile}
      loadingLabel="CARGANDO PERFIL"
    >
      {(profile) => (
        <div className="mx-auto max-w-6xl">
          <header className="mb-6">
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
                streak={profile.streak}
              />
            </aside>

            {/* Right: data + edit + security as tabs. Replaces the previous
                "EDITAR button toggles a form" pattern with a discoverable
                tab strip the user can scan at a glance. */}
            <div className="flex flex-col gap-5 lg:col-span-2">
              <nav
                role="tablist"
                aria-label="Secciones del perfil"
                className="flex flex-wrap gap-2"
              >
                {TABS.map((t) => {
                  const active = tab === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setTab(t.id)}
                      className={`font-pixel text-[10px] tracking-widest border-2 px-4 py-2.5 transition-colors ${
                        active
                          ? 'border-green-500 bg-green-500/10 text-green-400 shadow-[0_0_14px_rgba(34,197,94,0.3)]'
                          : 'border-border bg-card text-ink-muted hover:border-green-500/40 hover:text-green-400'
                      }`}
                    >
                      {active ? '▶ ' : ''}
                      {t.label}
                    </button>
                  );
                })}
              </nav>

              {tab === 'datos' && (
                <ProfileDataView
                  profile={profile}
                  onEdit={() => setTab('editar')}
                />
              )}

              {tab === 'editar' && (
                <ProfileForm
                  profile={profile}
                  onSubmit={async (data) => {
                    await updateProfile(data);
                  }}
                  onCancel={() => setTab('datos')}
                  updating={updating}
                  error={updateError}
                  success={updateSuccess}
                />
              )}

              {tab === 'seguridad' && (
                <ChangePasswordForm
                  onSubmit={changePassword}
                  loading={changingPassword}
                  error={passwordError}
                  success={passwordSuccess}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </AsyncState>
  );
};
