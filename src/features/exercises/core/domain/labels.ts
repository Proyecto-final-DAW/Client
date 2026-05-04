// User-facing translations for the raw vocabulary returned by the exercise
// API (English, lowercase, free-exercise-db conventions). Lives in `core/domain`
// instead of inside a UI component because more than one component renders
// these — the exercise picker card and the live workout header at minimum —
// and divergent translations would be a real UX bug.

export const TARGET_LABEL: Record<string, string> = {
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

export const EQUIPMENT_LABEL: Record<string, string> = {
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

export const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: 'PRINCIPIANTE',
  intermediate: 'INTERMEDIO',
  expert: 'AVANZADO',
};

/**
 * Translates a raw API value into its user-facing label. Falls back to the
 * uppercased raw value when the vocabulary expands upstream so we never
 * render an empty chip.
 */
export const formatLabel = (
  raw: string,
  table: Record<string, string>
): string => {
  if (!raw) return '';
  const key = raw.toLowerCase().replace(/\s+/g, '_');
  return table[key] ?? table[raw.toLowerCase()] ?? raw.toUpperCase();
};
