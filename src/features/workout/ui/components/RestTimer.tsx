type Props = {
  remainingSeconds: number;
  totalSeconds: number;
  presets: readonly number[];
  selectedPreset: number;
  onSelectPreset: (seconds: number) => void;
  onSkip: () => void;
};

const CIRCLE_RADIUS = 64;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

const formatSeconds = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
};

export const RestTimer = (props: Props): React.JSX.Element => {
  const {
    remainingSeconds,
    totalSeconds,
    presets,
    selectedPreset,
    onSelectPreset,
    onSkip,
  } = props;

  const progress =
    totalSeconds > 0 ? Math.min(1, remainingSeconds / totalSeconds) : 0;
  // Negative dashoffset traces the gap in the opposite direction
  // along the path. Combined with the SVG's `-rotate-90`, this lands
  // on the analog-clock reading: full ring at start, then the empty
  // arc grows clockwise from 12 → 3 → 6 → 9 as time elapses. With a
  // positive offset the gap walked CCW (12 → 9 → 6 → 3), which is
  // what the user flagged as "al reves".
  const dashOffset = -CIRCLE_CIRCUMFERENCE * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-5 border-2 border-green-500/40 bg-card p-6">
      <p className="font-pixel text-[9px] tracking-widest text-ink-muted">
        DESCANSO
      </p>

      <div className="relative h-32 w-32 sm:h-40 sm:w-40">
        {/* `-rotate-90` puts the SVG circle's natural start (3 o'clock)
            at the top (12 o'clock). With dashOffset growing as time
            passes, the empty arc anchors at 12 and sweeps clockwise
            through 3 → 6 → 9 — the analog-clock reading the user
            expects ("empezar arriba, ir a la derecha en sentido
            horario"). The last segment to disappear is the top-left,
            so the green stays visually anchored to the start until
            the very end. */}
        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 144 144"
          aria-hidden="true"
        >
          <circle
            cx="72"
            cy="72"
            r={CIRCLE_RADIUS}
            fill="none"
            stroke="#1e1e2e"
            strokeWidth="8"
          />
          <circle
            cx="72"
            cy="72"
            r={CIRCLE_RADIUS}
            fill="none"
            stroke="#22c55e"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCLE_CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        {/* Removed `aria-live="polite"` from the second-by-second
            counter — screen readers were announcing every tick
            ("00:30", "00:29", "00:28"…) which drowned out everything
            else. The timer is decorative for sighted users; the
            countdown completion / start signals fire elsewhere via
            sound + the Set logger button focus. */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            aria-hidden="true"
            className="font-pixel text-xl sm:text-2xl text-green-400 [text-shadow:0_0_12px_rgba(34,197,94,0.6)]"
          >
            {formatSeconds(remainingSeconds)}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {presets.map((seconds) => {
          const isSelected = seconds === selectedPreset;
          return (
            <button
              key={seconds}
              type="button"
              onClick={() => onSelectPreset(seconds)}
              aria-pressed={isSelected}
              className={`font-pixel text-[9px] tracking-widest px-3 py-2.5 border-2 transition-colors ${
                isSelected
                  ? 'border-green-500 bg-green-500/10 text-green-400'
                  : 'border-border bg-[#18181b] text-ink-muted hover:border-green-500/40 hover:text-green-400'
              }`}
            >
              {seconds}s
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onSkip}
        className="font-pixel text-[9px] tracking-widest border-2 border-border bg-card text-ink-muted px-5 py-3 hover:border-green-500/40 hover:text-green-400 transition-colors"
      >
        ▶ SALTAR DESCANSO
      </button>
    </div>
  );
};
