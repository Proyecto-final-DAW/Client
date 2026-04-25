interface RegisterNameFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const RegisterNameField = ({
  value,
  onChange,
}: RegisterNameFieldProps): React.JSX.Element => {
  return (
    <label className="block mb-10">
      <span className="block font-['Press_Start_2P'] text-[9px] sm:text-[10px] text-[#a1a1aa] mb-2 tracking-wider">
        NOMBRE
      </span>
      <input
        type="text"
        placeholder="Hero"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="name"
        className="w-full bg-[#12121a] border-2 border-[#1e1e2e] focus:border-green-500/70 focus:outline-none px-3 py-2.5 font-['Press_Start_2P'] text-[9px] sm:text-[10px] text-[#e4e4e7] placeholder:text-[#52525b] transition-colors"
      />
    </label>
  );
};
