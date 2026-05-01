import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { PixelCorners } from '../../../../shared/components/PixelCorners';
import type { PendingChoice } from '../../core/domain/models/CharacterState';
import { ClassChoiceCard } from './ClassChoiceCard';

type Props = {
  open: boolean;
  pendingChoice: PendingChoice;
  choosing: boolean;
  onConfirm: (classId: string) => void | Promise<void>;
  onClose: () => void;
};

const TIER_TITLE: Record<1 | 2 | 3, string> = {
  1: 'ELIGE TU VOCACIÓN',
  2: 'ELIGE TU ESPECIALIZACIÓN',
  3: 'ELIGE TU LEGENDARIA',
};

const TIER_DESCRIPTION: Record<1 | 2 | 3, string> = {
  1: 'Tu disciplina ha hablado por sí sola. Es momento de nombrarla.',
  2: 'Has cruzado el umbral. Tu camino se bifurca.',
  3: 'Has alcanzado lo que pocos alcanzan. Elige cómo serás recordado.',
};

export const TierUpModal = (props: Props): React.JSX.Element => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const tier = props.pendingChoice.tier;
  const options = props.pendingChoice.options;
  const recommendedId = props.pendingChoice.recommendedId;

  const handleConfirm = async () => {
    if (!selectedId) return;
    await props.onConfirm(selectedId);
  };

  return (
    <AnimatePresence>
      {props.open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="tier-up-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-3xl border-2 border-green-500/60 bg-[#0d0d14] p-6 shadow-[0_0_0_4px_rgba(10,10,15,0.8),0_0_80px_rgba(34,197,94,0.4)]"
          >
            <PixelCorners size="md" className="border-green-500/60" />

            <header className="mb-5 text-center">
              <p className="font-['Press_Start_2P'] text-[9px] tracking-widest text-green-500">
                ─ TIER {tier} ALCANZADO ─
              </p>
              <h2
                id="tier-up-title"
                className="mt-3 font-['Press_Start_2P'] text-base leading-relaxed text-green-400 [text-shadow:0_0_18px_rgba(34,197,94,0.55)] sm:text-lg"
              >
                {TIER_TITLE[tier]}
              </h2>
              <p className="mt-3 font-['VT323'] text-base italic text-[#a1a1aa]">
                {TIER_DESCRIPTION[tier]}
              </p>
            </header>

            <div
              className={`grid gap-3 ${
                options.length >= 3
                  ? 'sm:grid-cols-2 lg:grid-cols-3'
                  : 'sm:grid-cols-2'
              }`}
            >
              {options.map((option) => (
                <ClassChoiceCard
                  key={option.id}
                  name={option.name}
                  frase={option.frase}
                  recommended={option.id === recommendedId}
                  selected={selectedId === option.id}
                  onSelect={() => setSelectedId(option.id)}
                />
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={props.onClose}
                disabled={props.choosing}
                className="font-['Press_Start_2P'] text-[9px] tracking-widest border-2 border-[#27272a] bg-[#0d0d14] px-4 py-3 text-[#a1a1aa] transition-colors hover:border-[#3f3f46] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                MÁS TARDE
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!selectedId || props.choosing}
                className="font-['Press_Start_2P'] text-[9px] tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-6 py-3 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(34,197,94,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:mt-0"
              >
                {props.choosing ? 'ELIGIENDO…' : '▶ CONFIRMAR'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
