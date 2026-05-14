interface AuthTitleProps {
  topText: string;
  highlightText: string;
}

export const AuthTitle = (props: AuthTitleProps): React.JSX.Element => {
  return (
    <div className="text-center mb-5 sm:mb-6">
      <h1 className="font-pixel text-base sm:text-lg md:text-xl text-ink leading-tight [text-shadow:2px_2px_0_#000,0_0_18px_rgba(0,0,0,0.85)]">
        {props.topText}
        <span className="block text-green-400 mt-2 [text-shadow:2px_2px_0_#000,0_0_22px_rgba(34,197,94,0.55)]">
          {props.highlightText}
        </span>
      </h1>
    </div>
  );
};
