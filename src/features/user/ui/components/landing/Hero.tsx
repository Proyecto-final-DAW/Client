export const Hero = (): React.JSX.Element => {
  return (
    <section className="relative h-[60vh] flex items-center justify-center text-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('public/images/fondo landing.jpeg')",
        }}
      />
      <div className="absolute inset-0 bg-orange-500/70" />

      <img
        src="public/images/entrenadorHero.webp"
        alt="entrenador"
        className="relative
          w-[280px] md:w-[420px]
          -translate-x-[120%]
          pointer-events-none"
      />

      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-6xl font-bold">Gimnasio</h1>
          <h2 className="text-2xl mt-4">Subtítulo del Gimnasio</h2>
          <button className="bg-red-600 hover:bg-red-700 transition-all duration-300 mt-4 px-8 py-3 rounded-2xl text-lg font-semibold text-white shadow-lg hover:scale-105">
            Empezar ahora
          </button>
        </div>
      </div>
    </section>
  );
};
