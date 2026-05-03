import type React from 'react';

import type { Session } from '../../core/domain/models/Session';

type SessionHistoryCardProps = {
  session: Session;
};

export const SessionHistoryCard = ({
  session,
}: SessionHistoryCardProps): React.JSX.Element => {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-100">
            Sesion {session.id}
          </p>
          <p className="mt-1 text-sm text-gray-400">
            {session.date.toLocaleDateString('es-ES')}
          </p>
        </div>

        <div className="rounded-xl bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
          {session.routineId ? 'Rutina' : 'Sin rutina'}
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-1 text-sm font-medium text-gray-300">Notas</p>
        <p className="text-sm text-gray-400">
          {session.notes?.trim() ? session.notes : 'Sin notas'}
        </p>
      </div>

      <div className="mt-4 border-t border-gray-800 pt-3">
        <p className="text-xs text-gray-500">
          Creada el {session.createdAt.toLocaleDateString('es-ES')}
        </p>
      </div>
    </div>
  );
};
