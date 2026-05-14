import type React from 'react';

import type { Session } from '../../core/domain/models/Session';

type SessionHistoryCardProps = {
  session: Session;
};

const DATE_FORMAT = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

export const SessionHistoryCard = ({
  session,
}: SessionHistoryCardProps): React.JSX.Element => {
  const hasNotes = Boolean(session.notes?.trim());
  return (
    <article className="border-2 border-border bg-page p-3 sm:p-4">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="min-w-0">
          <p className="font-pixel text-[8px] tracking-widest text-ink-faint">
            #{session.id}
          </p>
          <p className="mt-1 font-pixel text-[11px] sm:text-xs tracking-widest text-green-400">
            {DATE_FORMAT.format(session.date)}
          </p>
        </div>
        <span
          className={`shrink-0 font-pixel text-[8px] tracking-widest border-2 px-2 py-1 ${
            session.routineId
              ? 'border-green-500/40 bg-green-500/10 text-green-400'
              : 'border-border bg-card text-ink-muted'
          }`}
        >
          {session.routineId ? 'CON RUTINA' : 'LIBRE'}
        </span>
      </header>

      {hasNotes && (
        <p className="mt-3 font-pixel-mono text-base leading-snug text-ink/90 break-words">
          {session.notes}
        </p>
      )}
    </article>
  );
};
