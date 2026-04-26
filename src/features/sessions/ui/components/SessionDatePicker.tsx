type SessionDatePickerProps = {
  value: string;
  onChange: (value: string) => void;
};

export const SessionDatePicker = ({
  value,
  onChange,
}: SessionDatePickerProps) => {
  return (
    <label className="flex flex-col text-sm text-gray-300">
      Fecha de la sesión
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-gray-100 outline-none focus:border-blue-500 md:max-w-xs"
      />
    </label>
  );
};
