interface EmailFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const EmailField = (props: EmailFieldProps): React.JSX.Element => {
  return (
    // mb-5 (was mb-10): the previous 40px gap between fields was a
    // wall of empty space at narrow viewports. Label still uses
    // Press Start 2P (brand cue), but input value is font-pixel-mono
    // at text-base — both for legibility and to stay above the 16px
    // floor below which iOS Safari auto-zooms the viewport on focus.
    <label className="block mb-5">
      <span className="block font-pixel text-[9px] sm:text-[10px] text-ink-muted mb-2 tracking-wider">
        EMAIL
      </span>
      <input
        type="email"
        placeholder="hero@gymquest.gg"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        autoComplete="email"
        className="w-full bg-subtle border-2 border-border focus:border-green-500/70 focus:outline-none px-3 py-3 font-pixel-mono text-base text-ink placeholder:text-ink-disabled transition-colors"
      />
    </label>
  );
};
