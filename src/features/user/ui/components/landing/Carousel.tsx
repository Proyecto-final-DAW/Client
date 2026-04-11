const FEATURES = [
  {
    icon: '📋',
    title: 'PLAN',
    subtitle: 'Personalizado',
    description:
      'IA genera tu rutina según nivel, objetivos y equipamiento.',
  },
  {
    icon: '🏋️',
    title: 'TRACK',
    subtitle: 'En vivo',
    description:
      'Registra sets, reps y peso. Tu RM se calcula solo.',
  },
  {
    icon: '📈',
    title: 'STATS',
    subtitle: 'Progreso',
    description:
      'Gráficos de fuerza, peso corporal y volumen semanal.',
  },
  {
    icon: '🥗',
    title: 'FOOD',
    subtitle: 'Nutrición',
    description:
      'Macros calculados según tu objetivo y actividad.',
  },
  {
    icon: '⚔️',
    title: 'RPG',
    subtitle: 'Sistema',
    description:
      'Stats de FUE, RES, VEL y FLX que suben con tu esfuerzo.',
  },
  {
    icon: '🎯',
    title: 'FORM',
    subtitle: 'Técnica',
    description:
      'GIFs y guías paso a paso para cada ejercicio.',
  },
];

export const Carousel = (): React.JSX.Element => {
  return (
    <section id="features" className="py-16 sm:py-24 bg-[#0a0a0f] scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-['Press_Start_2P'] text-sm sm:text-lg md:text-xl text-[#e4e4e7] leading-relaxed">
            ELIGE TU{' '}
            <span className="text-green-500">HABILIDAD</span>
          </h2>
          <p className="mt-4 text-[#71717a] text-sm sm:text-base font-mono max-w-md mx-auto">
            Herramientas para principiantes y avanzados.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group bg-[#12121a] border-2 border-[#1e1e2e] hover:border-green-500/50 p-5 sm:p-6 transition-all duration-300 relative overflow-hidden"
            >
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-green-500/0 group-hover:border-green-500/60 transition-all duration-300" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-green-500/0 group-hover:border-green-500/60 transition-all duration-300" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-green-500/0 group-hover:border-green-500/60 transition-all duration-300" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-green-500/0 group-hover:border-green-500/60 transition-all duration-300" />

              <div className="text-2xl sm:text-3xl mb-3">{f.icon}</div>
              <div className="font-['Press_Start_2P'] text-[10px] sm:text-xs text-green-500 mb-1">
                {f.title}
              </div>
              <div className="font-['Press_Start_2P'] text-[8px] sm:text-[10px] text-[#e4e4e7] mb-3 group-hover:text-green-400 transition-colors">
                {f.subtitle}
              </div>
              <p className="text-xs sm:text-sm text-[#71717a] leading-relaxed font-mono">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
