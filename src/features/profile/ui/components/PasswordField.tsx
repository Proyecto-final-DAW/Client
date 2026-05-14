import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: 'current-password' | 'new-password';
  className?: string;
}

// Mirrors the auth PasswordField's eye toggle so the profile form
// matches the rest of the auth flow. Without it, users typed three
// passwords blind here while the login form let them see what they
// typed — surprising and an accessibility regression.
const inputClass =
  'w-full bg-subtle border-2 border-border pl-3 pr-12 py-3 font-pixel-mono text-base text-ink placeholder:text-ink-disabled focus:border-green-500/70 focus:outline-none transition-colors';
const labelClass =
  'block font-pixel text-[8px] tracking-widest text-ink-muted mb-2';

export const PasswordField = (props: PasswordFieldProps): React.JSX.Element => {
  const [show, setShow] = useState(false);

  return (
    <div className={props.className ?? 'mb-4'}>
      <label htmlFor={props.id} className={labelClass}>
        {props.label}
      </label>
      <div className="relative">
        <input
          id={props.id}
          type={show ? 'text' : 'password'}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          autoComplete={props.autoComplete}
          className={inputClass}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          className="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-ink-faint hover:text-green-400 transition-colors"
        >
          {show ? (
            <EyeSlashIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
};
