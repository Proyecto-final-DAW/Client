interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: 'current-password' | 'new-password';
  className?: string;
}

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 outline-none transition-colors focus:border-emerald-500';
const labelClass = 'block text-sm font-medium text-zinc-300 mb-2';

export const PasswordField = ({
  id,
  label,
  value,
  onChange,
  autoComplete,
  className = 'mb-4',
}: PasswordFieldProps) => (
  <div className={className}>
    <label htmlFor={id} className={labelClass}>
      {label}
    </label>
    <input
      id={id}
      type="password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      autoComplete={autoComplete}
      className={inputClass}
    />
  </div>
);
