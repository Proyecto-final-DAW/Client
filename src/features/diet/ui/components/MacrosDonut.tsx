interface MacroSlice {
  label: string;
  percentage: number;
  color: string;
}

interface MacrosDonutProps {
  /** Slices in the order they should appear around the donut. The
   *  caller controls labels/colors so this stays a dumb visual. */
  slices: MacroSlice[];
  /** Big number rendered in the centre — kcal/day. */
  centerValue: string;
  centerLabel: string;
}

/**
 * Pure-SVG donut chart for macro distribution. Rendering with
 * `<circle stroke-dasharray>` (one circle per slice, rotated and
 * offset) keeps the bundle free of a chart dep and matches the pixel
 * aesthetic better than a Recharts donut would.
 */
export const MacrosDonut = ({
  slices,
  centerValue,
  centerLabel,
}: MacrosDonutProps): React.JSX.Element => {
  const radius = 42;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

  // Walk the slices accumulating offsets so each arc starts where the
  // previous one ended. Total can drift slightly from 100% due to
  // rounding upstream — the donut just renders what it gets.
  let cumulative = 0;

  return (
    // Square sized via Tailwind so the SVG scales with the viewport
    // (192px on phone, 224px on tablet, 256px on desktop). The
    // previous hard-coded `width="240"` consumed ~70% of a 375px
    // viewport — leaving the centred kcal text feeling cramped on
    // mobile and the legend column squashed beside it.
    <div className="relative inline-flex h-48 w-48 sm:h-56 sm:w-56 lg:h-64 lg:w-64 items-center justify-center">
      <svg
        viewBox="0 0 120 120"
        className="h-full w-full transform -rotate-90"
        role="img"
        aria-label="Distribucion de macros"
      >
        {/* Track — faint full circle behind the slices, visible if the
            slices don't sum to exactly 100 and as a backdrop for the
            stroke join transitions. */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="transparent"
          stroke="#1e1e2e"
          strokeWidth={strokeWidth}
        />

        {slices.map((slice) => {
          const fraction = Math.max(0, slice.percentage) / 100;
          const dash = circumference * fraction;
          const gap = circumference - dash;
          const offset = -circumference * cumulative;
          cumulative += fraction;
          return (
            <circle
              key={slice.label}
              cx="60"
              cy="60"
              r={radius}
              fill="transparent"
              stroke={slice.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={offset}
              style={{ filter: `drop-shadow(0 0 6px ${slice.color}66)` }}
            />
          );
        })}
      </svg>

      {/* Centre stack — kcal/day in big pixel font, label below. The
          parent inline-flex centres this absolutely-positioned div over
          the donut without needing manual translate maths. */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <p className="font-pixel text-2xl sm:text-3xl text-green-400 [text-shadow:0_0_18px_rgba(34,197,94,0.6)]">
          {centerValue}
        </p>
        <p className="mt-1 font-pixel text-[8px] sm:text-[9px] tracking-widest text-ink-faint">
          {centerLabel}
        </p>
      </div>
    </div>
  );
};
