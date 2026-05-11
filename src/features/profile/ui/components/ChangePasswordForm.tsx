import { PixelCorners } from '@shared/components/PixelCorners';
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
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!currentPassword) {
      setLocalError('Introduce tu contrasena actual.');
      return;
    }

    // Server enforces ≥ 8 characters and emits PASSWORD_TOO_SHORT.
    // Mirror the floor here to give an instant signal — both copies stay
    // identical so the user never sees them clash.
    if (newPassword.length < 8) {
      setLocalError('La nueva contrasena debe tener al menos 8 caracteres.');
      return;
    }

    if (newPassword === currentPassword) {
      setLocalError('La nueva contrasena debe ser distinta a la actual.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setLocalError('Las contrasenas no coinciden.');
      return;
    }

    await props.onSubmit({ currentPassword, newPassword });
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative w-full border-2 border-border bg-card p-4 text-left hover:border-green-500/50 transition-colors group"
      >
        <PixelCorners size="sm" className="border-border-muted" />
        <p className="font-pixel text-[10px] tracking-widest text-ink-muted group-hover:text-green-400">
          ◆ CAMBIAR CONTRASENA
        </p>
        <p className="mt-2 font-pixel-mono text-lg text-ink-faint leading-snug">
          Tendras que volver a iniciar sesion despues.
        </p>
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative border-2 border-green-500/40 bg-card p-5"
    >
      <PixelCorners size="md" className="border-green-500/40" />

      <header className="mb-4 flex items-center justify-between">
        <p className="font-pixel text-[10px] tracking-widest text-green-500">
          ◆ CAMBIAR CONTRASENA
        </p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="font-pixel text-[9px] tracking-widest border-2 border-border-muted bg-card text-ink-muted hover:border-[#3f3f46] px-3 py-2 transition-colors"
        >
          CERRAR
        </button>
      </header>

      <PasswordField
        id="current-password"
        label="CONTRASENA ACTUAL"
        value={currentPassword}
        onChange={setCurrentPassword}
        autoComplete="current-password"
      />
      <PasswordField
        id="new-password"
        label="NUEVA CONTRASENA"
        value={newPassword}
        onChange={setNewPassword}
        autoComplete="new-password"
      />
      <PasswordField
        id="confirm-password"
        label="CONFIRMAR CONTRASENA"
        value={confirmPassword}
        onChange={setConfirmPassword}
        autoComplete="new-password"
        className="mb-5"
      />

      <FormFeedback
        error={localError || props.error}
        success={
          props.success
            ? 'Contrasena actualizada. Redirigiendo al login…'
            : null
        }
      />

      <button
        type="submit"
        disabled={props.loading}
        className="w-full font-pixel text-[10px] tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-6 py-3 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(34,197,94,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:mt-0"
      >
        {props.loading ? 'CAMBIANDO…' : '▶ CAMBIAR CONTRASENA'}
      </button>
    </form>
  );
};
