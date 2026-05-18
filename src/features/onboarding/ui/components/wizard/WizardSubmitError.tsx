interface WizardSubmitErrorProps {
  error: string | null;
}

export const WizardSubmitError = (
  props: WizardSubmitErrorProps
): React.JSX.Element | null => {
  if (!props.error) return null;
  return (
    <p
      role="alert"
      className="font-pixel-mono text-base text-red-400 mt-4 leading-snug border-2 border-red-500/40 bg-red-500/10 px-4 py-3"
    >
      ✕ {props.error}
    </p>
  );
};
