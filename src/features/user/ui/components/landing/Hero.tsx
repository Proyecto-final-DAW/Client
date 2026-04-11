import { Link } from 'react-router-dom';

const STATS = [
  { name: 'FUE', value: 34, color: '#ef4444', icon: '⚔️' },
  { name: 'RES', value: 21, color: '#f59e0b', icon: '🛡️' },
  { name: 'VEL', value: 18, color: '#3b82f6', icon: '⚡' },
  { name: 'FLX', value: 12, color: '#a855f7', icon: '🌀' },
];

function PixelBar({ value, color }: { value: number; color: string }) {
  const totalBlocks = 10;
  const filledBlocks = Math.round((value / 100) * totalBlocks);

  return (
    <div className="flex gap-[2px]">
      {Array.from({ length: totalBlocks }).map((_, i) => (
        <div
          key={i}
          className="w-2.5 h-3 sm:w-3 sm:h-4"
          style={{
            background: i < filledBlocks ? color : '#1e1e2e',
            boxShadow: i < filledBlocks ? `0 0 4px ${color}66` : 'none',
            imageRendering: 'pixelated',
          }}
        />
      ))}
    </div>
  );
}

export const Hero = (): React.JSX.Element => {
  const scrollToFeatures = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0f]">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage: "url('/images/fondo landing.jpeg')",
          imageRendering: 'pixelated',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-transparent to-[#0a0a0f]" />

      {/* Scanlines overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-20"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-20 text-center">
        {/* Pixel badge */}
        <div
          className="inline-flex items-center gap-2 border-2 border-green-500/40 px-4 py-2 mb-6 sm:mb-8"
          style={{ background: '#22c55e11' }}
        >
          <span className="text-green-400 text-[8px] sm:text-[10px] font-['Press_Start_2P'] tracking-wider">
            ▶ NUEVA PARTIDA
          </span>
        </div>

        <h1 className="font-['Press_Start_2P'] text-xl sm:text-2xl md:text-4xl text-[#e4e4e7] leading-relaxed sm:leading-relaxed md:leading-relaxed">
          ENTRENA COMO
          <span className="block text-green-500 mt-2 sm:mt-4">UN HEROE</span>
        </h1>

        <p className="mt-6 sm:mt-8 text-sm sm:text-base text-[#71717a] max-w-xl mx-auto leading-relaxed font-mono">
          Convierte tu entrenamiento en una aventura RPG. Sube de nivel,
          desbloquea logros y alcanza tus metas.
        </p>

        {/* RPG Stats Panel */}
        <div
          className="max-w-sm mx-auto mt-8 sm:mt-10 border-2 border-[#1e1e2e] bg-[#0d0d14] p-4 sm:p-5"
        >
          <div className="text-[8px] sm:text-[10px] font-['Press_Start_2P'] text-green-500 mb-4 text-left tracking-wider">
            ─ STATS ─
          </div>
          <div className="space-y-3">
            {STATS.map((stat) => (
              <div key={stat.name} className="flex items-center gap-3">
                <span className="text-sm">{stat.icon}</span>
                <span
                  className="text-[8px] sm:text-[10px] font-['Press_Start_2P'] w-10 sm:w-12 text-left"
                  style={{ color: stat.color }}
                >
                  {stat.name}
                </span>
                <PixelBar value={stat.value} color={stat.color} />
                <span className="text-[8px] sm:text-[10px] font-['Press_Start_2P'] text-[#71717a] ml-auto">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10">
          <Link
            to="/login"
            className="w-full sm:w-auto font-['Press_Start_2P'] text-[10px] sm:text-xs bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-6 sm:px-8 py-3.5 sm:py-4 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150"
          >
            ▶ COMENZAR
          </Link>
          <a
            href="#features"
            onClick={scrollToFeatures}
            className="w-full sm:w-auto text-center font-['Press_Start_2P'] text-[10px] sm:text-xs border-2 border-[#1e1e2e] hover:border-green-500/40 text-[#71717a] hover:text-green-400 px-6 sm:px-8 py-3 sm:py-3.5 transition-all duration-300"
          >
            VER MÁS ↓
          </a>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
    </section>
  );
};
