import {
  ArrowTrendingUpIcon,
  ClipboardDocumentListIcon,
  UserPlusIcon,
} from '@heroicons/react/24/solid';
import { PixelCorners } from '@shared/components/PixelCorners';
import type { ComponentType, SVGProps } from 'react';
import { Fragment } from 'react';

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

const StepCard = ({ step }: { step: Step }): React.JSX.Element => {
  const Icon = step.Icon;
  return (
    <div className="group relative flex h-full w-full flex-1 flex-col items-center border-2 border-border bg-subtle/85 backdrop-blur-md p-6 sm:p-7 text-center hover:border-green-500/40 transition-colors">
      <PixelCorners size="sm" className="border-green-500/40" />

      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-sm border-2 border-green-500/30 bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
        <Icon className="h-8 w-8 text-green-400" />
      </div>
      <div className="font-pixel text-green-500 text-[10px] sm:text-xs mb-3 tracking-widest">
        {step.step}
      </div>
      <div className="font-pixel text-[9px] sm:text-[11px] text-ink mb-3 leading-relaxed">
        {step.title}
      </div>
      <p className="font-pixel text-[8px] sm:text-[10px] text-ink-faint leading-loose tracking-wide mt-auto">
        {step.desc}
      </p>
    </div>
  );
};

/**
 * Three-step "how it works" panel. The connectors between cards are now
 * flex children instead of absolutely-positioned arrows hardcoded at
 * `-right-[18px]`. The previous version broke whenever the card padding
 * or gap changed; the flex version stays correct by construction.
 *
 * Mobile collapses to a vertical list (no connector — the visual flow
 * is already implicit in the stack order).
 */
export const QuestLogSection = (): React.JSX.Element => {
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="font-pixel text-sm sm:text-lg text-center mb-12 sm:mb-16 text-ink [text-shadow:2px_2px_0_#000,0_0_10px_rgba(0,0,0,0.8)]">
          <span className="text-green-500 [text-shadow:2px_2px_0_#000,0_0_10px_rgba(34,197,94,0.5)]">
            QUEST
          </span>{' '}
          LOG
        </h2>

        <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-2">
          {STEPS.map((s, i) => (
            <Fragment key={s.step}>
              <StepCard step={s} />
              {i < STEPS.length - 1 && (
                <div
                  aria-hidden="true"
                  className="hidden md:flex items-center justify-center font-pixel text-xl text-green-500/70 px-1"
                >
                  ▸
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
