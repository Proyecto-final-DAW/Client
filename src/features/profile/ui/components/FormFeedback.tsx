interface FormFeedbackProps {
  error?: string | null;
  success?: string | null;
}

/**
 * Inline error / success feedback for form panels. Uses `font-pixel-mono`
 * (VT323) to match the standardised auth + onboarding error treatment —
 * Press Start 2P at the same point size was wrapping long messages to
 * three lines and visually dominating the form below.
 */
export const FormFeedback = (props: FormFeedbackProps): React.JSX.Element => (
  <>
    {props.error && (
      <div className="mb-4 border-2 border-red-500/40 bg-red-500/10 p-3">
        <p className="font-pixel-mono text-base sm:text-lg leading-snug text-red-300">
          {props.error}
        </p>
      </div>
    )}
    {props.success && (
      <div className="mb-4 border-2 border-green-500/40 bg-green-500/10 p-3">
        <p className="font-pixel-mono text-base sm:text-lg leading-snug text-green-300">
          {props.success}
        </p>
      </div>
    )}
  </>
);
