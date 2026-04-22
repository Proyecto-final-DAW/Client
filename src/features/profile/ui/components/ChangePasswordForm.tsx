import { useState } from 'react';

import type { ChangePasswordData } from '../../core/domain/models/ProfileData';
import { FormFeedback } from './FormFeedback';
import { PasswordField } from './PasswordField';

interface ChangePasswordFormProps {
  onSubmit: (data: ChangePasswordData) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const ChangePasswordForm = (
  props: ChangePasswordFormProps
): React.JSX.Element => {
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

    await props.onSubmit({ currentPassword, newPassword });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-zinc-800 bg-zinc-900 p-6"
    >
      <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-zinc-400">
        Cambiar contrasena
      </h3>

      <PasswordField
        id="current-password"
        label="Contrasena actual"
        value={currentPassword}
        onChange={setCurrentPassword}
        autoComplete="current-password"
      />
      <PasswordField
        id="new-password"
        label="Nueva contrasena"
        value={newPassword}
        onChange={setNewPassword}
        autoComplete="new-password"
      />
      <PasswordField
        id="confirm-password"
        label="Confirmar contrasena"
        value={confirmPassword}
        onChange={setConfirmPassword}
        autoComplete="new-password"
        className="mb-6"
      />

      <FormFeedback
        error={localError || props.error}
        success={
          props.success
            ? 'Contrasena actualizada. Redirigiendo al login...'
            : null
        }
      />

      <button
        type="submit"
        disabled={props.loading}
        className="w-full rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
      >
        {props.loading ? 'Cambiando...' : 'Cambiar contrasena'}
      </button>
    </form>
  );
};
