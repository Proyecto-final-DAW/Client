const inputBase =
  'w-full bg-[#12121a] border-2 px-3 py-2.5 font-["Press_Start_2P"] text-[9px] sm:text-[10px] text-[#e4e4e7] placeholder:text-[#52525b] focus:outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none';

interface NumericFieldProps {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  step?: string;
  min?: string;
  max?: string;
  error?: string;
  onChange: (value: string) => void;
}

export default function NumericField({
  id,
  label,
  value,
  placeholder,
  step = '1',
  min,
  max,
  error,
  onChange,
}: NumericFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block font-['Press_Start_2P'] text-[9px] sm:text-[10px] text-[#a1a1aa] mb-2 tracking-wider"
      >
        {label}
      </label>
      <input
        id={id}
        type="number"
        step={step}
        min={min}
        max={max}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputBase} ${error ? 'border-red-500/70 focus:border-red-400' : 'border-[#1e1e2e] focus:border-green-500/70'}`}
      />
      {error && (
        <p className="font-['VT323'] text-base text-red-400 mt-2 tracking-wide leading-none">
          ✕ {error}
        </p>
      )}
    </div>
  );
}
