import { PixelCorners } from '../../../../shared/components/PixelCorners';
import type { Exercise } from '../../core/domain/models/Exercise';

interface ExerciseCardProps {
  exercise: Exercise;
  onSelect?: (exercise: Exercise) => void;
}

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: 'PRINCIPIANTE',
  intermediate: 'INTERMEDIO',
  expert: 'AVANZADO',
};

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner: 'text-green-400 border-green-500/40 bg-green-500/10',
  intermediate: 'text-yellow-400 border-yellow-500/40 bg-yellow-500/10',
  expert: 'text-red-400 border-red-500/40 bg-red-500/10',
};

// Spanish labels for the muscle and equipment chips. The server returns the
// raw free-exercise-db vocabulary (English, lowercase), but the rest of the
// UI is in Spanish — translating at render time keeps the API stable.
const TARGET_LABEL: Record<string, string> = {
  chest: 'PECHO',
  pectorals: 'PECHO',
  lats: 'ESPALDA',
  middle_back: 'ESPALDA',
  lower_back: 'LUMBARES',
  upper_back: 'ESPALDA ALTA',
  traps: 'TRAPECIOS',
  neck: 'CUELLO',
  shoulders: 'HOMBROS',
  delts: 'HOMBROS',
  biceps: 'BICEPS',
  triceps: 'TRICEPS',
  forearms: 'ANTEBRAZOS',
  abdominals: 'ABDOMEN',
  abs: 'ABDOMEN',
  obliques: 'OBLICUOS',
  quadriceps: 'CUADRICEPS',
  quads: 'CUADRICEPS',
  hamstrings: 'ISQUIOTIBIALES',
  glutes: 'GLUTEOS',
  calves: 'GEMELOS',
  abductors: 'ABDUCTORES',
  adductors: 'ADUCTORES',
};

const EQUIPMENT_LABEL: Record<string, string> = {
  'body only': 'PESO CORPORAL',
  'barbell': 'BARRA',
  'dumbbell': 'MANCUERNA',
  'cable': 'CABLE',
  'machine': 'MAQUINA',
  'kettlebells': 'KETTLEBELL',
  'bands': 'BANDA',
  'medicine ball': 'BALON MEDICINAL',
  'exercise ball': 'PELOTA',
  'foam roll': 'FOAM ROLLER',
  'e-z curl bar': 'BARRA EZ',
  'other': 'OTRO',
};

const PIXEL_GRID_BG: React.CSSProperties = {
  backgroundImage:
    'linear-gradient(rgba(34,197,94,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.06) 1px, transparent 1px)',
  backgroundSize: '8px 8px',
};

const formatLabel = (raw: string, table: Record<string, string>): string => {
  const key = raw.toLowerCase().replace(/\s+/g, '_');
  return table[key] ?? table[raw.toLowerCase()] ?? raw.toUpperCase();
};

export const ExerciseCard = ({
  exercise,
  onSelect,
}: ExerciseCardProps): React.JSX.Element => {
  const diffColor =
    DIFFICULTY_COLOR[exercise.difficulty] ??
    'text-[#a1a1aa] border-[#3f3f46] bg-[#18181b]';
  const diffLabel =
    DIFFICULTY_LABEL[exercise.difficulty] ?? exercise.difficulty.toUpperCase();
  const targetLabel = formatLabel(exercise.target, TARGET_LABEL);
  const equipmentLabel = formatLabel(exercise.equipment, EQUIPMENT_LABEL);

  const content = (
    <>
      <PixelCorners size="sm" className="border-green-500/40" />

      <div
        className="relative flex h-28 items-center justify-center overflow-hidden border-b-2 border-[#1e1e2e] bg-[#0a0a0f] px-3"
        style={PIXEL_GRID_BG}
      >
        <span className="relative z-10 text-center font-['Press_Start_2P'] text-base sm:text-lg tracking-widest text-green-400 [text-shadow:0_0_14px_rgba(34,197,94,0.55)] uppercase break-words">
          {targetLabel}
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, rgba(0,0,0,0.18) 0 1px, transparent 1px 3px)',
          }}
        />
      </div>

      <div className="flex flex-col gap-2 p-3">
        <h3 className="font-['Press_Start_2P'] text-[10px] leading-tight text-green-400 [text-shadow:0_0_10px_rgba(34,197,94,0.5)] line-clamp-2">
          {exercise.name.toUpperCase()}
        </h3>

        <div className="flex flex-wrap gap-1.5">
          <span className="font-['Press_Start_2P'] text-[7px] tracking-widest border border-[#3f3f46] bg-[#18181b] text-[#a1a1aa] px-1.5 py-0.5 uppercase">
            {equipmentLabel}
          </span>
          <span
            className={`font-['Press_Start_2P'] text-[7px] tracking-widest border px-1.5 py-0.5 uppercase ${diffColor}`}
          >
            {diffLabel}
          </span>
        </div>
      </div>
    </>
  );

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={() => onSelect(exercise)}
        className="group relative mx-auto flex w-full max-w-[260px] flex-col overflow-hidden border-2 border-[#1e1e2e] bg-[#0d0d14] text-left transition-colors hover:border-green-500/60 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
      >
        {content}
      </button>
    );
  }

  return (
    <div className="group relative mx-auto flex w-full max-w-[260px] flex-col overflow-hidden border-2 border-[#1e1e2e] bg-[#0d0d14]">
      {content}
    </div>
  );
};
