import { useState } from 'react';

import type { ChangePasswordData } from '../../core/domain/models/ProfileData';

interface ChangePasswordFormProps {
  onSubmit: (data: ChangePasswordData) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const ChangePasswordForm = ({
  onSubmit,
  loading,
  error,
  success,
}: ChangePasswordFormProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (newPassword.length < 6) {
      setLocalError('La nueva contrasena debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setLocalError('Las contrasenas no coinciden');
      return;
    }

    await onSubmit({ currentPassword, newPassword });
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-emerald-500';
  const labelClass = 'block text-sm font-medium text-zinc-300 mb-2';

  const displayError = localError || error;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-zinc-800 bg-zinc-900 p-6"
    >
      <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-zinc-400">
        Cambiar contrasena
      </h3>

      <div className="mb-4">
        <label htmlFor="current-password" className={labelClass}>
          Contrasena actual
        </label>
        <input
          id="current-password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="new-password" className={labelClass}>
          Nueva contrasena
        </label>
        <input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          autoComplete="new-password"
          className={inputClass}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="confirm-password" className={labelClass}>
          Confirmar contrasena
        </label>
        <input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
          className={inputClass}
        />
      </div>

      {displayError && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3">
          <p className="text-sm text-red-400">{displayError}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
          <p className="text-sm text-emerald-400">
            Contrasena actualizada. Redirigiendo al login...
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
      >
        {loading ? 'Cambiando...' : 'Cambiar contrasena'}
      </button>
    </form>
  );
};
