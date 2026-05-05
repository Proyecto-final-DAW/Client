import { useNavigate } from 'react-router-dom';

import { useRoutines } from '../../../routines/ui/hooks/useRoutines';

export const StartWorkoutButton = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { routines, loading } = useRoutines();
  const hasRoutines = !loading && routines.length > 0;

  return (
    <button
      type="button"
      onClick={() => navigate('/routines')}
      disabled={loading}
      className="font-pixel text-xs sm:text-sm tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-8 py-3.5 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_18px_rgba(34,197,94,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:mt-0"
    >
      {hasRoutines ? '▶ ENTRENAR HOY' : '▶ CREAR RUTINA'}
    </button>
  );
};
