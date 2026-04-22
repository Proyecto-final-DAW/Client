import { Link } from 'react-router-dom';

export const LoginRegisterLink = (): React.JSX.Element => {
  return (
    <p className="mt-6 text-center font-['Press_Start_2P'] text-[8px] sm:text-[10px] text-[#71717a] leading-loose tracking-wide">
      ¿NUEVO EN EL REINO?{' '}
      <Link
        to={'/register'}
        className="text-green-400 hover:text-green-300 transition-colors"
      >
        REGISTRATE
      </Link>
    </p>
  );
};
