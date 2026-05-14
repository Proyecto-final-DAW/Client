interface LoginErrorAlertProps {
  error?: string | null;
}

/**
 * Inline error banner for the login + register forms. Uses the same
 * VT323 (font-pixel-mono) treatment as `WizardSubmitError` so all
 * top-level error surfaces in the auth + onboarding flow read as one
 * visual language. Earlier this used Press Start 2P at text-lg, which
 * was so chunky that long server messages ("ese email ya esta
 * registrado…") wrapped to three lines and dwarfed the form itself.
 */
export const LoginErrorAlert = (
  props: LoginErrorAlertProps
): React.JSX.Element | null => {
  if (!props.error) return null;
  return (
    <p
      role="alert"
      className="font-pixel-mono text-base sm:text-lg text-red-400 mb-4 leading-snug border-2 border-red-500/40 bg-red-500/10 px-3 py-2"
    >
      ✕ {props.error}
    </p>
  );
};
