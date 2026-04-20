import { Carousel } from './Carousel';
import { CtaSection } from './CtaSection';
import { Hero } from './Hero';
import { LandingNav } from './LandingNav';
import { QuestLogSection } from './QuestLogSection';

export const Landing = (): React.JSX.Element => {
  return (
    <div className="relative bg-[#0a0a0f] min-h-screen text-[#e4e4e7] scroll-smooth">
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "url('/images/1.png')",
          backgroundSize: '100% auto',
          backgroundPosition: 'top center',
          backgroundRepeat: 'repeat-y',
          imageRendering: 'pixelated',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-0 backdrop-blur-sm"
        style={{
          background:
            'linear-gradient(to bottom, rgba(5,5,9,0.68) 0%, rgba(5,5,9,0.75) 100%)',
        }}
      />

      <LandingNav />

      <div className="relative z-10">
        <Hero />
        <Carousel />
        <QuestLogSection />
        <CtaSection />

        <footer className="border-t-2 border-[#1e1e2e]/60 py-6 sm:py-8 bg-[#0a0a0f]/30 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
            <span className="font-['Press_Start_2P'] text-[7px] sm:text-[8px] text-[#71717a]">
              © 2026 GYMQUEST
            </span>
            <span className="font-['Press_Start_2P'] text-[7px] sm:text-[8px] text-[#71717a]">
              LVL UP YOUR FITNESS
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};
