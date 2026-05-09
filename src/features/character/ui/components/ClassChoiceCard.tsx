import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { motion, useReducedMotion } from 'framer-motion';
import type { ComponentType, SVGProps } from 'react';

import { PixelCorners } from '@shared/components/PixelCorners';

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

  return (
    <motion.button
      type="button"
      onClick={props.onSelect}
      aria-pressed={props.selected}
      {...hoverProps}
      style={borderStyle}
      className={`relative w-full border-2 bg-card p-5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400 ${
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

      {props.recommended && (
        <span
          className="absolute -top-2.5 left-3 px-2 py-1 font-pixel text-[8px] tracking-widest text-[#0a0a0f]"
          style={{
            background: accent,
            boxShadow: `0 0 10px color-mix(in srgb, ${accent} 60%, transparent)`,
          }}
        >
          ★ RECOMENDADA
        </span>
      )}

      {props.selected && (
        <motion.span
          initial={prefersReducedMotion ? false : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25, ease: [0.22, 1.4, 0.36, 1] }}
          className="absolute -top-3 -right-3 inline-flex h-8 w-8 items-center justify-center"
        >
          <CheckCircleIcon
            className="h-8 w-8 drop-shadow-[0_0_12px_rgba(34,197,94,0.7)]"
            style={{ color: accent }}
          />
        </motion.span>
      )}

      {Icon && (
        <div
          className="mb-4 inline-flex h-14 w-14 items-center justify-center border-2 rounded-sm"
          style={{
            borderColor: `color-mix(in srgb, ${accent} 55%, transparent)`,
            backgroundColor: `color-mix(in srgb, ${accent} 14%, transparent)`,
            boxShadow: `inset 0 0 18px color-mix(in srgb, ${accent} 18%, transparent), 0 0 14px color-mix(in srgb, ${accent} 30%, transparent)`,
          }}
        >
          <Icon
            className="h-9 w-9"
            style={{ color: accent }}
            aria-hidden="true"
          />
        </div>
      )}

      <h3
        className="font-pixel text-sm leading-relaxed [text-shadow:0_0_14px_rgba(34,197,94,0.4)]"
        style={{ color: accent }}
      >
        {props.name.toUpperCase()}
      </h3>

      {props.statLine && (
        <p className="mt-2 font-pixel text-[8px] tracking-widest text-ink-muted">
          {props.statLine}
        </p>
      )}

      <p className="mt-3 font-pixel-mono text-base italic leading-tight text-[#d4d4d8]">
        “{props.frase}”
      </p>
    </motion.button>
  );
};
