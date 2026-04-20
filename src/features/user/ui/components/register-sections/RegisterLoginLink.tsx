import { Link } from 'react-router-dom';

interface RegisterLoginLinkProps {
  to?: string;
}

export const RegisterLoginLink = ({
  to = '/login',
}: RegisterLoginLinkProps): React.JSX.Element => {
  return (
    <p className="mt-6 text-center font-['Press_Start_2P'] text-[8px] sm:text-[10px] text-[#71717a] leading-loose tracking-wide">
      ¿YA TIENES CUENTA?{' '}
      <Link
        to={to}
        className="text-green-400 hover:text-green-300 transition-colors"
      >
        INICIA SESIÓN
      </Link>
    </p>
  );
};
