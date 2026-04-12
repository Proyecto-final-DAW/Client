import type {
  OnboardingFormData,
  FormErrors,
} from '../../core/domain/models/OnboardingFormData';
import type { SelectableOption } from '../../core/domain/models/SelectableOption';
import SelectableCardGroup from './SelectableCardGroup';

interface StepLimitationsProps {
  data: OnboardingFormData;
  errors: FormErrors;
  onChange: (field: keyof OnboardingFormData, value: string) => void;
}

const injuryOptions: SelectableOption[] = [
  {
    value: 'none',
    title: 'NINGUNA',
    description: 'Cuerpo listo para entrenar sin restricciones.',
    icon: '✅',
  },
  {
    value: 'knee',
    title: 'RODILLA',
    description: 'Evitamos impacto y sentadillas profundas sin control.',
    icon: '🦵',
  },
  {
    value: 'back',
    title: 'ESPALDA',
    description: 'Ajustamos carga axial y priorizamos técnica.',
    icon: '🧍',
  },
  {
    value: 'shoulder',
    title: 'HOMBRO',
    description: 'Limitamos press vertical agresivo.',
    icon: '💪',
  },
  {
    value: 'other',
    title: 'OTRA',
    description: 'Lo indicarás al configurar cada rutina.',
    icon: '⚠️',
  },
];

export default function StepLimitations({
  data,
  errors,
  onChange,
}: StepLimitationsProps) {
  return (
    <div>
      <h2 className="text-center font-['Press_Start_2P'] text-sm sm:text-base text-[#e4e4e7] mb-2 leading-relaxed tracking-wider">
        ¿TIENES <span className="text-green-400">LIMITACIONES?</span>
      </h2>
      <p className="text-center font-['VT323'] text-base sm:text-lg text-[#a1a1aa] mb-5 tracking-wide leading-tight">
        Adaptamos el plan para cuidar tu cuerpo.
      </p>

      <SelectableCardGroup
        options={injuryOptions}
        selected={data.injury ?? null}
        onSelect={(value) => onChange('injury', value)}
        error={errors.injury}
      />
    </div>
  );
}
