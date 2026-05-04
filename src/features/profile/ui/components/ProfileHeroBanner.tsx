import { UserCircleIcon } from '@heroicons/react/24/solid';
import { motion, useReducedMotion } from 'framer-motion';

import { PixelCorners } from '../../../../shared/components/PixelCorners';
import type { CharacterState } from '../../../character/core/domain/models/CharacterState';

interface ProfileHeroBannerProps {
  name: string;
  profileImage: string | null | undefined;
  characterState: CharacterState | null;
}

const subtitleFor = (state: CharacterState): string => {
  if (state.isMaestroSupremo && state.isLeyenda) return '☆ LEYENDA';
  if (state.isMaestroSupremo) return '✦ MAESTRO SUPREMO';
  if (state.legendaryStage === 'TRANSCENDENT') return '✦ TRASCENDENTE';
  if (state.legendary) return '🜂 LEGENDARIO';
  if (state.specialization) return '◆ ESPECIALISTA';
  if (state.vocation) return '◆ VOCACION';
  return '◆ INICIADO';
};

const displayClass = (
  state: CharacterState
): { name: string; frase: string } => {
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

export const ProfileHeroBanner = ({
  name,
  profileImage,
  characterState,
}: ProfileHeroBannerProps): React.JSX.Element => {
  const prefersReducedMotion = useReducedMotion();

  const motionProps = prefersReducedMotion
    ? { initial: false }
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
      };

  const className = characterState
    ? displayClass(characterState).name
    : 'HEROE';
  const frase = characterState ? displayClass(characterState).frase : '';
  const subtitle = characterState ? subtitleFor(characterState) : '◆ HEROE';
  const heroLevel = characterState?.heroLevel ?? null;

  return (
    <motion.section
      {...motionProps}
      className="relative border-2 border-green-500/60 bg-[#0d0d14] p-5 shadow-[0_0_0_4px_rgba(10,10,15,0.8),0_0_60px_rgba(34,197,94,0.25)]"
    >
      <PixelCorners size="md" className="border-green-500/60" />

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-5">
        {/* Avatar — same retro frame as the sidebar but ~3× larger so the
            page actually feels personal. Falls back to a glyph when no
            profileImage is set on the user. */}
        <div className="relative shrink-0">
          <div className="absolute inset-0 -m-1 border-2 border-green-500/40 [clip-path:polygon(0_8px,8px_0,calc(100%-8px)_0,100%_8px,100%_calc(100%-8px),calc(100%-8px)_100%,8px_100%,0_calc(100%-8px))] pointer-events-none" />
          {profileImage ? (
            <img
              src={profileImage}
              alt={`Avatar de ${name}`}
              className="h-24 w-24 sm:h-28 sm:w-28 border-2 border-[#1e1e2e] object-cover shadow-[0_0_24px_rgba(34,197,94,0.35)]"
            />
          ) : (
            <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center border-2 border-[#1e1e2e] bg-green-500/10 shadow-[0_0_24px_rgba(34,197,94,0.35)]">
              <UserCircleIcon className="h-14 w-14 text-green-400" />
            </div>
          )}
          {heroLevel !== null && (
            <span className="absolute -bottom-2 -right-2 inline-flex items-center justify-center border-2 border-green-700 bg-green-500 px-2 py-1 font-['Press_Start_2P'] text-[8px] tracking-widest text-[#0a0a0f] shadow-[0_0_10px_rgba(34,197,94,0.6)]">
              LVL {heroLevel}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p className="font-['Press_Start_2P'] text-[8px] tracking-widest text-green-500">
            {subtitle}
          </p>
          <h2 className="mt-2 font-['Press_Start_2P'] text-base leading-relaxed text-green-400 [text-shadow:2px_2px_0_#000,0_0_14px_rgba(34,197,94,0.45)] sm:text-lg break-words">
            {className}
          </h2>
          <p className="mt-2 font-['Press_Start_2P'] text-[10px] tracking-widest text-[#e4e4e7]">
            {name.toUpperCase()}
          </p>
          {frase && (
            <p className="mt-3 font-['Press_Start_2P'] text-base italic leading-tight text-[#a1a1aa]">
              “{frase}”
            </p>
          )}
        </div>
      </div>
    </motion.section>
  );
};
