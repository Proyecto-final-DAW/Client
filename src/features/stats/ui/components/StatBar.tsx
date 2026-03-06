import type { StatPilar } from '../../core/domain/models/StatPilar';

interface StatBarProps {
  pilar: StatPilar;
}

export const StatBar = ({ pilar }: StatBarProps) => {
  const percentage = (pilar.value / pilar.max) * 100;
  const color = `var(${pilar.colorVar})`;

  return (
    <div className="flex items-center gap-3">
      {/* Icono */}
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg"
        style={{
          backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
        }}
      >
        {pilar.icon}
      </div>

      {/* Info + Barra */}
      <div className="min-w-0 flex-1">
        {/* Header: nombre y valor */}
        <div className="mb-1.5 flex items-baseline justify-between">
          <span className="text-sm font-bold text-foreground">
            {pilar.name}
          </span>
          <span className="font-mono text-sm font-bold" style={{ color }}>
            {pilar.value}
            <span className="font-normal text-muted-foreground">
              /{pilar.max}
            </span>
          </span>
        </div>

        {/* Track */}
        <div
          className="h-[5px] w-full overflow-hidden rounded-full"
          style={{
            backgroundColor: `color-mix(in srgb, ${color} 12%, var(--muted))`,
          }}
        >
          {/* Fill */}
          <div
            className="h-full rounded-full transition-[width] duration-700 ease-out"
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
            }}
          />
        </div>
      </div>
    </div>
  );
};
