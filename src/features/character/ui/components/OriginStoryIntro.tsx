import { STAT_CONFIG, STAT_ORDER } from '@features/stats/ui/StatConfig';
import { PixelCorners } from '@shared/components/PixelCorners';
import { useBodyScrollLock } from '@shared/hooks/useBodyScrollLock';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import {
  RANK_LETTERS,
  styleForRank,
} from '../../core/domain/models/RankLabels';

type StatKey = (typeof STAT_ORDER)[number];

/**
 * One-line "fuente" per stat — what concrete activity moves that bar.
 * Surfaced on the origin-story popup so a brand-new user knows *why*
 * they should pick a routine over another, instead of guessing which
 * exercise feeds which pillar. Kept reader-friendly (no "volumen", no
 * "series totales") because the popup fires before they've ever seen a
 * workout screen — terms have to be self-explanatory.
 */
const STAT_SOURCES: Record<StatKey, string> = {
  strength: 'Peso que levantas',
  resistance: 'Cardio y pesas largas',
  stamina: 'Series totales por sesion',
  agility: 'Cardio y movimiento',
  tenacity: 'Cumplir tu meta semanal',
  vigor: 'Entrenar + completar dieta',
};

interface OriginStoryIntroProps {
  /** Title-cased name to address the user with on the final panel. */
  name: string;
  open: boolean;
  onClose: () => void;
}

interface Panel {
  /**
   * Pixel-font heading (Press_Start_2P). Short, evocative. Optional —
   * the final beat ("EMPIEZA") drops the title so the body line itself
   * carries the moment, rendered larger to compensate.
   */
  title?: string;
  /**
   * Narrative copy in VT323. An array of paragraphs so a panel can break
   * a structured list (stat names, rank ladder) away from the explanatory
   * prose without forcing a single wall of text. Use `{name}` as a
   * placeholder — replaced at render time so the personalization shows up
   * on the final beat.
   */
  body: string[];
  /**
   * Glyph rendered above the title for atmosphere. Optional — the
   * closing "EMPIEZA" beat omits it so the body sentence stands alone.
   */
  glyph?: string;
  /** CTA on the "next" button for this panel. Defaults to "▶ CONTINUAR". */
  cta?: string;
  /**
   * When true, renders a pixel character card (avatar + LVL badge +
   * ESCUDERO name + frase) in place of the generic glyph. Used on the
   * "ERES UN INICIADO" beat — the popup is the only place we now
   * reveal the starting class, so it carries the visual punch instead
   * of being duplicated on the wizard's last step.
   */
  showCharacterCard?: boolean;
  /**
   * When true, renders the 6-stat "fuentes" grid (icon + name + 1-line
   * source) below the body copy. Used on the "TUS SEIS VIRTUDES" beat
   * so the user leaves the popup understanding exactly what activity
   * moves each bar — instead of the previous vague "cada ejercicio
   * alimenta una de ellas" hand-wave.
   */
  showStatsList?: boolean;
  /**
   * When true, renders the 7-rank visual ladder (F→E→D→C→B→A→S) with
   * pixel-art tiles, animated arrows, F highlighted as "AQUI" and S
   * tinted gold as "LEYENDA". Replaces the previous plain-text rank
   * string which felt like a documentation snippet rather than the
   * "este es el camino que vas a recorrer" beat the panel is selling.
   */
  showRankLadder?: boolean;
}

const FIRST_RANK = RANK_LETTERS[0];
const SECOND_RANK = RANK_LETTERS[1];
const TOP_RANK = RANK_LETTERS[RANK_LETTERS.length - 1];

const PANELS: Panel[] = [
  {
    glyph: '✦',
    title: 'EL UMBRAL',
    body: [
      'Has cruzado un umbral. Hasta hoy eras solo un viajero. Pero acabas de elegir un camino — y los caminos cambian a quienes los recorren.',
    ],
  },
  // Stats panel runs *before* the two rank beats so the user first
  // sees the mechanics ("here's what you grow"), then the ladder of
  // identity ("here's who you are right now → here's where you're
  // going"). Previously the order interleaved RANGO F between the
  // intro and the stats list, which broke the rhythm — the rank
  // chapters land harder when they share the same beat.
  {
    glyph: '⚔',
    title: 'TUS SEIS STATS',
    body: ['Cada accion alimenta un stat. Sube los que mas te importen.'],
    showStatsList: true,
  },
  {
    glyph: '◆',
    title: `RANGO ${FIRST_RANK}`,
    body: [
      '“Todo heroe empezo siendo nadie.”',
      `Empiezas SIN CLASE — en rango ${FIRST_RANK}, el peldaño mas bajo. Aqui no hay enemigos: el monstruo eres tu mismo. Cuando alcances NIVEL 5 en cualquier stat, subiras a rango ${SECOND_RANK} y elegiras tu primera clase.`,
    ],
  },
  {
    glyph: '✧',
    title: 'EL CAMINO',
    body: [
      `Siete rangos. ${FIRST_RANK} es donde empiezas. ${TOP_RANK} es donde nadie ha llegado todavia. En cada salto, una nueva clase define quien eres — tu primera eleccion llega antes de lo que crees.`,
    ],
    showRankLadder: true,
  },
  {
    // Title and glyph intentionally omitted — the body sentence is the
    // heading beat here, rendered larger so it carries the closing
    // moment on its own. No redundant "EMPIEZA" or play icon above it;
    // the CTA below already anchors the beat.
    body: ['Tu historia comienza ahora, {name}. Forja tu destino.'],
    cta: '▶ COMENZAR',
  },
];

/**
 * Splits a paragraph on the `{name}` placeholder and rewraps the user's
 * name in a styled span so it pops against the muted body type. Done at
 * render time (returning ReactNodes) instead of a plain string replace
 * because the brief is exactly that the name should *not* read like the
 * surrounding prose — it should land like a card flipping over to reveal
 * the player's identity.
 */
const renderBodyTokens = (text: string, name: string): React.ReactNode[] => {
  const parts = text.split('{name}');
  const nodes: React.ReactNode[] = [];
  parts.forEach((part, i) => {
    nodes.push(<span key={`p-${i}`}>{part}</span>);
    if (i < parts.length - 1) {
      nodes.push(
        // Same body font (VT323) so the size matches the surrounding
        // prose; only colour + glow distinguish it. The earlier version
        // used Press Start 2P here, which is chunky enough that even at
        // 0.85em it dominated the line. The point is "highlight", not
        // "scream".
        <span
          key={`n-${i}`}
          className="text-green-400 [text-shadow:0_0_12px_rgba(34,197,94,0.7)]"
        >
          {name.toUpperCase()}
        </span>
      );
    }
  });
  return nodes;
};

export const OriginStoryIntro = ({
  name,
  open,
  onClose,
}: OriginStoryIntroProps): React.JSX.Element | null => {
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  useBodyScrollLock(open);

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
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0a0a0f]/85 backdrop-blur-md p-4"
    >
      <motion.div
        initial={
          prefersReducedMotion ? false : { opacity: 0, scale: 0.92, y: 12 }
        }
        animate={{ opacity: 1, scale: 1, y: 0 }}
        // Spring entry with a touch of overshoot — the modal "lands"
        // instead of fading in. The previous timed easing felt flat
        // for what is supposed to be the welcome moment of the app.
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 24,
          mass: 0.95,
          opacity: { duration: 0.3 },
        }}
        className="relative my-4 w-full max-w-2xl max-h-[calc(100vh-2rem)] overflow-y-auto border-2 border-green-500/60 bg-card p-5 sm:p-8 shadow-[0_0_0_4px_rgba(10,10,15,0.85),0_0_80px_rgba(34,197,94,0.4)] [scrollbar-width:thin] [scrollbar-color:rgba(34,197,94,0.45)_rgba(15,15,20,0.4)] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-black/40 [&::-webkit-scrollbar-thumb]:bg-green-500/45"
      >
        <PixelCorners size="md" className="border-green-500/60" />

        {/* Skip — small, top-right, never the dominant CTA. */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 font-pixel text-[8px] tracking-widest text-ink-faint hover:text-green-400 transition-colors"
          aria-label="Saltar la introduccion"
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
            initial={prefersReducedMotion ? false : { opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, x: -50 }}
            // Horizontal slide + spring matches the onboarding wizard
            // visually — the popup feels like a natural continuation
            // of that flow rather than a separate UI. The spring
            // settles without bouncing thanks to the higher damping.
            transition={{
              type: 'spring',
              stiffness: 240,
              damping: 28,
              mass: 0.9,
              opacity: { duration: 0.25 },
            }}
            className="text-center"
          >
            {panel.showCharacterCard ? (
              // Class reveal beat. Originally this branch rendered an
              // avatar box + LVL badge above the class name, but the
              // avatar is just a placeholder diamond (no per-class art
              // yet) and the user already sees their real avatar on the
              // dashboard and profile — duplicating a fake one here only
              // weakened the moment. Now it's a clean two-tier:
              // "RANGO F" eyebrow → "SIN CLASE" h2 (matches the
              // server's NOVICE.name; the user starts unclassed).
              <div className="flex flex-col items-center">
                <p className="font-pixel text-[10px] sm:text-[11px] tracking-widest text-green-500">
                  {panel.title}
                </p>
                <h2
                  id="origin-story-title"
                  className="mt-2 font-pixel text-xl sm:text-2xl text-green-400 [text-shadow:2px_2px_0_#000,0_0_18px_rgba(34,197,94,0.55)]"
                >
                  SIN CLASE
                </h2>
              </div>
            ) : (
              <>
                {panel.glyph && (
                  <p className="font-pixel text-3xl text-green-400 [text-shadow:0_0_16px_rgba(34,197,94,0.55)]">
                    {panel.glyph}
                  </p>
                )}
                {panel.title && (
                  <h2
                    id="origin-story-title"
                    className="mt-4 font-pixel text-lg sm:text-xl leading-tight text-green-400 [text-shadow:2px_2px_0_#000,0_0_14px_rgba(34,197,94,0.5)]"
                  >
                    {panel.title}
                  </h2>
                )}
              </>
            )}
            <div className="mt-5 mx-auto max-w-xl flex flex-col gap-3">
              {panel.body.map((paragraph, i) => (
                <p
                  key={i}
                  // When the panel omits its title, the first paragraph
                  // takes the labelledby anchor and bumps to a heading-
                  // size font so it carries the panel on its own (used
                  // on the closing "EMPIEZA" beat).
                  id={
                    !panel.title && i === 0 ? 'origin-story-title' : undefined
                  }
                  className={
                    panel.title
                      ? 'font-pixel-mono text-lg sm:text-xl leading-snug text-ink'
                      : 'font-pixel-mono text-2xl sm:text-4xl leading-snug text-ink'
                  }
                >
                  {renderBodyTokens(paragraph, name)}
                </p>
              ))}
            </div>

            {panel.showRankLadder && (
              <div className="mt-7 mx-auto flex items-center justify-center gap-0.5 sm:gap-2">
                {RANK_LETTERS.map((letter, i) => {
                  const isCurrent = i === 0;
                  const isApex = i === RANK_LETTERS.length - 1;
                  const palette = styleForRank(letter);

                  // F (current) and S (apex goal) both get extra
                  // luminance — they're the two anchors of the ladder
                  // ("you are here" + "where you're going"). The middle
                  // ranks fade so the eye reads the path from F's pulse
                  // to S's permanent gold halo, with the others as
                  // stepping-stones in between.
                  let tileStyle: React.CSSProperties;
                  if (isCurrent) {
                    tileStyle = {
                      color: palette.text,
                      borderColor: palette.border,
                      backgroundColor: `color-mix(in srgb, ${palette.bg} 32%, transparent)`,
                    };
                  } else if (isApex) {
                    // Permanent gold halo — this is the goal. No pulse
                    // (that's reserved for "you"), but a static
                    // multi-layer shadow so the tile reads as lit even
                    // at a glance.
                    tileStyle = {
                      color: palette.text,
                      borderColor: palette.border,
                      backgroundColor: `color-mix(in srgb, ${palette.bg} 22%, transparent)`,
                      boxShadow: `0 0 14px ${palette.glow}, 0 0 32px ${palette.glow}`,
                    };
                  } else {
                    tileStyle = {
                      color: `color-mix(in srgb, ${palette.text} 35%, transparent)`,
                      borderColor: `color-mix(in srgb, ${palette.border} 30%, transparent)`,
                      backgroundColor: `color-mix(in srgb, ${palette.bg} 6%, transparent)`,
                    };
                  }

                  return (
                    <div
                      key={letter}
                      className="flex items-center gap-0.5 sm:gap-2"
                    >
                      {i > 0 && (
                        <motion.span
                          initial={
                            prefersReducedMotion ? false : { opacity: 0 }
                          }
                          animate={{ opacity: 1 }}
                          transition={{
                            delay: 0.35 + i * 0.12,
                            duration: 0.25,
                          }}
                          aria-hidden="true"
                          className="font-pixel text-xs sm:text-base text-green-500/50"
                        >
                          →
                        </motion.span>
                      )}

                      <div className="flex flex-col items-center">
                        <motion.div
                          initial={
                            prefersReducedMotion
                              ? false
                              : { opacity: 0, y: 10, scale: 0.8 }
                          }
                          animate={
                            isCurrent && !prefersReducedMotion
                              ? {
                                  opacity: 1,
                                  y: 0,
                                  scale: 1,
                                  // Brighter pulse for F: the Iron palette
                                  // glow alone is grey-on-dark which read
                                  // as flat. A double-layer shadow with a
                                  // larger outer ring makes the "you are
                                  // here" beat actually visible across
                                  // both panels and palettes.
                                  boxShadow: [
                                    `0 0 16px ${palette.glow}, 0 0 32px ${palette.glow}`,
                                    `0 0 28px ${palette.glow}, 0 0 52px ${palette.glow}`,
                                    `0 0 16px ${palette.glow}, 0 0 32px ${palette.glow}`,
                                  ],
                                }
                              : { opacity: 1, y: 0, scale: 1 }
                          }
                          transition={
                            isCurrent && !prefersReducedMotion
                              ? {
                                  opacity: { delay: 0.3, duration: 0.4 },
                                  y: { delay: 0.3, duration: 0.4 },
                                  scale: {
                                    delay: 0.3,
                                    duration: 0.4,
                                    ease: [0.22, 1.4, 0.36, 1],
                                  },
                                  boxShadow: {
                                    delay: 0.7,
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                  },
                                }
                              : {
                                  delay: 0.3 + i * 0.12,
                                  duration: 0.4,
                                  ease: [0.22, 1.4, 0.36, 1],
                                }
                          }
                          style={tileStyle}
                          className="flex h-10 w-8 sm:h-14 sm:w-12 items-center justify-center border-2 font-pixel text-base sm:text-xl"
                        >
                          {letter}
                        </motion.div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {panel.showStatsList && (
              <ul className="mt-6 mx-auto grid max-w-xl grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3 text-left">
                {STAT_ORDER.map((key) => {
                  const config = STAT_CONFIG[key];
                  const Icon = config.icon;
                  return (
                    <li key={key} className="flex items-start gap-3">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border-2"
                        style={{
                          borderColor: `color-mix(in srgb, ${config.accentColor} 60%, transparent)`,
                          backgroundColor: `color-mix(in srgb, ${config.accentColor} 14%, transparent)`,
                        }}
                      >
                        <Icon
                          className="h-5 w-5"
                          style={{ color: config.accentColor }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className="font-pixel text-[11px] sm:text-xs tracking-widest uppercase"
                          style={{ color: config.accentColor }}
                        >
                          {config.name}
                        </p>
                        <p className="mt-1 font-pixel-mono text-lg leading-snug text-ink-muted">
                          {STAT_SOURCES[key]}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
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
            className="font-pixel text-xs sm:text-sm tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-7 py-3 sm:py-4 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_18px_rgba(34,197,94,0.4)]"
          >
            {panel.cta ?? '▶ CONTINUAR'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
