import { PixelCorners } from '@shared/components/PixelCorners';
import type React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { Progress } from '../../core/domain/models/Progress';

type WeightProgressChartProps = {
  entries: Progress[];
};

/**
 * RPG-styled body weight progression chart. Mirrors the visual language
 * of `ExerciseProgressChart`: pixel border, green palette, VT323 ticks,
 * pixel-bordered tooltip without rounded corners.
 */
// Two date formats per data point: a compact one for the X axis label
// ("7 may") and a full one for the tooltip header ("7 may 2026"). The
// previous "07/05" was hard to read and ambiguous (07/05 = 7 May or 5
// July depending on locale assumptions).
const SHORT_DATE = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'short',
});
const FULL_DATE = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

interface ChartPoint {
  label: string;
  fullDate: string;
  weight: number;
}

export const WeightProgressChart = ({
  entries,
}: WeightProgressChartProps): React.JSX.Element => {
  const chartData: ChartPoint[] = entries.map((entry) => ({
    label: SHORT_DATE.format(entry.date),
    fullDate: FULL_DATE.format(entry.date),
    weight: entry.weight,
  }));

  // Tight Y-axis domain around the actual data range. Recharts'
  // default includes 0 as baseline, which left ~60% of the chart area
  // empty for a typical 65-75 kg user — the line ended up squashed
  // against the top edge with vast 0-60 kg whitespace below.
  // Pad ±2 kg so the line never kisses the chart border. Floor at 0
  // so a pathological negative entry doesn't render below-axis.
  const weights = chartData.map((p) => p.weight);
  const minW = Math.max(0, Math.floor(Math.min(...weights) - 2));
  const maxW = Math.ceil(Math.max(...weights) + 2);
  // Single-point case: ±2 kg can degenerate to a 4-kg span which still
  // reads fine; nothing extra needed.

  return (
    // Tight container padding so the plot area doesn't sit in a wide
    // bezel — `p-2 sm:p-3` leaves the chart breathing room without
    // the previous `p-4` gutter that pushed the line ~16px in from
    // every side. The Y-axis label gutter and chart margin below were
    // also trimmed: 56→44 width and 6→2 tickMargin reclaim ~16px on
    // the left where "70 kg" labels never needed that much.
    <div className="relative border-2 border-green-500/40 bg-page p-2 sm:p-3">
      <PixelCorners size="sm" className="border-green-500/40" />
      <ResponsiveContainer width="100%" height={260}>
        <LineChart
          data={chartData}
          margin={{ top: 12, right: 16, bottom: 8, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
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
            tickFormatter={(value) => `${value} kg`}
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
            // Show the full "7 may 2026" instead of just "7 may" when
            // hovering — gives the year that the axis omits for space.
            labelFormatter={(_label, payload) => {
              const point = payload?.[0]?.payload as ChartPoint | undefined;
              return point?.fullDate ?? String(_label);
            }}
            formatter={(value) => [`${value} kg`, 'Peso']}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#22c55e"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#22c55e', stroke: '#0a0a0f', strokeWidth: 2 }}
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
