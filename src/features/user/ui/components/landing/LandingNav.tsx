import { Link } from 'react-router-dom';

export const LandingNav = (): React.JSX.Element => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/85 backdrop-blur-md border-b-2 border-[#1e1e2e]">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-14 h-24 flex items-center justify-between">
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
            className="font-['Press_Start_2P'] text-[8px] sm:text-[10px] text-[#a1a1aa] hover:text-green-400 border-2 border-[#1e1e2e] hover:border-green-500/50 px-3 sm:px-4 py-2 sm:py-2.5 transition-colors"
          >
            CONTINUAR
          </Link>
          <Link
            to="/register"
            className="font-['Press_Start_2P'] text-[8px] sm:text-[10px] bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-3 sm:px-5 py-2 sm:py-2.5 border-b-[3px] border-green-700 hover:border-green-600 active:border-b-0 active:mt-[3px] transition-all duration-150 shadow-[0_0_12px_rgba(34,197,94,0.3)]"
          >
            ▶ INICIAR
          </Link>
        </div>
      </div>
    </nav>
  );
};
