type Props = {
  applying: boolean;
  onSkip: () => void;
  onApply: () => void;
};

export const TemplateActions = (props: Props): React.JSX.Element => {
  return (
    <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-end">
      <button
        type="button"
        onClick={props.onSkip}
        disabled={props.applying}
        className="font-['Press_Start_2P'] text-[9px] tracking-widest border-2 border-[#1e1e2e] bg-[#0d0d14] text-[#a1a1aa] px-5 py-3 hover:border-green-500/40 hover:text-green-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        OMITIR
      </button>
      <button
        type="button"
        onClick={props.onApply}
        disabled={props.applying}
        className="font-['Press_Start_2P'] text-[9px] tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-6 py-3 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(34,197,94,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:mt-0"
      >
        {props.applying ? 'CREANDO...' : '▶ USAR ESTA RUTINA'}
      </button>
    </div>
  );
};
