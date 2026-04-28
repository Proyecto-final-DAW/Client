import type React from 'react';

import { EmptyState } from '../../../../shared/components/EmptyState';
import { useSessionHistory } from '../hooks/useSessionHistory';
import { SessionHistoryCard } from './SessionHistoryCard';

export const SessionHistoryContent = (): React.JSX.Element => {
  const { sessions, loading, error, refetch } = useSessionHistory();

  if (loading) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-gray-700 bg-gray-950/40 p-4">
        <p className="text-sm text-gray-300">
          Cargando historial de sesiones...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 rounded-2xl border border-red-900/50 bg-gray-950/40 p-4">
        <p className="text-sm font-medium text-red-400">{error}</p>

        <button
          type="button"
          onClick={refetch}
          className="mt-4 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-gray-950 transition hover:bg-blue-400"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <div className="mt-6">
        <EmptyState
          title="Sin sesiones"
          description="Aún no tienes entrenamientos registrados."
          cta={{
            label: 'Registra tu primer entreno',
            to: '/sessions/new',
          }}
        />
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-950/40 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-300">
            Historial de sesiones
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Consulta tus entrenamientos anteriores
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {sessions.map((session) => (
          <SessionHistoryCard key={session.id} session={session} />
        ))}
      </div>
    </div>
  );
};
