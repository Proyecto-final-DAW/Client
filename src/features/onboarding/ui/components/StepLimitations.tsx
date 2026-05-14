import type {
  OnboardingFormData,
  FormErrors,
  Injury,
} from '../../core/domain/models/OnboardingFormData';
import { InjuryCard, type InjuryOption } from './limitations/InjuryCard';

interface StepLimitationsProps {
  data: OnboardingFormData;
  errors: FormErrors;
  onChange: (field: keyof OnboardingFormData, value: string | string[]) => void;
}

const injuryOptions: InjuryOption[] = [
  {
    value: 'NONE',
    title: 'NINGUNA',
    description: 'Sin restricciones.',
    icon: '✅',
  },
  {
    value: 'KNEE',
    title: 'RODILLA',
    description: 'Sin impacto ni sentadillas profundas.',
    icon: '🦵',
  },
  {
    value: 'BACK',
    title: 'ESPALDA',
    description: 'Cuidamos carga axial.',
    icon: '🧍',
  },
  {
    value: 'SHOULDER',
    title: 'HOMBRO',
    description: 'Sin press vertical agresivo.',
    icon: '💪',
  },
  {
    value: 'OTHER',
    title: 'OTRA',
    description: 'Cuentanos los detalles.',
    icon: '⚠️',
  },
];

const MAX_INJURY_NOTES_LENGTH = 200;

export const StepLimitations = (
  props: StepLimitationsProps
): React.JSX.Element => {
  const selected = props.data.injuries ?? [];
  const otherSelected = selected.includes('OTHER');

  const toggle = (value: Injury) => {
    let next: Injury[];
    if (value === 'NONE') {
      next = selected.includes('NONE') ? [] : ['NONE'];
    } else if (selected.includes(value)) {
      next = selected.filter((v) => v !== value);
    } else {
      next = [...selected.filter((v) => v !== 'NONE'), value];
    }
    props.onChange('injuries', next);
    // When deselecting OTRA, drop any free-text notes the user may have
    // typed — a stale "tendon aquiles" sitting in storage after the
    // user changes their mind would be confusing on a future reload.
    if (value === 'OTHER' && !next.includes('OTHER')) {
      props.onChange('injuryNotes', '');
    }
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.onChange('injuryNotes', event.target.value);
  };

  return (
    <div>
      <h2 className="text-center font-pixel text-base sm:text-lg text-ink mb-3 leading-tight tracking-wider [text-shadow:0_0_12px_rgba(34,197,94,0.35)]">
        ¿TIENES <span className="text-green-400">LIMITACIONES?</span>
      </h2>
      <p className="text-center font-pixel-mono text-base text-ink-muted mb-5 leading-tight">
        Puedes elegir una o mas.
      </p>

      {/* All five options share the same row width — the previous version
          isolated "NINGUNA" on its own full-width row, which made it
          visually larger than the other four cards laid out in 2 columns
          below it. A single 1-col stack keeps every card the same shape
          regardless of which one is the default. */}
      <div className="flex flex-col gap-3">
        {injuryOptions.map((option) => (
          <InjuryCard
            key={option.value}
            option={option}
            isSelected={selected.includes(option.value)}
            onToggle={toggle}
          />
        ))}
      </div>

      {/* Free-text detail revealed when the user marks OTRA. Optional —
          empty submission is fine. The value travels in localStorage but
          is not yet sent to the server (mapper ignores it on purpose). */}
      {otherSelected && (
        <div className="mt-3">
          <label
            htmlFor="injuryNotes"
            className="block font-pixel text-[9px] sm:text-[10px] text-ink-muted mb-2 tracking-wider"
          >
            ¿CUAL ES TU LESION?
          </label>
          <textarea
            id="injuryNotes"
            value={props.data.injuryNotes ?? ''}
            onChange={handleNotesChange}
            maxLength={MAX_INJURY_NOTES_LENGTH}
            placeholder="Ej: tendinitis en codo, hernia cervical…"
            rows={3}
            className="w-full bg-subtle border-2 border-border focus:border-green-500/70 px-4 py-3 font-pixel-mono text-base text-ink placeholder:text-ink-disabled focus:outline-none transition-colors resize-none"
          />
          <p className="mt-1 font-pixel-mono text-base text-ink-faint leading-tight">
            {(props.data.injuryNotes ?? '').length}/{MAX_INJURY_NOTES_LENGTH}
          </p>
        </div>
      )}

      {props.errors.injuries && (
        <p className="font-pixel-mono text-base text-red-400 mt-3 tracking-wide leading-none">
          ✕ {props.errors.injuries}
        </p>
      )}
    </div>
  );
};
