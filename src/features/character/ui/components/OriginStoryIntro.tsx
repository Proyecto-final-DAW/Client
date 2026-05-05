import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

import { PixelCorners } from '../../../../shared/components/PixelCorners';

interface OriginStoryIntroProps {
  /** Title-cased name to address the user with on the final panel. */
  name: string;
  open: boolean;
  onClose: () => void;
}

interface Panel {
  /** Pixel-font heading (Press_Start_2P). Short, evocative. */
  title: string;
  /**
   * Narrative copy in VT323. An array of paragraphs so a panel can break
   * a structured list (stat names, rank ladder) away from the explanatory
   * prose without forcing a single wall of text. Use `{name}` as a
   * placeholder — replaced at render time so the personalization shows up
   * on the final beat.
   */
  body: string[];
  /** Glyph rendered above the title for atmosphere. */
  glyph: string;
  /** CTA on the "next" button for this panel. Defaults to "▶ CONTINUAR". */
  cta?: string;
}

const PANELS: Panel[] = [
  {
    glyph: '✦',
    title: 'EL UMBRAL',
    body: [
      'Has cruzado un umbral. Hasta hoy eras solo un viajero. Pero acabas de elegir un camino — y los caminos cambian a quienes los recorren.',
    ],
  },
  {
    glyph: '◆',
    title: 'ERES UN INICIADO',
    body: [
      'El primero de siete rangos. El más bajo. Aquí no hay enemigos que vencer: el monstruo eres tú mismo. Cada sesión que completes te aleja de él.',
    ],
  },
  {
    glyph: '⚔',
    title: 'TUS SEIS VIRTUDES',
    body: [
      'FUERZA · RESISTENCIA · ESTAMINA · AGILIDAD · TENACIDAD · VIGOR.',
      'Cada ejercicio alimenta una de ellas. Cuando entrenas crecen. Cuando faltas, no. Tú decides cuáles definen a tu héroe.',
    ],
  },
  {
    glyph: '✧',
    title: 'EL CAMINO',
    body: [
      'INICIADO → VOCACION → ESPECIALISTA → LEGENDARIO → TRASCENDENTE → MAESTRO → LEYENDA.',
      'Siete rangos. En cada salto, una clase define quién eres. Tu primera elección llega antes de lo que crees.',
    ],
  },
  {
    glyph: '▶',
    title: 'EMPIEZA',
    body: ['Tu historia comienza ahora, {name}. Forja tu destino.'],
    cta: '▶ COMENZAR',
  },
];

const replaceTokens = (text: string, name: string): string =>
  text.replace(/\{name\}/g, name);

export const OriginStoryIntro = ({
  name,
  open,
  onClose,
}: OriginStoryIntroProps): React.JSX.Element | null => {
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  // Close handler reused by Skip and final CTA. Wrapped in useCallback so
  // the keyboard-shortcut effect below doesn't tear down on every render.
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Reset to panel 0 each time the modal opens — without this, dismissing
  // mid-way and reopening (defensive, shouldn't happen with the localStorage
  // flag) would leave the user staring at the last panel.
  useEffect(() => {
    if (open) setIndex(0);
  }, [open]);

  // ESC = skip; → / Enter = next. Lets the keyboard user blow through the
  // intro at their own pace without reaching for the mouse.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        setIndex((i) => (i < PANELS.length - 1 ? i + 1 : i));
      } else if (e.key === 'ArrowLeft') {
        setIndex((i) => Math.max(0, i - 1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, handleClose]);

  if (!open) return null;

  const panel = PANELS[index];
  const isLast = index === PANELS.length - 1;
  const bodyParagraphs = panel.body.map((p) => replaceTokens(p, name));

  const advance = (): void => {
    if (isLast) {
      handleClose();
    } else {
      setIndex((i) => i + 1);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="origin-story-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0f]/85 backdrop-blur-md p-4"
    >
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-2xl border-2 border-green-500/60 bg-card p-6 sm:p-8 shadow-[0_0_0_4px_rgba(10,10,15,0.85),0_0_80px_rgba(34,197,94,0.4)]"
      >
        <PixelCorners size="md" className="border-green-500/60" />

        {/* Skip — small, top-right, never the dominant CTA. */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 font-pixel text-[8px] tracking-widest text-ink-faint hover:text-green-400 transition-colors"
          aria-label="Saltar la introducción"
        >
          SALTAR ▶
        </button>

        {/* Glyph + title + body, animated as a single block per panel.
            AnimatePresence with mode="wait" guarantees the previous panel
            finishes its exit before the next mounts — no flickering text
            overlap on slow connections. */}
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <p className="font-pixel text-3xl text-green-400 [text-shadow:0_0_18px_rgba(34,197,94,0.6)]">
              {panel.glyph}
            </p>
            <h2
              id="origin-story-title"
              className="mt-4 font-pixel text-base sm:text-lg leading-relaxed text-green-400 [text-shadow:2px_2px_0_#000,0_0_14px_rgba(34,197,94,0.5)]"
            >
              {panel.title}
            </h2>
            <div className="mt-5 mx-auto max-w-xl flex flex-col gap-4">
              {bodyParagraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className="font-pixel-mono text-xl leading-snug text-ink"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress dots — 5 small markers showing where in the story we
            are. Doubles as a tap target so a user can jump directly. */}
        <div
          className="mt-8 flex items-center justify-center gap-2"
          aria-label={`Panel ${index + 1} de ${PANELS.length}`}
        >
          {PANELS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ir al panel ${i + 1}`}
              aria-current={i === index ? 'step' : undefined}
              className={`h-2 w-2 border-2 transition-colors ${
                i === index
                  ? 'border-green-400 bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.6)]'
                  : i < index
                    ? 'border-green-500/60 bg-green-500/40'
                    : 'border-border bg-transparent hover:border-green-500/40'
              }`}
            />
          ))}
        </div>

        {/* Primary CTA — full width on mobile so the thumb has a generous
            hit area, auto on desktop so it doesn't feel like a slab. */}
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={advance}
            className="font-pixel text-[10px] sm:text-xs tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-6 py-3 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_18px_rgba(34,197,94,0.4)]"
          >
            {panel.cta ?? '▶ CONTINUAR'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
