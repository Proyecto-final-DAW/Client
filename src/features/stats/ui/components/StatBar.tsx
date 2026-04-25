import type { StatPilar } from '../../core/domain/models/StatPilar';

interface StatBarProps {
  pilar: StatPilar;
}

export const StatBar = (props: StatBarProps): React.JSX.Element => {
  const percentage = (props.pilar.value / props.pilar.max) * 100;
  const color = `var(${props.pilar.colorVar})`;
  const Icon = props.pilar.icon;

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
        style={{
          backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
        }}
      >
        <Icon className="h-5 w-5" style={{ color }} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-baseline justify-between">
          <span className="text-sm font-bold text-foreground">
            {props.pilar.name}
          </span>
          <span className="font-mono text-sm font-bold" style={{ color }}>
            {props.pilar.value}
            <span className="font-normal text-muted-foreground">
              /{props.pilar.max}
            </span>
          </span>
        </div>

        <div
          className="h-[5px] w-full overflow-hidden rounded-full"
          style={{
            backgroundColor: `color-mix(in srgb, ${color} 12%, var(--muted))`,
          }}
        >
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
