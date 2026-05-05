interface FormFeedbackProps {
  error?: string | null;
  success?: string | null;
}

export const FormFeedback = (props: FormFeedbackProps): React.JSX.Element => (
  <>
    {props.error && (
      <div className="mb-4 border-2 border-red-500/40 bg-red-500/10 p-3">
        <p className="font-pixel text-base text-red-300">{props.error}</p>
      </div>
    )}
    {props.success && (
      <div className="mb-4 border-2 border-green-500/40 bg-green-500/10 p-3">
        <p className="font-pixel text-base text-green-300">{props.success}</p>
      </div>
    )}
  </>
);
