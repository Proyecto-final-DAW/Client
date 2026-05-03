import { motion, useReducedMotion } from 'framer-motion';

import { PixelCorners } from '../../../../shared/components/PixelCorners';

type Props = {
  name: string;
  frase: string;
  recommended: boolean;
  selected: boolean;
  onSelect: () => void;
};

export const ClassChoiceCard = (props: Props): React.JSX.Element => {
  const prefersReducedMotion = useReducedMotion();

  const borderClass = props.selected
    ? 'border-green-400 shadow-[0_0_24px_rgba(34,197,94,0.45)]'
    : props.recommended
      ? 'border-green-500/60 hover:border-green-400'
      : 'border-[#27272a] hover:border-green-500/40';

  const hoverProps = prefersReducedMotion
    ? {}
    : { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } };

  return (
    <motion.button
      type="button"
      onClick={props.onSelect}
      aria-pressed={props.selected}
      {...hoverProps}
      className={`relative w-full border-2 ${borderClass} bg-[#0d0d14] p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400`}
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
        <span className="absolute -top-2.5 left-3 bg-green-500 px-2 py-1 font-['Press_Start_2P'] text-[8px] tracking-widest text-[#0a0a0f]">
          ★ RECOMENDADA
        </span>
      )}

      <h3 className="font-['Press_Start_2P'] text-[11px] leading-relaxed text-green-400 [text-shadow:0_0_12px_rgba(34,197,94,0.5)]">
        {props.name.toUpperCase()}
      </h3>

      <p className="mt-3 font-['VT323'] text-base italic leading-tight text-[#d4d4d8]">
        “{props.frase}”
      </p>
    </motion.button>
  );
};
