import { EmptyState } from '@shared/components/EmptyState';
import { PixelCorners } from '@shared/components/PixelCorners';
import type React from 'react';

import { useSessionHistory } from '../hooks/useSessionHistory';
import { SessionHistoryCard } from './SessionHistoryCard';

export const SessionHistoryContent = (): React.JSX.Element => {
  const { sessions, loading, error, refetch } = useSessionHistory();

  if (loading) {
    return (
      <section className="relative border-2 border-border bg-card p-5">
        <PixelCorners size="sm" className="border-green-500/30" />
        <p className="font-pixel text-[10px] tracking-widest text-ink-muted">
          CARGANDO HISTORIAL...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative border-2 border-red-500/40 bg-card p-5">
        <PixelCorners size="sm" className="border-red-500/40" />
        <p className="font-pixel-mono text-base leading-snug text-red-300">
          {error}
        </p>
        <button
          type="button"
          onClick={refetch}
          className="mt-4 font-pixel text-[9px] tracking-widest bg-red-500 hover:bg-red-400 text-[#0a0a0f] px-4 py-2.5 border-b-4 border-red-700 hover:border-red-600 active:border-b-0 active:mt-[1.0625rem] transition-all"
        >
          ▶ REINTENTAR
        </button>
      </section>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <EmptyState
        icon="📜"
        title="Sin sesiones"
        description="Aun no tienes entrenamientos registrados."
        cta={{
          label: 'Ir a rutinas',
          to: '/routines',
        }}
      />
    );
  }

  return (
    <section className="relative border-2 border-green-500/40 bg-card p-4 sm:p-5">
      <PixelCorners size="md" className="border-green-500/40" />
      <p className="mb-4 font-pixel text-[10px] tracking-widest text-green-500">
        ◆ {sessions.length}{' '}
        {sessions.length === 1 ? 'SESION REGISTRADA' : 'SESIONES REGISTRADAS'}
      </p>
      <ul className="flex flex-col gap-3">
        {sessions.map((session) => (
          <li key={session.id}>
            <SessionHistoryCard session={session} />
          </li>
        ))}
      </ul>
    </section>
  );
};
