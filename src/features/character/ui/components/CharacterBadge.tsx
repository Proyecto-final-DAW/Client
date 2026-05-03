import { motion, useReducedMotion } from 'framer-motion';

import { PixelCorners } from '../../../../shared/components/PixelCorners';
import type { CharacterState } from '../../core/domain/models/CharacterState';

type Props = {
  state: CharacterState;
};

const subtitleFor = (state: CharacterState): string => {
  if (state.isMaestroSupremo && state.isLeyenda) return '☆ LEYENDA';
  if (state.isMaestroSupremo) return '✦ MAESTRO SUPREMO';
  if (state.legendaryStage === 'TRANSCENDENT') return '✦ TRASCENDENTE';
  if (state.legendary) return '🜂 LEGENDARIO';
  if (state.specialization) return '◆ ESPECIALISTA';
  if (state.vocation) return '◆ VOCACIÓN';
  return '◆ INICIADO';
};

const displayClass = (state: CharacterState) => {
  if (state.isMaestroSupremo) {
    return { name: 'Maestro Supremo', frase: '' };
  }
  if (state.legendary && state.legendaryStage === 'TRANSCENDENT') {
    return {
      name: state.legendary.transcendentName.toUpperCase(),
      frase: state.legendary.transcendentFrase,
    };
  }
  if (state.legendary) {
    return {
      name: state.legendary.name.toUpperCase(),
      frase: state.legendary.frase,
    };
  }
  if (state.specialization) {
    return {
      name: state.specialization.name.toUpperCase(),
      frase: state.specialization.frase,
    };
  }
  if (state.vocation) {
    return {
      name: state.vocation.name.toUpperCase(),
      frase: state.vocation.frase,
    };
  }
  return { name: state.novice.name.toUpperCase(), frase: state.novice.frase };
};

export const CharacterBadge = (props: Props): React.JSX.Element => {
  const { name, frase } = displayClass(props.state);
  const prefersReducedMotion = useReducedMotion();

  const motionProps = prefersReducedMotion
    ? { initial: false }
    : {
        variants: {
          hidden: { opacity: 0, y: 24 },
          visible: { opacity: 1, y: 0 },
        },
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <motion.article
      {...motionProps}
      className="relative border-2 border-green-500/60 bg-[#0d0d14] p-5 sm:p-6 shadow-[0_0_0_4px_rgba(10,10,15,0.8),0_0_60px_rgba(34,197,94,0.35),0_20px_50px_rgba(0,0,0,0.8)]"
    >
      <PixelCorners size="md" className="border-green-500/60" />

      <div className="mb-3 text-center font-['Press_Start_2P'] text-[9px] tracking-widest text-green-500">
        {subtitleFor(props.state)}
      </div>

      <p className="text-center font-['Press_Start_2P'] text-base leading-tight text-[#e4e4e7] [text-shadow:2px_2px_0_#000,0_0_14px_rgba(34,197,94,0.45)]">
        {name}
      </p>

      {frase && (
        <p className="mt-3 text-center font-['VT323'] text-base italic leading-tight text-[#a1a1aa]">
          “{frase}”
        </p>
      )}

      <p className="mt-4 text-center font-['Press_Start_2P'] text-[8px] tracking-widest text-green-400">
        ─ HÉROE LVL {props.state.heroLevel} ─
      </p>
    </motion.article>
  );
};
