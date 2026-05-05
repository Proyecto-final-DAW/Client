interface AuthTitleProps {
  topText: string;
  highlightText: string;
}

export const AuthTitle = (props: AuthTitleProps): React.JSX.Element => {
  return (
    <div className="text-center mb-5 sm:mb-6">
      <h1 className="font-pixel text-lg sm:text-xl md:text-2xl text-ink leading-relaxed [text-shadow:3px_3px_0_#000,-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000,0_0_22px_rgba(0,0,0,1)]">
        {props.topText}
        <span className="block text-green-400 mt-2 sm:mt-3 [text-shadow:3px_3px_0_#000,-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000,0_0_30px_rgba(34,197,94,1),0_0_55px_rgba(34,197,94,0.55)]">
          {props.highlightText}
        </span>
      </h1>
    </div>
  );
};
