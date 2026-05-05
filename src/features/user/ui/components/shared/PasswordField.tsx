import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  autoComplete?: 'current-password' | 'new-password';
}

export const PasswordField = (props: PasswordFieldProps): React.JSX.Element => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <label className="block mb-10">
      <span className="block font-pixel text-[9px] sm:text-[10px] text-ink-muted mb-2 tracking-wider">
        PASSWORD
      </span>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          autoComplete={props.autoComplete}
          className="w-full bg-subtle border-2 border-border focus:border-green-500/70 focus:outline-none pl-3 pr-11 py-2.5 font-pixel text-[9px] sm:text-[10px] text-ink placeholder:text-ink-disabled transition-colors"
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={
            showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
          }
          className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-ink-faint hover:text-green-400 transition-colors"
        >
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      </div>
    </label>
  );
};
