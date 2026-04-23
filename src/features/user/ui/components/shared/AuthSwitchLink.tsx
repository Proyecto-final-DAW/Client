import { Link } from 'react-router-dom';

interface AuthSwitchLinkProps {
  question: string;
  cta: string;
  to: string;
}

export const AuthSwitchLink = (
  props: AuthSwitchLinkProps
): React.JSX.Element => {
  return (
    <p className="mt-6 text-center font-['Press_Start_2P'] text-[8px] sm:text-[10px] text-[#71717a] leading-loose tracking-wide">
      {props.question}{' '}
      <Link
        to={props.to}
        className="text-green-400 hover:text-green-300 transition-colors"
      >
        {props.cta}
      </Link>
    </p>
  );
};
