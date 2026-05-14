/**
 * Cardio catalog and types for the optional post-workout activity log.
 *
 * Each activity routes to one of the existing exercise stat pillars
 * (`cardio` → endurance, `explosive` → stamina, `stretch` → agility) so
 * progression.service can convert minutes + intensity into XP without a
 * new pillar.
 *
 * `supportsDistance` controls whether the form shows the distance field
 * — `true` only for activities where distance is meaningful (bike,
 * treadmill, rowing, walking).
 */

export type CardioActivityId =
  | 'BIKE'
  | 'TREADMILL'
  | 'ELLIPTICAL'
  | 'ROWING'
  | 'SWIMMING'
  | 'WALKING'
  | 'YOGA'
  | 'OTHER';

export type CardioIntensity = 'LOW' | 'MEDIUM' | 'HIGH';

/** Stat pillar an activity contributes to (matches ExerciseType backend enum). */
export type CardioStatType = 'cardio' | 'explosive' | 'stretch';

export interface CardioActivityMeta {
  id: CardioActivityId;
  label: string;
  /** Which stat pillar this activity feeds. */
  statType: CardioStatType;
  /** Show the distance input for this activity. */
  supportsDistance: boolean;
}

export const CARDIO_CATALOG: readonly CardioActivityMeta[] = [
  {
    id: 'BIKE',
    label: 'Bici',
    statType: 'cardio',
    supportsDistance: true,
  },
  {
    id: 'TREADMILL',
    label: 'Cinta',
    statType: 'cardio',
    supportsDistance: true,
  },
  {
    id: 'ELLIPTICAL',
    label: 'Eliptica',
    statType: 'cardio',
    supportsDistance: false,
  },
  {
    id: 'ROWING',
    label: 'Remo',
    statType: 'cardio',
    supportsDistance: true,
  },
  {
    id: 'SWIMMING',
    label: 'Natacion',
    statType: 'cardio',
    supportsDistance: true,
  },
  {
    id: 'WALKING',
    label: 'Caminar',
    statType: 'cardio',
    supportsDistance: true,
  },
  {
    id: 'YOGA',
    label: 'Yoga / Pilates',
    statType: 'stretch',
    supportsDistance: false,
  },
  {
    id: 'OTHER',
    label: 'Otra',
    statType: 'cardio',
    supportsDistance: false,
  },
] as const;

export const findCardioActivity = (
  id: CardioActivityId
): CardioActivityMeta | undefined => CARDIO_CATALOG.find((c) => c.id === id);

export interface CardioActivity {
  activityId: CardioActivityId;
  /**
   * Minutes done. Optional in the in-progress form so the field can
   * start blank like distance does — the user has to type or click `+`
   * to commit a value. The session payload only includes the cardio
   * entry when this is a positive number, so a forgotten/blank entry
   * never reaches the server.
   */
  durationMinutes?: number;
  intensity: CardioIntensity;
  /** Optional. Only meaningful for activities where supportsDistance is true. */
  distanceKm?: number;
}
