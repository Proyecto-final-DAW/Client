import type React from 'react';

import type { Progress } from '../../core/domain/models/Progress';

type WeightHistoryTableProps = {
  entries: Progress[];
};

export const WeightHistoryTable = ({
  entries,
}: WeightHistoryTableProps): React.JSX.Element => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-950 text-gray-400">
          <tr>
            <th className="px-4 py-3 font-medium">Fecha</th>
            <th className="px-4 py-3 font-medium">Peso</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-800">
          {entries.map((entry) => (
            <tr key={`${entry.date.toISOString()}-${entry.weight}`}>
              <td className="px-4 py-3 text-gray-300">
                {entry.date.toLocaleDateString('es-ES')}
              </td>
              <td className="px-4 py-3 text-gray-100">{entry.weight} kg</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
