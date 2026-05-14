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
  const dashOffset = CIRCLE_CIRCUMFERENCE * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-5 border-2 border-green-500/40 bg-[#0d0d14] p-6">
      <p className="font-['Press_Start_2P'] text-[9px] tracking-widest text-[#a1a1aa]">
        DESCANSO
      </p>

      <div className="relative w-40 h-40">
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
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            aria-live="polite"
            className="font-['Press_Start_2P'] text-xl text-green-400 [text-shadow:0_0_12px_rgba(34,197,94,0.6)]"
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
              className={`font-['Press_Start_2P'] text-[9px] tracking-widest px-3 py-2.5 border-2 transition-colors ${
                isSelected
                  ? 'border-green-500 bg-green-500/10 text-green-400'
                  : 'border-[#1e1e2e] bg-[#18181b] text-[#a1a1aa] hover:border-green-500/40 hover:text-green-400'
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
        className="font-['Press_Start_2P'] text-[9px] tracking-widest border-2 border-[#1e1e2e] bg-[#0d0d14] text-[#a1a1aa] px-5 py-3 hover:border-green-500/40 hover:text-green-400 transition-colors"
      >
        ▶ SALTAR DESCANSO
      </button>
    </div>
  );
};
