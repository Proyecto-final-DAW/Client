import { Link } from 'react-router-dom';

import { Carousel } from './Carousel';
import { Hero } from './Hero';

const STEPS = [
  {
    step: '01',
    title: 'CREAR PERFIL',
    desc: 'Nivel, objetivos y equipamiento.',
    icon: '📝',
  },
  {
    step: '02',
    title: 'RECIBIR PLAN',
    desc: 'Rutina semanal al instante.',
    icon: '📜',
  },
  {
    step: '03',
    title: 'SUBIR DE NIVEL',
    desc: 'Entrena y evoluciona tus stats.',
    icon: '⭐',
  },
];

export const Landing = (): React.JSX.Element => {
  return (
    <div className="bg-[#0a0a0f] min-h-screen text-[#e4e4e7] scroll-smooth">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-md border-b-2 border-[#1e1e2e]">
        <div className="mx-auto px-6 sm:px-10 lg:px-16 h-24 flex items-center justify-between">
          <Link to="/">
            <img
              src="/images/Logo.png"
              alt="GymQuest"
              className="h-28 w-auto -my-6 drop-shadow-lg object-contain"
            />
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="font-['Press_Start_2P'] text-[7px] sm:text-[9px] text-[#71717a] hover:text-green-400 transition-colors px-2 sm:px-3 py-2"
            >
              LOGIN
            </Link>
            <Link
              to="/login"
              className="font-['Press_Start_2P'] text-[7px] sm:text-[9px] bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-3 sm:px-4 py-2 border-b-[3px] border-green-700 hover:border-green-600 active:border-b-0 active:mt-[3px] transition-all duration-150"
            >
              REGISTRO
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <Hero />

      {/* ── Features ── */}
      <Carousel />

      {/* ── How it works ── */}
      <section className="py-16 sm:py-24 bg-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-['Press_Start_2P'] text-sm sm:text-lg text-center mb-12 sm:mb-16 text-[#e4e4e7]">
            <span className="text-green-500">QUEST</span> LOG
          </h2>

          <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
            {STEPS.map((s, i) => (
              <div key={s.step} className="flex-1 relative">
                <div className="border-2 border-[#1e1e2e] bg-[#12121a] p-5 sm:p-6 text-center relative">
                  {/* Step connector on desktop */}
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 sm:-right-4 text-green-500/50 font-['Press_Start_2P'] text-xs">
                      ▸
                    </div>
                  )}

                  <div className="text-2xl sm:text-3xl mb-3">{s.icon}</div>
                  <div className="font-['Press_Start_2P'] text-green-500 text-[10px] sm:text-xs mb-2">
                    {s.step}
                  </div>
                  <div className="font-['Press_Start_2P'] text-[8px] sm:text-[10px] text-[#e4e4e7] mb-2">
                    {s.title}
                  </div>
                  <p className="text-xs sm:text-sm text-[#71717a] font-mono">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-16 sm:py-24 bg-[#0a0a0f]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="border-2 border-[#1e1e2e] bg-[#12121a] p-8 sm:p-12 relative">
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-green-500/40" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-green-500/40" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-green-500/40" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-green-500/40" />

            <div className="text-4xl sm:text-5xl mb-4">🗡️</div>
            <h2 className="font-['Press_Start_2P'] text-sm sm:text-lg md:text-xl text-[#e4e4e7] mb-2 leading-relaxed">
              ¿LISTO PARA
            </h2>
            <h2 className="font-['Press_Start_2P'] text-sm sm:text-lg md:text-xl text-green-500 mb-6 leading-relaxed">
              TU QUEST?
            </h2>
            <p className="text-[#71717a] text-sm sm:text-base font-mono mb-8">
              Únete gratis y empieza tu aventura hoy.
            </p>
            <Link
              to="/login"
              className="inline-block font-['Press_Start_2P'] text-[10px] sm:text-xs bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-8 sm:px-10 py-3.5 sm:py-4 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150"
            >
              ▶ JUGAR AHORA
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t-2 border-[#1e1e2e] py-6 sm:py-8 bg-[#0a0a0f]">
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
  );
};
