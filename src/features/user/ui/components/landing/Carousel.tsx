import { useEffect, useState } from 'react';

type Quote = {
  text: string;
  author: string;
  role?: string;
};

const QUOTES: Quote[] = [
  {
    text: 'Invertimos con paciencia y disciplina, priorizando la continuidad.',
    author: 'Benwar Enterprises',
    role: 'Filosofía',
  },
  {
    text: 'Cuidamos los negocios como si fueran propios: discreción, ética y largo plazo.',
    author: 'Equipo Benwar',
    role: 'Enfoque',
  },
  {
    text: 'Empresas sólidas, humanas y rentables. Sin prisas, con compromiso.',
    author: 'Benwar',
    role: 'Principios',
  },
];

export const Carousel = (): React.JSX.Element => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % QUOTES.length);
    }, 4500);

    return () => {
      window.clearInterval(id);
    };
  }, []);
  const q = QUOTES[index];

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div
          key={index}
          className="relative rounded-2xl bg-white p-8 shadow-sm border 
          w-[5in] h-[2in] animate-slideInLeft"
        >
          <p className="text-xl leading-relaxed">“{q.text}”</p>

          <div className="mt-6">
            <p className="font-semibold">{q.author}</p>
            {q.role ? <p className="text-sm opacity-70">{q.role}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
};
