import { PixelCorners } from '@shared/components/PixelCorners';
import { motion, useReducedMotion } from 'framer-motion';

import { StartWorkoutButton } from './StartWorkoutButton';

interface DashboardCTAHeroProps {
  hasTrainedBefore: boolean;
  /**
   * True iff the user already saved a session today. Both the eyebrow
   * and the body copy adapt, AND the StartWorkoutButton flips to a
   * disabled "ENTRENO COMPLETADO" state — the server enforces one
   * session per day via UNIQUE(user_id, date), so the right UX is to
   * tell the user "vuelve mañana" instead of letting them tap into a
   * doomed save.
   */
  trainedToday: boolean;
}

/**
 * Action card — single primary CTA with framing copy.
 *
 * Three messaging states (all share the same big START button):
 *   - !hasTrainedBefore  → onboarding (TU PRIMER COMBATE)
 *   - trainedToday       → already trained today, "otra sesion mas"
 *   - default            → ready to train again
 */
export const DashboardCTAHero = ({
  hasTrainedBefore,
  trainedToday,
}: DashboardCTAHeroProps): React.JSX.Element => {
  const prefersReducedMotion = useReducedMotion();
  const motionProps = prefersReducedMotion
    ? { initial: false }
    : {
        initial: { opacity: 0, scale: 0.97 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <motion.section
      {...motionProps}
      className="relative flex h-full flex-col items-center justify-center gap-5 border-2 border-green-500/60 bg-card px-5 py-4 sm:py-5 text-center shadow-[0_0_0_4px_rgba(10,10,15,0.7),0_0_45px_rgba(34,197,94,0.32)]"
    >
      <PixelCorners size="md" className="border-green-500/60" />

      <p className="font-pixel text-[8px] sm:text-[9px] tracking-[0.2em] text-green-500">
        {trainedToday
          ? 'ENTRENO DE HOY'
          : hasTrainedBefore
            ? 'TU PROXIMO COMBATE'
            : 'TU AVENTURA EMPIEZA AQUI'}
      </p>

      {/* h2 only renders in the empty-state because "TU PRIMER COMBATE"
          is distinct from the button label. In the trained-state the
          h2 was "ENTRENA HOY" and the button "▶ ENTRENAR HOY" — same
          string twice within 30px of each other. */}
      {!hasTrainedBefore && (
        <h2 className="font-pixel text-base sm:text-xl text-green-400 [text-shadow:2px_2px_0_#000,0_0_18px_rgba(34,197,94,0.55)]">
          TU PRIMER COMBATE
        </h2>
      )}

      <StartWorkoutButton size="lg" trainedToday={trainedToday} />

      {/* No `max-w-*` so the line stays single on the typical desktop
          card width. text-base→text-lg gives it the visual weight the
          previous wrapped-paragraph version was losing. */}
      <p className="font-pixel-mono text-base sm:text-lg leading-snug text-ink-muted">
        {trainedToday
          ? 'Ya entrenaste hoy. Solo cuenta una sesion al dia, vuelve mañana.'
          : hasTrainedBefore
            ? 'Cada sesion te empuja hacia el siguiente rango. Tu personaje sube contigo.'
            : 'Tu personaje despertara al completar tu primera sesion. Demuestra de que estas hecho.'}
      </p>
    </motion.section>
  );
};
