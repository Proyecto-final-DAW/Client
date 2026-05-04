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

const formatDateLabel = (iso: string): string => {
  const [, month, day] = iso.split('-');
  return `${day}/${month}`;
};

export const ExerciseProgressChart = (props: Props): React.JSX.Element => {
  if (props.points.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900">
        <p className="text-sm text-zinc-500">
          No hay datos de progresion todavia.
        </p>
      </div>
    );
  }

  const data = props.points.map((point) => ({
    label: formatDateLabel(point.date),
    maxWeight: point.maxWeight,
    reps: point.reps,
  }));

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={data}
          margin={{ top: 12, right: 16, bottom: 8, left: -12 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey="label"
            stroke="#a1a1aa"
            tick={{ fontSize: 12 }}
            tickMargin={8}
          />
          <YAxis
            stroke="#a1a1aa"
            tick={{ fontSize: 12 }}
            tickMargin={4}
            unit=" kg"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#18181b',
              border: '1px solid #3f3f46',
              borderRadius: '8px',
              color: '#e4e4e7',
            }}
            labelStyle={{ color: '#a1a1aa' }}
            formatter={(value, name) => {
              if (name === 'maxWeight') return [`${value} kg`, 'Peso maximo'];
              if (name === 'reps') return [String(value), 'Reps'];
              return [String(value), String(name)];
            }}
          />
          <Line
            type="monotone"
            dataKey="maxWeight"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#10b981' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
