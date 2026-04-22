interface WizardSubmitErrorProps {
  error: string | null;
}

export default function WizardSubmitError({ error }: WizardSubmitErrorProps) {
  if (!error) return null;
  return (
    <p
      role="alert"
      className="font-['VT323'] text-base sm:text-lg text-red-400 mt-4 leading-none tracking-wide border-2 border-red-500/40 bg-red-500/10 px-3 py-1"
    >
      ✕ {error}
    </p>
  );
}
