import {
  ArrowTrendingUpIcon,
  ClipboardDocumentListIcon,
  UserPlusIcon,
} from '@heroicons/react/24/solid';
import type { ComponentType, SVGProps } from 'react';

import { PixelCorners } from '../../../../../shared/components/PixelCorners';

type HeroIconCmp = ComponentType<SVGProps<SVGSVGElement>>;

type Step = {
  step: string;
  title: string;
  desc: string;
  Icon: HeroIconCmp;
};

const STEPS: Step[] = [
  {
    step: '01',
    title: 'CREAR PERFIL',
    desc: 'Nivel, objetivos y equipamiento.',
    Icon: UserPlusIcon,
  },
  {
    step: '02',
    title: 'RECIBIR PLAN',
    desc: 'Rutina semanal al instante.',
    Icon: ClipboardDocumentListIcon,
  },
  {
    step: '03',
    title: 'SUBIR DE NIVEL',
    desc: 'Entrena y evoluciona tus stats.',
    Icon: ArrowTrendingUpIcon,
  },
];

const StepCard = ({
  step,
  isLast,
}: {
  step: Step;
  isLast: boolean;
}): React.JSX.Element => {
  const Icon = step.Icon;
  return (
    <div className="relative flex">
      <div className="group flex h-full w-full flex-col items-center border-2 border-[#1e1e2e] bg-[#12121a]/85 backdrop-blur-md p-6 sm:p-7 text-center relative hover:border-green-500/40 transition-colors">
        <PixelCorners size="sm" className="border-green-500/40" />

        {!isLast && (
          <div className="hidden md:block absolute top-1/2 -translate-y-1/2 -right-[18px] text-green-500/70 font-['Press_Start_2P'] text-base">
            ▸
          </div>
        )}

        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-sm border-2 border-green-500/30 bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
          <Icon className="h-8 w-8 text-green-400" />
        </div>
        <div className="font-['Press_Start_2P'] text-green-500 text-[10px] sm:text-xs mb-3 tracking-widest">
          {step.step}
        </div>
        <div className="font-['Press_Start_2P'] text-[9px] sm:text-[11px] text-[#e4e4e7] mb-3 leading-relaxed">
          {step.title}
        </div>
        <p className="font-['Press_Start_2P'] text-[8px] sm:text-[10px] text-[#71717a] leading-loose tracking-wide mt-auto">
          {step.desc}
        </p>
      </div>
    </div>
  );
};

export const QuestLogSection = (): React.JSX.Element => {
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="font-['Press_Start_2P'] text-sm sm:text-lg text-center mb-12 sm:mb-16 text-[#e4e4e7] [text-shadow:2px_2px_0_#000,0_0_10px_rgba(0,0,0,0.8)]">
          <span className="text-green-500 [text-shadow:2px_2px_0_#000,0_0_10px_rgba(34,197,94,0.5)]">
            QUEST
          </span>{' '}
          LOG
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-stretch">
          {STEPS.map((s, i) => (
            <StepCard key={s.step} step={s} isLast={i === STEPS.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
};
