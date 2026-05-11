import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { PixelCorners } from '@shared/components/PixelCorners';
import { motion, useReducedMotion } from 'framer-motion';
import type { ComponentType, SVGProps } from 'react';

type Props = {
  name: string;
  frase: string;
  /**
   * Optional pixel-art icon (sword/shield/feather/etc.) drawn at the
   * top of the card so each option reads at a glance as "this is the
   * fuerza class / agility class / …". The dominant or required stat
   * comes from the catalog and is unique per option, so the icon
   * doubles as identity.
   */
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  /** Hex accent for the icon background + selected state glow. */
  accent?: string;
  /** Subtitle line e.g. "STAT DOMINANTE: FUERZA". */
  statLine?: string;
  recommended: boolean;
  selected: boolean;
  onSelect: () => void;
};

const DEFAULT_ACCENT = '#22c55e';

export const ClassChoiceCard = (props: Props): React.JSX.Element => {
  const prefersReducedMotion = useReducedMotion();
  const accent = props.accent ?? DEFAULT_ACCENT;
  const Icon = props.icon;

  const borderStyle = props.selected
    ? {
        borderColor: accent,
        boxShadow: `0 0 0 2px color-mix(in srgb, ${accent} 60%, transparent), 0 0 32px color-mix(in srgb, ${accent} 55%, transparent)`,
      }
    : props.recommended
      ? {
          borderColor: `color-mix(in srgb, ${accent} 60%, transparent)`,
        }
      : {};

  const hoverProps = prefersReducedMotion
    ? {}
    : { whileHover: { scale: 1.03, y: -2 }, whileTap: { scale: 0.98 } };

  // Layout note: contents are center-aligned around the icon. The
  // earlier left-aligned card with a small h-9 icon in a h-14 box read
  // as "list item with a thumbnail" — too quiet for a class-pick
  // screen the user only sees once per tier. Centering the big icon
  // and the class name puts the identity beat (the icon + the colour)
  // right at the top of the card where the eye lands first.
  return (
    <motion.button
      type="button"
      onClick={props.onSelect}
      aria-pressed={props.selected}
      {...hoverProps}
      style={borderStyle}
      className={`relative flex h-full w-full flex-col items-center border-2 bg-card p-2.5 sm:p-6 text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400 ${
        props.selected
          ? ''
          : props.recommended
            ? 'hover:border-green-400'
            : 'border-border-muted hover:border-green-500/40'
      }`}
    >
      <PixelCorners
        size="sm"
        className={
          props.selected || props.recommended
            ? 'border-green-400'
            : 'border-[#3f3f46]'
        }
      />

      {/* RECOMENDADA now lives inside the frame as an eyebrow rather
          than sticking out of the top-left like a sticky note. The
          previous floating tag broke the card's border line and the
          orange contrasted ungracefully with the rest of the modal —
          this reads as part of the card itself. */}
      {props.recommended && (
        <p
          className="mb-1 sm:mb-2 font-pixel text-[7px] sm:text-[8px] tracking-widest"
          style={{
            color: accent,
            textShadow: `0 0 10px color-mix(in srgb, ${accent} 60%, transparent)`,
          }}
        >
          ★ RECOMENDADA
        </p>
      )}

      {props.selected && (
        <motion.span
          initial={prefersReducedMotion ? false : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25, ease: [0.22, 1.4, 0.36, 1] }}
          className="absolute top-2 right-2 inline-flex h-5 w-5 items-center justify-center"
        >
          <CheckCircleIcon
            className="h-5 w-5"
            style={{
              color: accent,
              filter: `drop-shadow(0 0 6px color-mix(in srgb, ${accent} 60%, transparent))`,
            }}
          />
        </motion.span>
      )}

      {Icon && (
        <div
          className="mb-2 sm:mb-3 inline-flex h-10 w-10 sm:h-16 sm:w-16 items-center justify-center border-2"
          style={{
            borderColor: `color-mix(in srgb, ${accent} 55%, transparent)`,
            backgroundColor: `color-mix(in srgb, ${accent} 14%, transparent)`,
            boxShadow: `inset 0 0 18px color-mix(in srgb, ${accent} 22%, transparent), 0 0 16px color-mix(in srgb, ${accent} 38%, transparent)`,
          }}
        >
          <Icon
            className="h-6 w-6 sm:h-10 sm:w-10"
            style={{
              color: accent,
              filter: `drop-shadow(0 0 6px color-mix(in srgb, ${accent} 55%, transparent))`,
            }}
            aria-hidden="true"
          />
        </div>
      )}

      <h3
        className="font-pixel text-[10px] sm:text-sm leading-relaxed"
        style={{
          color: accent,
          textShadow: `0 0 14px color-mix(in srgb, ${accent} 50%, transparent)`,
        }}
      >
        {props.name.toUpperCase()}
      </h3>

      {props.statLine && (
        <p className="mt-1 sm:mt-2 font-pixel text-[7px] sm:text-[9px] tracking-widest text-ink-muted">
          {props.statLine}
        </p>
      )}

      <p className="mt-2 sm:mt-4 font-pixel-mono text-[11px] sm:text-base italic leading-snug text-[#d4d4d8]">
        “{props.frase}”
      </p>
    </motion.button>
  );
};
