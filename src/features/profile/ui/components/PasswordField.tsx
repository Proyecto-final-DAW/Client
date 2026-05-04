interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: 'current-password' | 'new-password';
  className?: string;
}

const inputClass =
  "w-full bg-[#12121a] border-2 border-[#1e1e2e] px-3 py-2.5 font-['Press_Start_2P'] text-[10px] text-[#e4e4e7] placeholder:text-[#52525b] focus:border-green-500/70 focus:outline-none transition-colors";
const labelClass =
  "block font-['Press_Start_2P'] text-[8px] tracking-widest text-[#a1a1aa] mb-2";

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
