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
    <p className="mt-6 text-center font-pixel-mono text-base text-ink-muted leading-snug">
      {props.question}{' '}
      <Link
        to={props.to}
        className="font-pixel text-[10px] tracking-widest text-green-400 hover:text-green-300 transition-colors"
      >
        {props.cta} ▸
      </Link>
    </p>
  );
};
