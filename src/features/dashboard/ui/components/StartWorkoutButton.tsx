import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

import { useRoutines } from '../../../routines/ui/hooks/useRoutines';

interface StartWorkoutButtonProps {
  size?: 'md' | 'lg';
  /**
   * When true, the button switches to a disabled "ya entrenaste hoy"
   * state. Mirrors the diet-log button so the one-session-per-day
   * server rule (POST /sessions returns 409) doesn't surprise the
   * player after the click.
   */
  trainedToday?: boolean;
}

const SIZE_CLASSES: Record<NonNullable<StartWorkoutButtonProps['size']>, string> =
  {
    md: 'text-xs sm:text-sm px-8 py-3.5',
    lg: 'text-sm sm:text-base px-10 sm:px-12 py-4 sm:py-5',
  };

export const StartWorkoutButton = ({
  size = 'md',
  trainedToday = false,
}: StartWorkoutButtonProps): React.JSX.Element => {
  const navigate = useNavigate();
  const { routines, loading } = useRoutines();
  const hasRoutines = !loading && routines.length > 0;

  if (trainedToday) {
    return (
      <button
        type="button"
        disabled
        className={`font-pixel ${SIZE_CLASSES[size]} tracking-widest bg-green-500/15 text-green-400/70 border-b-4 border-green-500/30 cursor-default inline-flex items-center justify-center gap-2`}
      >
        <CheckCircleIcon className="h-4 w-4" />
        ENTRENO COMPLETADO
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => navigate(hasRoutines ? '/routines' : '/templates')}
      disabled={loading}
      className={`font-pixel ${SIZE_CLASSES[size]} tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_18px_rgba(34,197,94,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:mt-0`}
    >
      {hasRoutines ? '▶ ENTRENAR HOY' : '▶ SELECCIONA TU RUTINA'}
    </button>
  );
};
