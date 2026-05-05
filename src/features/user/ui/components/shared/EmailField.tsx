interface EmailFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const EmailField = (props: EmailFieldProps): React.JSX.Element => {
  return (
    <label className="block mb-10">
      <span className="block font-pixel text-[9px] sm:text-[10px] text-ink-muted mb-2 tracking-wider">
        EMAIL
      </span>
      <input
        type="email"
        placeholder="hero@gymquest.gg"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        autoComplete="email"
        className="w-full bg-subtle border-2 border-border focus:border-green-500/70 focus:outline-none px-3 py-2.5 font-pixel text-[9px] sm:text-[10px] text-ink placeholder:text-ink-disabled transition-colors"
      />
    </label>
  );
};
