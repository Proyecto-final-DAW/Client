import type {
  OnboardingFormData,
  FormErrors,
} from '../../core/domain/models/OnboardingFormData';

interface StepBodyProps {
  data: OnboardingFormData;
  errors: FormErrors;
  onChange: (field: keyof OnboardingFormData, value: string) => void;
}

export default function StepBody({ data, errors, onChange }: StepBodyProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-zinc-100 mb-2">Tu cuerpo</h2>
      <p className="text-zinc-400 text-sm mb-8">
        Estos datos nos permiten calcular tu metabolismo basal.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label
            htmlFor="weight"
            className="block text-sm font-medium text-zinc-300 mb-2"
          >
            Peso (kg)
          </label>
          <input
            id="weight"
            type="number"
            step="0.1"
            min="30"
            max="250"
            placeholder="75"
            value={data.weight}
            onChange={(e) => onChange('weight', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl bg-zinc-800 border text-zinc-100 placeholder-zinc-500 outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${errors.weight ? 'border-red-500 focus:border-red-400' : 'border-zinc-700 focus:border-emerald-500'}`}
          />
          {errors.weight && (
            <p className="text-red-400 text-sm mt-1.5">{errors.weight}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="height"
            className="block text-sm font-medium text-zinc-300 mb-2"
          >
            Altura (cm)
          </label>
          <input
            id="height"
            type="number"
            step="1"
            min="120"
            max="230"
            placeholder="175"
            value={data.height}
            onChange={(e) => onChange('height', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl bg-zinc-800 border text-zinc-100 placeholder-zinc-500 outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${errors.height ? 'border-red-500 focus:border-red-400' : 'border-zinc-700 focus:border-emerald-500'}`}
          />
          {errors.height && (
            <p className="text-red-400 text-sm mt-1.5">{errors.height}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Sexo biológico
        </label>
        <p className="text-zinc-500 text-xs mb-3">
          Necesario para el cálculo metabólico, no define tu identidad.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              { value: 'male', label: 'Hombre', icon: '♂' },
              { value: 'female', label: 'Mujer', icon: '♀' },
            ] as const
          ).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange('sex', option.value)}
              className={`py-4 rounded-xl border text-center font-semibold transition-all duration-200 ${data.sex === option.value ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-500'}`}
            >
              <span className="text-2xl block mb-1">{option.icon}</span>
              <span className="text-sm">{option.label}</span>
            </button>
          ))}
        </div>
        {errors.sex && (
          <p className="text-red-400 text-sm mt-2">{errors.sex}</p>
        )}
      </div>
    </div>
  );
}
