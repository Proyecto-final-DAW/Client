import { Link } from 'react-router-dom';

interface NavProps {
  backTo?: string;
}

export const Nav = (props: NavProps): React.JSX.Element => {
  return (
    // Header `h-16` on mobile / `h-24` from sm. The fixed h-24 was eating
    // ~25% of a 320-360px tall phone viewport on the login screen and
    // pushing the form below the fold. Logo scales down with the bar.
    <nav className="relative z-10 border-b-2 border-border bg-page/60 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-10 lg:px-14 h-16 sm:h-24 flex items-center justify-between">
        <Link to="/">
          <img
            src="/images/Logo.webp"
            alt="GymQuest"
            className="h-16 sm:h-28 w-auto -my-3 sm:-my-6 drop-shadow-lg object-contain"
          />
        </Link>
        <Link
          to={props.backTo ?? '/'}
          className="font-pixel text-[10px] sm:text-xs text-ink-muted hover:text-green-400 border-2 border-border hover:border-green-500/50 px-3 sm:px-4 py-2 sm:py-2.5 transition-colors"
        >
          ← VOLVER
        </Link>
      </div>
    </nav>
  );
};
