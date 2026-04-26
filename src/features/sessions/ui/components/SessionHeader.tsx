type SessionHeaderProps = {
  routineName?: string;
};

export const SessionHeader = ({ routineName }: SessionHeaderProps) => {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="mb-2 text-sm font-medium text-blue-400">Nueva sesión</p>
        <h1 className="text-3xl font-bold tracking-tight">
          {routineName ? `Sesión: ${routineName}` : 'Sesión libre'}
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Registra tus series y peso para cada ejercicio.
        </p>
      </div>
    </div>
  );
};
