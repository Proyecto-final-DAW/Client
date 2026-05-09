interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: 'current-password' | 'new-password';
  className?: string;
}

// font-pixel-mono text-base mirrors the shared auth PasswordField:
// Press Start 2P at 10px is hard to read while typing and any input
// below 16px makes iOS Safari auto-zoom on focus.
const inputClass =
  'w-full bg-subtle border-2 border-border px-3 py-3 font-pixel-mono text-base text-ink placeholder:text-ink-disabled focus:border-green-500/70 focus:outline-none transition-colors';
const labelClass =
  'block font-pixel text-[8px] tracking-widest text-ink-muted mb-2';

export const PasswordField = (props: PasswordFieldProps): React.JSX.Element => (
  <div className={props.className ?? 'mb-4'}>
    <label htmlFor={props.id} className={labelClass}>
      {props.label}
    </label>
    <input
      id={props.id}
      type="password"
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
      required
      autoComplete={props.autoComplete}
      className={inputClass}
    />
  </div>
);
