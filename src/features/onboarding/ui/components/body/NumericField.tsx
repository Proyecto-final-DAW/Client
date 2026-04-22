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

export const NumericField = (props: NumericFieldProps): React.JSX.Element => {
  return (
    <div>
      <label
        htmlFor={props.id}
        className="block font-['Press_Start_2P'] text-[9px] sm:text-[10px] text-[#a1a1aa] mb-2 tracking-wider"
      >
        {props.label}
      </label>
      <input
        id={props.id}
        type="number"
        step={props.step ?? '1'}
        min={props.min}
        max={props.max}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className={`${inputBase} ${props.error ? 'border-red-500/70 focus:border-red-400' : 'border-[#1e1e2e] focus:border-green-500/70'}`}
      />
      {props.error && (
        <p className="font-['VT323'] text-base text-red-400 mt-2 tracking-wide leading-none">
          ✕ {props.error}
        </p>
      )}
    </div>
  );
};
