import type React from 'react';
import { useState } from 'react';

import type { Progress } from '../../core/domain/models/Progress';
import { useProgress } from '../hooks/useProgress';
import { ProgressForm } from './ProgressForm';
import { WeightProgressChart } from './WeightProgressChart';

export const WeightProgressContent = (): React.JSX.Element => {
  const { weightHistory, loading, error, refetch } = useProgress();

  const [showForm, setShowForm] = useState(false);
  const [localEntries, setLocalEntries] = useState<Progress[]>([]);

  const entries = [...(weightHistory ?? []), ...localEntries].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  const handleAddEntry = (entry: Progress) => {
    setLocalEntries((current) => [...current, entry]);
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-6">
        <p className="text-sm text-gray-400">Cargando progreso de peso...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6">
        <p className="text-sm text-red-400">{error}</p>
        <button
          type="button"
          onClick={refetch}
          className="mt-4 rounded-xl bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-gray-800 bg-gray-900/80 p-5">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-blue-400">Progreso</p>
          <h2 className="text-xl font-bold text-white">Evolución de peso</h2>
        </div>

        <button
          type="button"
          onClick={() => setShowForm((value) => !value)}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Registrar peso
        </button>
      </div>

      {showForm && (
        <ProgressForm
          onAddEntry={handleAddEntry}
          onCancel={() => setShowForm(false)}
        />
      )}

      {entries.length === 0 ? (
        <p className="text-sm text-gray-400">
          Todavía no tienes registros de peso.
        </p>
      ) : (
        <>
          <WeightProgressChart entries={entries} />

          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-800">
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
                    <td className="px-4 py-3 text-gray-100">
                      {entry.weight} kg
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
};
