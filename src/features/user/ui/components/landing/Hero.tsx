import { HeroStatsPanel } from './HeroStatsPanel';
import { StarField } from './StarField';

export const Hero = (): React.JSX.Element => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <StarField />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-36 sm:pt-44 md:pt-48 pb-10 text-center flex flex-col items-center">
        <h1 className="relative font-['Press_Start_2P'] text-2xl sm:text-4xl md:text-6xl text-white leading-relaxed sm:leading-relaxed md:leading-[1.25] [text-shadow:5px_5px_0_#000,-2px_-2px_0_#000,2px_-2px_0_#000,-2px_2px_0_#000,0_0_30px_rgba(0,0,0,1),0_0_60px_rgba(0,0,0,0.9)]">
          ENTRENA COMO
          <span className="block text-green-400 mt-2 sm:mt-4 [text-shadow:5px_5px_0_#000,-2px_-2px_0_#000,2px_-2px_0_#000,-2px_2px_0_#000,0_0_40px_rgba(34,197,94,1),0_0_70px_rgba(34,197,94,0.6)]">
            UN HEROE
          </span>
        </h1>

        <p className="relative mt-6 sm:mt-8 text-[9px] sm:text-[11px] text-[#e4e4e7] max-w-xl mx-auto leading-loose font-['Press_Start_2P'] tracking-wide [text-shadow:0_0_4px_#000,2px_2px_0_rgba(0,0,0,1),0_0_20px_rgba(0,0,0,0.9)]">
          Rutinas a tu medida, progreso real y habitos que te llevan al
          siguiente LVL cada semana.
        </p>

        <HeroStatsPanel />
      </div>
    </section>
  );
};
