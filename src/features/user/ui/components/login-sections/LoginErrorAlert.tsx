interface LoginErrorAlertProps {
  error?: string | null;
}

export const LoginErrorAlert = (
  props: LoginErrorAlertProps
): React.JSX.Element | null => {
  if (!props.error) return null;
  return (
    <p
      role="alert"
      className="font-pixel text-base sm:text-lg text-red-400 mb-4 leading-none tracking-wide border-2 border-red-500/40 bg-red-500/10 px-3 py-1"
    >
      ✕ {props.error}
    </p>
  );
};
