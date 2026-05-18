import { PixelCorners } from '@shared/components/PixelCorners';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { ExerciseProgressPoint } from '../../core/domain/models/ExerciseProgressPoint';

type Props = {
  points: ExerciseProgressPoint[];
};

// Compact axis label vs. full tooltip label — same trick used in
// WeightProgressChart so dates read as "7 may" / "7 may 2026" instead
// of the original "07/05" which was both small and ambiguous.
const SHORT_DATE = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'short',
});
const FULL_DATE = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const parseISO = (iso: string): Date => {
  // ISO YYYY-MM-DD → local Date at midnight (no timezone shifting that
  // would push "7 may" to "6 may" for users west of UTC).
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
};

interface ChartPoint {
  label: string;
  fullDate: string;
  maxWeight: number;
  reps: number;
}

/** Matches the recharts Line default animation duration so each dot
 *  fades in synced with the line tip passing through its x position
 *  (delay scaled by index / total). */
const LINE_ANIM_MS = 1500;
/** Per-dot fade-in duration — short so dots land cleanly under the
 *  drawing line rather than slowly materialising. */
const DOT_FADE_MS = 220;

/**
 * RPG-styled max-weight progression chart. Pixel borders, green palette
 * matching the rest of the app, custom tooltip in font-pixel-mono.
 */
export const ExerciseProgressChart = (props: Props): React.JSX.Element => {
  if (props.points.length === 0) {
    return (
      <div className="relative flex h-56 items-center justify-center border-2 border-border bg-page">
        <PixelCorners size="sm" className="border-green-500/30" />
        <p className="font-pixel-mono text-base text-ink-faint">
          No hay datos de progresion todavia.
        </p>
      </div>
    );
  }

  const data: ChartPoint[] = props.points.map((point) => {
    const d = parseISO(point.date);
    return {
      label: SHORT_DATE.format(d),
      fullDate: FULL_DATE.format(d),
      maxWeight: point.maxWeight,
      reps: point.reps,
    };
  });

  // Tight Y-axis around the actual lifted weights — same fix as
  // WeightProgressChart. Default 0-baseline left a barbell-curl chart
  // (20-30 kg range) showing 0-30 kg with the line crammed into the
  // top third. Pad ±5 kg so a 50 kg PR doesn't sit on the chart edge.
  const weights = data.map((p) => p.maxWeight);
  const minW = Math.max(0, Math.floor(Math.min(...weights) - 5));
  const maxW = Math.ceil(Math.max(...weights) + 5);

  return (
    // Same tight gutter as WeightProgressChart. The `width={44}` Y-axis
    // matches: "100 kg" at fontSize 16 ≈ 36px, fits with margin to spare.
    <div className="relative border-2 border-green-500/40 bg-page p-2 sm:p-3">
      <PixelCorners size="sm" className="border-green-500/40" />
      <ResponsiveContainer width="100%" height={260}>
        <LineChart
          data={data}
          margin={{ top: 12, right: 16, bottom: 8, left: 0 }}
        >
          {/* Horizontal-only, very faint guide lines — kept in sync
              with WeightProgressChart so the two progress charts read
              as one visual family. */}
          <CartesianGrid
            strokeDasharray="2 4"
            stroke="#16161f"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            stroke="#71717a"
            tick={{ fontSize: 16, fontFamily: 'VT323, monospace' }}
            tickMargin={8}
            interval="preserveStartEnd"
            minTickGap={24}
            padding={{ left: 8, right: 8 }}
          />
          <YAxis
            stroke="#71717a"
            tick={{ fontSize: 16, fontFamily: 'VT323, monospace' }}
            tickMargin={2}
            width={44}
            domain={[minW, maxW]}
            allowDecimals={false}
            unit=" kg"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0d0d14',
              border: '2px solid rgba(34,197,94,0.6)',
              borderRadius: 0,
              color: '#e4e4e7',
              fontFamily: 'VT323, monospace',
              fontSize: 16,
              boxShadow: '0 0 14px rgba(34,197,94,0.35)',
            }}
            labelStyle={{
              color: '#22c55e',
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 10,
              letterSpacing: '0.1em',
              marginBottom: 6,
            }}
            cursor={{ stroke: 'rgba(34,197,94,0.3)', strokeWidth: 1 }}
            labelFormatter={(_label, payload) => {
              const point = payload?.[0]?.payload as ChartPoint | undefined;
              return point?.fullDate ?? String(_label);
            }}
            formatter={(value, name) => {
              if (name === 'maxWeight') return [`${value} kg`, 'Peso maximo'];
              if (name === 'reps') return [String(value), 'Reps'];
              return [String(value), String(name)];
            }}
          />
          {/* Mirror of WeightProgressChart — line uses recharts'
              default left-to-right draw; custom dot renderer staggers
              each PR marker's fade so the rightmost dot lands in sync
              with the line tip. */}
          <Line
            type="monotone"
            dataKey="maxWeight"
            stroke="#22c55e"
            strokeWidth={2.5}
            animationDuration={LINE_ANIM_MS}
            dot={(dotProps: {
              cx?: number;
              cy?: number;
              index?: number;
              // See WeightProgressChart for context: recharts'
              // DotItemDotProps types `key` as `Key | null`; the
              // composite `tsc -b` step CI runs rejects narrowing it
              // to `Key`.
              key?: React.Key | null;
            }) => {
              const { cx, cy, index = 0, key } = dotProps;
              const total = data.length;
              const delay =
                total > 1 ? (index / (total - 1)) * LINE_ANIM_MS : 0;
              return (
                <circle
                  key={key ?? `dot-${index}`}
                  cx={cx}
                  cy={cy}
                  r={4}
                  fill="#22c55e"
                  stroke="#0a0a0f"
                  strokeWidth={2}
                  style={{
                    opacity: 0,
                    transformBox: 'fill-box',
                    transformOrigin: 'center',
                    animation: `chartDotFadeIn ${DOT_FADE_MS}ms ease-out ${delay}ms forwards`,
                  }}
                />
              );
            }}
            activeDot={{
              r: 6,
              fill: '#4ade80',
              stroke: '#0a0a0f',
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
