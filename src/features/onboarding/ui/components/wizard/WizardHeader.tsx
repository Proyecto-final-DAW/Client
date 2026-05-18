interface WizardHeaderProps {
  /** When true, the welcome headline is rendered. On follow-up steps the
   *  caller passes false so the user doesn't see "FORJA TU LEYENDA" six
   *  times in a row — only the slim eyebrow remains. */
  showWelcome: boolean;
}

/**
 * Wizard header. Welcome treatment on step 1 (full headline); slim
 * eyebrow on subsequent steps so the form gets the vertical real estate
 * it actually needs.
 */
export const WizardHeader = ({
  showWelcome,
}: WizardHeaderProps): React.JSX.Element => {
  if (!showWelcome) {
    return (
      <div className="text-center mb-3">
        <p className="font-pixel text-[8px] sm:text-[9px] tracking-widest text-green-500 [text-shadow:0_0_8px_rgba(34,197,94,0.4)]">
          FORJANDO TU LEYENDA
        </p>
      </div>
    );
  }

  return (
    <div className="text-center mb-4 sm:mb-5">
      {/* "GYMQUEST" eyebrow removed — the brand already lives in the
          page header (and on every other route), so an extra
          GYMQUEST line above the headline was just visual noise that
          pushed FORJA TU LEYENDA further down the fold. */}
      <h1 className="font-pixel text-sm sm:text-base md:text-lg text-white leading-tight [text-shadow:2px_2px_0_#000,0_0_18px_rgba(0,0,0,0.85)]">
        FORJA TU
        <span className="block text-green-400 mt-2 [text-shadow:2px_2px_0_#000,0_0_22px_rgba(34,197,94,0.55)]">
          LEYENDA
        </span>
      </h1>
    </div>
  );
};
