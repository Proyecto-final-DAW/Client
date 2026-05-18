import type React from 'react';

import { SessionHistoryContent } from './components/SessionHistoryContent';

/**
 * /historial — chronological list of past sessions. The view itself
 * is a thin shell: header eyebrow + page title + content. Wrapped in
 * `mx-auto max-w-5xl` like every other dashboard route so the body
 * sits at the same column width as Dashboard / Profile / Progress.
 *
 * No outer `<main>` — DashboardLayout already provides one. Previous
 * version used `bg-gray-950 / rounded / blue accents`, breaking the
 * pixel-art aesthetic; rebuilt to match the rest of the app
 * (font-pixel headings, green-500 eyebrows, square borders).
 */
export const SessionHistoryView = (): React.JSX.Element => {
  return (
    <section className="mx-auto max-w-5xl text-ink">
      <header className="mb-6">
        <p className="font-pixel text-[9px] tracking-widest text-green-500">
          HISTORIAL
        </p>
        <h1 className="mt-2 font-pixel text-base sm:text-lg tracking-widest text-green-400 [text-shadow:0_0_16px_rgba(34,197,94,0.55)]">
          SESIONES
        </h1>
        <p className="mt-3 font-pixel-mono text-base leading-snug text-ink-muted">
          Tus entrenamientos pasados, en orden.
        </p>
      </header>

      <SessionHistoryContent />
    </section>
  );
};
