import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
} from '@heroicons/react/24/solid';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export const WizardNavigation = (
  props: WizardNavigationProps
): React.JSX.Element => {
  const isLast = props.currentStep === props.totalSteps;

  return (
    <div className="flex gap-3 mt-6">
      {props.currentStep > 1 && (
        <button
          type="button"
          onClick={props.onPrev}
          disabled={props.isSubmitting}
          className="inline-flex items-center gap-2 font-pixel text-[9px] sm:text-[10px] text-ink-muted hover:text-green-400 border-2 border-border hover:border-green-500/50 px-4 py-3 transition-colors disabled:opacity-50"
        >
          <ArrowLeftIcon className="h-3 w-3" />
          ATRAS
        </button>
      )}
      <button
        type="button"
        onClick={props.onNext}
        disabled={props.isSubmitting}
        className="flex-1 inline-flex items-center justify-center gap-2 font-pixel text-[10px] sm:text-xs bg-green-500 hover:bg-green-400 disabled:bg-[#1e1e2e] disabled:text-ink-disabled text-[#0a0a0f] px-6 py-3.5 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 disabled:border-b-0 disabled:active:mt-0 shadow-[0_0_16px_rgba(34,197,94,0.35)] disabled:shadow-none"
      >
        {props.isSubmitting ? (
          'GUARDANDO...'
        ) : isLast ? (
          <>
            FINALIZAR
            <CheckIcon className="h-3 w-3" />
          </>
        ) : (
          <>
            SIGUIENTE
            <ArrowRightIcon className="h-3 w-3" />
          </>
        )}
      </button>
    </div>
  );
};
