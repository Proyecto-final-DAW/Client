import type React from 'react';
import {
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

export const WeightProgressChart = ({
  entries,
}: WeightProgressChartProps): React.JSX.Element => {
  const chartData = entries.map((entry) => ({
    date: entry.date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
    }),
    weight: entry.weight,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis dataKey="date" stroke="#9ca3af" />

          <YAxis stroke="#9ca3af" tickFormatter={(value) => `${value} kg`} />

          <Tooltip
            contentStyle={{
              backgroundColor: '#111827',
              border: '1px solid #374151',
              borderRadius: '12px',
              color: '#f9fafb',
            }}
            formatter={(value) => [`${value} kg`, 'Peso']}
          />

          <Line
            type="monotone"
            dataKey="weight"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
