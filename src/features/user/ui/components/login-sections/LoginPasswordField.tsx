import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface LoginPasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const LoginPasswordField = ({
  value,
  onChange,
}: LoginPasswordFieldProps): React.JSX.Element => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <label className="block mb-10">
      <span className="block font-['Press_Start_2P'] text-[9px] sm:text-[10px] text-[#a1a1aa] mb-2 tracking-wider">
        PASSWORD
      </span>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="current-password"
          className="w-full bg-[#12121a] border-2 border-[#1e1e2e] focus:border-green-500/70 focus:outline-none pl-3 pr-11 py-2.5 font-['Press_Start_2P'] text-[9px] sm:text-[10px] text-[#e4e4e7] placeholder:text-[#52525b] transition-colors"
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={
            showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
          }
          className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-[#71717a] hover:text-green-400 transition-colors"
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
