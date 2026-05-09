import { motion } from 'framer-motion';

import {
  PixelSelect,
  type PixelSelectOption,
} from '@shared/components/PixelSelect';
import {
  CARDIO_CATALOG,
  findCardioActivity,
  type CardioActivity,
  type CardioActivityId,
  type CardioIntensity,
} from '../../core/domain/models/CardioActivity';

interface CardioActivityFormProps {
  /** Current cardio entry; null when the user hasn't enabled cardio. */
  value: CardioActivity | null;
  onChange: (value: CardioActivity | null) => void;
}

interface PixelStepperProps {
  value: number | undefined;
  onChange: (next: number | undefined) => void;
  step: number;
  min: number;
  max: number;
  decimal?: boolean;
  placeholder?: string;
  ariaLabel: string;
}

/**
 * Number input flanked by `−` / `+` buttons. Keyboard typing still
 * works (the input remains the source of truth); the buttons are a
 * thumb-friendly path on mobile where typing decimals is fiddly.
 *
 * `value === undefined` is the empty state for optional fields like
 * distance — `+` from undefined snaps to `min + step`, `−` is a
 * no-op so the user can clear by deleting characters and stay clear.
 */
const PixelStepper = ({
  value,
  onChange,
  step,
  min,
  max,
  decimal = false,
  placeholder,
  ariaLabel,
}: PixelStepperProps): React.JSX.Element => {
  const display = value === undefined ? '' : String(value);

  const round = (n: number): number =>
    decimal ? Math.round(n * 10) / 10 : Math.floor(n);

  const decrement = (): void => {
    if (value === undefined) return;
    const next = round(Math.max(min, value - step));
    onChange(next);
  };

  const increment = (): void => {
    // First click from empty lands at `step` (5 for minutos, 0.5 for
    // km) rather than `min + step`, so the entry point is a natural
    // round number. With min=1 and step=5 the old code jumped to 6,
    // which felt wrong as the *first* visible value the user sees.
    if (value === undefined) {
      onChange(round(Math.min(max, step)));
      return;
    }
    const next = round(Math.min(max, value + step));
    onChange(next);
  };

  return (
    <div className="flex items-stretch border-2 border-border bg-subtle focus-within:border-green-500/70 transition-colors">
      <button
        type="button"
        onClick={decrement}
        aria-label={`${ariaLabel}: disminuir`}
        className="px-4 font-pixel text-lg text-green-500 hover:bg-green-500/10 active:bg-green-500/20 transition-colors border-r-2 border-border disabled:opacity-30 disabled:cursor-not-allowed"
        disabled={value === undefined || value <= min}
      >
        −
      </button>
      <input
        type="number"
        inputMode={decimal ? 'decimal' : 'numeric'}
        min={min}
        max={max}
        step={step}
        value={display}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === '') {
            onChange(undefined);
            return;
          }
          const n = Number(raw);
          if (!Number.isFinite(n)) return;
          onChange(round(n));
        }}
        className="flex-1 min-w-0 bg-transparent px-3 py-3 font-pixel-mono text-2xl text-ink text-center placeholder:text-ink-disabled focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={increment}
        aria-label={`${ariaLabel}: aumentar`}
        className="px-4 font-pixel text-lg text-green-500 hover:bg-green-500/10 active:bg-green-500/20 transition-colors border-l-2 border-border disabled:opacity-30 disabled:cursor-not-allowed"
        disabled={value !== undefined && value >= max}
      >
        +
      </button>
    </div>
  );
};

const INTENSITY_OPTIONS: ReadonlyArray<{
  id: CardioIntensity;
  label: string;
}> = [
  { id: 'LOW', label: 'BAJA' },
  { id: 'MEDIUM', label: 'MEDIA' },
  { id: 'HIGH', label: 'ALTA' },
];

const ACTIVITY_OPTIONS: PixelSelectOption[] = CARDIO_CATALOG.map((c) => ({
  value: c.id,
  label: c.label,
}));

// Minutes and distance start blank (undefined) so the user enters
// real values rather than rubber-stamping a placeholder. Type and
// intensity keep defaults because they're always something — there's
// no "no type" or "no intensity" state, and forcing 3 selections
// before logging cardio felt punishing.
const DEFAULT_ENTRY: CardioActivity = {
  activityId: 'BIKE',
  intensity: 'MEDIUM',
};

/**
 * Optional post-workout cardio log. Lives at the bottom of the workout
 * summary so the user can record any aerobic / explosive / mobility
 * work they did *after* the strength session, feeding endurance /
 * stamina / agility XP that the strength portion of the workout doesn't
 * touch.
 *
 * Toggle-collapsed by default — one click, no friction for users who
 * went straight to the showers.
 */
export const CardioActivityForm = ({
  value,
  onChange,
}: CardioActivityFormProps): React.JSX.Element => {
  const enabled = value !== null;
  const entry = value ?? DEFAULT_ENTRY;
  const meta = findCardioActivity(entry.activityId);
  const showDistance = meta?.supportsDistance ?? false;

  const toggleEnabled = (): void => {
    if (enabled) {
      onChange(null);
    } else {
      onChange({ ...DEFAULT_ENTRY });
    }
  };

  const update = (patch: Partial<CardioActivity>): void => {
    onChange({ ...entry, ...patch });
  };

  return (
    <section className="relative border-2 border-green-500/40 bg-[#08080d]/95 backdrop-blur-md p-5 shadow-[0_4px_22px_rgba(0,0,0,0.55)]">
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="font-pixel text-xs sm:text-sm tracking-widest text-green-400 [text-shadow:0_0_10px_rgba(34,197,94,0.45)]">
            ◆ ACTIVIDAD CARDIO
          </p>
          <p className="mt-2 font-pixel-mono text-base sm:text-lg text-ink-muted">
            ¿Hiciste cardio despues del entreno?
          </p>
        </div>
        <button
          type="button"
          onClick={toggleEnabled}
          aria-pressed={enabled}
          className={`shrink-0 font-pixel text-[10px] tracking-widest border-2 px-4 py-2.5 transition-colors ${
            enabled
              ? 'border-green-500/70 bg-green-500/15 text-green-400 shadow-[0_0_12px_rgba(34,197,94,0.35)]'
              : 'border-border bg-card text-ink-muted hover:border-green-500/40 hover:text-green-400'
          }`}
        >
          {enabled ? '✓ SI' : '+ AÑADIR'}
        </button>
      </header>

      {enabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 flex flex-col gap-4 overflow-hidden"
        >
          {/* Type */}
          <div>
            <label className="block font-pixel text-[9px] tracking-widest text-ink-faint mb-2">
              TIPO
            </label>
            <PixelSelect
              ariaLabel="Tipo de cardio"
              placeholder="Elige una actividad"
              options={ACTIVITY_OPTIONS}
              value={entry.activityId}
              onChange={(next) => {
                const nextMeta = findCardioActivity(next as CardioActivityId);
                update({
                  activityId: next as CardioActivityId,
                  // Drop distance if the new activity doesn't support it.
                  distanceKm: nextMeta?.supportsDistance
                    ? entry.distanceKm
                    : undefined,
                });
              }}
            />
          </div>

          {/* Minutos + Distancia row — twin numeric inputs sit side
              by side. Distancia is conditional on the activity (only
              run/bike/swim/etc. support it); when hidden the col2
              cell is left empty, which keeps minutes pinned to the
              left half instead of stretching across the form. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-pixel text-[9px] tracking-widest text-ink-faint mb-2">
                MINUTOS
              </label>
              <PixelStepper
                ariaLabel="Minutos de cardio"
                value={entry.durationMinutes}
                step={5}
                min={1}
                max={300}
                placeholder="Ej. 20"
                onChange={(next) => update({ durationMinutes: next })}
              />
            </div>

            {showDistance && (
              <div>
                <label className="block font-pixel text-[9px] tracking-widest text-ink-faint mb-2">
                  DISTANCIA (KM)
                </label>
                <PixelStepper
                  ariaLabel="Distancia en kilometros"
                  value={entry.distanceKm}
                  step={0.5}
                  min={0}
                  max={500}
                  decimal
                  placeholder="Ej. 8.5"
                  onChange={(next) => update({ distanceKm: next })}
                />
              </div>
            )}
          </div>

          {/* Intensidad row — own row, full width. The 3 options need
              breathing room (BAJA / MEDIA / ALTA) and squeezing them
              into a 50% sub-column was making the labels touch the
              chip borders. */}
          <div>
            <span className="block font-pixel text-[9px] tracking-widest text-ink-faint mb-2">
              INTENSIDAD
            </span>
            <div
              role="radiogroup"
              aria-label="Intensidad"
              className="grid grid-cols-3 gap-2"
            >
              {INTENSITY_OPTIONS.map((opt) => {
                const isActive = entry.intensity === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => update({ intensity: opt.id })}
                    className={`font-pixel text-[10px] tracking-widest border-2 px-2 py-3 transition-colors ${
                      isActive
                        ? 'border-green-500/70 bg-green-500/15 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.35)]'
                        : 'border-border bg-card text-ink-muted hover:border-green-500/40 hover:text-green-400'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
};
