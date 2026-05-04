import { useState } from 'react';

import { PixelCorners } from '../../../../shared/components/PixelCorners';
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

    if (newPassword.length < 6) {
      setLocalError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setLocalError('Las contraseñas no coinciden');
      return;
    }

    await props.onSubmit({ currentPassword, newPassword });
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative w-full border-2 border-red-500/30 bg-[#0d0d14] p-4 text-left hover:border-red-500/60 transition-colors group"
      >
        <PixelCorners size="sm" className="border-red-500/30" />
        <p className="font-['Press_Start_2P'] text-[10px] tracking-widest text-red-400/80 group-hover:text-red-400">
          ⚠ CAMBIAR CONTRASEÑA
        </p>
        <p className="mt-2 font-['Press_Start_2P'] text-base text-[#71717a]">
          Cierra sesion en todos los dispositivos al cambiarla.
        </p>
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative border-2 border-red-500/40 bg-[#0d0d14] p-5"
    >
      <PixelCorners size="md" className="border-red-500/40" />

      <header className="mb-4 flex items-center justify-between">
        <p className="font-['Press_Start_2P'] text-[10px] tracking-widest text-red-400">
          ⚠ CAMBIAR CONTRASEÑA
        </p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="font-['Press_Start_2P'] text-[9px] tracking-widest border-2 border-[#27272a] bg-[#0d0d14] text-[#a1a1aa] hover:border-[#3f3f46] px-3 py-2 transition-colors"
        >
          CERRAR
        </button>
      </header>

      <PasswordField
        id="current-password"
        label="CONTRASEÑA ACTUAL"
        value={currentPassword}
        onChange={setCurrentPassword}
        autoComplete="current-password"
      />
      <PasswordField
        id="new-password"
        label="NUEVA CONTRASEÑA"
        value={newPassword}
        onChange={setNewPassword}
        autoComplete="new-password"
      />
      <PasswordField
        id="confirm-password"
        label="CONFIRMAR CONTRASEÑA"
        value={confirmPassword}
        onChange={setConfirmPassword}
        autoComplete="new-password"
        className="mb-5"
      />

      <FormFeedback
        error={localError || props.error}
        success={
          props.success
            ? 'Contraseña actualizada. Redirigiendo al login…'
            : null
        }
      />

      <button
        type="submit"
        disabled={props.loading}
        className="w-full font-['Press_Start_2P'] text-[10px] tracking-widest bg-red-500 hover:bg-red-400 text-[#0a0a0f] px-6 py-3 border-b-4 border-red-700 hover:border-red-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(239,68,68,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:mt-0"
      >
        {props.loading ? 'CAMBIANDO…' : '▶ CAMBIAR CONTRASEÑA'}
      </button>
    </form>
  );
};
