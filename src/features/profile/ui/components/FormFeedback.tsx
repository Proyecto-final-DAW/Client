interface FormFeedbackProps {
  error?: string | null;
  success?: string | null;
}

export const FormFeedback = ({ error, success }: FormFeedbackProps) => (
  <>
    {error && (
      <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    )}
    {success && (
      <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
        <p className="text-sm text-emerald-400">{success}</p>
      </div>
    )}
  </>
);
