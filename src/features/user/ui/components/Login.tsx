import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useLogin } from '../hooks/useLogin';

export const Login = (): React.JSX.Element => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
  } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setClientError(null);
    if (!email.trim()) {
      setClientError('INGRESA TU EMAIL');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setClientError('EMAIL INVALIDO');
      return;
    }
    if (!password) {
      setClientError('INGRESA TU PASSWORD');
      return;
    }
    if (password.length < 8) {
      setClientError('PASSWORD MINIMO 8 CARACTERES');
      return;
    }
    handleSubmit(e);
  };

  const displayError = clientError ?? error;

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-[#e4e4e7] overflow-hidden">
      {/* Full-viewport background image */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "url('/images/2.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          imageRendering: 'pixelated',
        }}
      />
      {/* Fixed frosted glass layer */}
      <div
        className="fixed inset-0 pointer-events-none z-0 backdrop-blur-sm"
        style={{
          background:
            'linear-gradient(to bottom, rgba(5,5,9,0.68) 0%, rgba(5,5,9,0.75) 100%)',
        }}
      />

      <nav className="relative z-10 border-b-2 border-[#1e1e2e] bg-[#0a0a0f]/60 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-14 h-24 flex items-center justify-between">
          <Link to="/">
            <img
              src="/images/Logo.png"
              alt="GymQuest"
              className="h-28 w-auto -my-6 drop-shadow-lg object-contain"
            />
          </Link>
          <Link
            to="/"
            className="font-['Press_Start_2P'] text-[8px] sm:text-[10px] text-[#a1a1aa] hover:text-green-400 border-2 border-[#1e1e2e] hover:border-green-500/50 px-3 sm:px-4 py-2 sm:py-2.5 transition-colors"
          >
            ← VOLVER
          </Link>
        </div>
      </nav>

      <main className="relative z-10 flex items-center justify-center px-4 sm:px-6 py-8 min-h-[calc(100vh-6rem)]">
        <div className="w-full max-w-sm">
          <div className="text-center mb-5 sm:mb-6">
            <h1 className="font-['Press_Start_2P'] text-lg sm:text-xl md:text-2xl text-[#e4e4e7] leading-relaxed [text-shadow:3px_3px_0_#000,-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000,0_0_22px_rgba(0,0,0,1)]">
              CONTINUA TU
              <span className="block text-green-400 mt-2 sm:mt-3 [text-shadow:3px_3px_0_#000,-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000,0_0_30px_rgba(34,197,94,1),0_0_55px_rgba(34,197,94,0.55)]">
                AVENTURA
              </span>
            </h1>
          </div>

          <form
            onSubmit={onSubmit}
            noValidate
            className="relative border-2 border-green-500/60 bg-[#0d0d14] px-6 sm:px-7 pt-6 sm:pt-7 pb-12 sm:pb-16 shadow-[0_0_0_4px_rgba(10,10,15,0.8),0_0_60px_rgba(34,197,94,0.35),0_20px_50px_rgba(0,0,0,0.8)]"
          >
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-green-500/60" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-green-500/60" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-green-500/60" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-green-500/60" />

            <div className="text-center text-sm sm:text-base font-['Press_Start_2P'] text-green-500 mb-12 tracking-widest">
              ─ LOGIN ─
            </div>

            <label className="block mb-10">
              <span className="block font-['Press_Start_2P'] text-[9px] sm:text-[10px] text-[#a1a1aa] mb-2 tracking-wider">
                EMAIL
              </span>
              <input
                type="email"
                placeholder="hero@gymquest.gg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full bg-[#12121a] border-2 border-[#1e1e2e] focus:border-green-500/70 focus:outline-none px-3 py-2.5 font-['Press_Start_2P'] text-[9px] sm:text-[10px] text-[#e4e4e7] placeholder:text-[#52525b] transition-colors"
              />
            </label>

            <label className="block mb-10">
              <span className="block font-['Press_Start_2P'] text-[9px] sm:text-[10px] text-[#a1a1aa] mb-2 tracking-wider">
                PASSWORD
              </span>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full bg-[#12121a] border-2 border-[#1e1e2e] focus:border-green-500/70 focus:outline-none pl-3 pr-11 py-2.5 font-['Press_Start_2P'] text-[9px] sm:text-[10px] text-[#e4e4e7] placeholder:text-[#52525b] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                  }
                  className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-[#71717a] hover:text-green-400 transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </label>

            {displayError && (
              <p
                role="alert"
                className="font-['VT323'] text-base sm:text-lg text-red-400 mb-4 leading-none tracking-wide border-2 border-red-500/40 bg-red-500/10 px-3 py-1"
              >
                ✕ {displayError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full font-['Press_Start_2P'] text-[10px] sm:text-xs bg-green-500 hover:bg-green-400 disabled:bg-[#1e1e2e] disabled:text-[#52525b] text-[#0a0a0f] px-6 py-3.5 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 disabled:border-b-0 disabled:active:mt-0 shadow-[0_0_16px_rgba(34,197,94,0.35)] disabled:shadow-none"
            >
              {loading ? 'CARGANDO...' : '▶ ENTRAR'}
            </button>
          </form>

          <p className="mt-6 text-center font-['Press_Start_2P'] text-[8px] sm:text-[10px] text-[#71717a] leading-loose tracking-wide">
            ¿NUEVO EN EL REINO?{' '}
            <Link
              to="/login?mode=register"
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              REGISTRATE
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};
