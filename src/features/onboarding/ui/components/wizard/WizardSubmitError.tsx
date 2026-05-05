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
      className="font-pixel text-base sm:text-lg text-red-400 mt-4 leading-none tracking-wide border-2 border-red-500/40 bg-red-500/10 px-3 py-1"
    >
      ✕ {props.error}
    </p>
  );
};
