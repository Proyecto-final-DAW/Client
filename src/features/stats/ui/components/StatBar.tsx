import { motion } from 'framer-motion';

import type { StatPilar } from '../../core/domain/models/StatPilar';

interface StatBarProps {
  pilar: StatPilar;
}

export const StatBar = (props: StatBarProps): React.JSX.Element => {
  const percentage = Math.min(100, (props.pilar.value / props.pilar.max) * 100);
  const color = `var(${props.pilar.colorVar})`;
  const Icon = props.pilar.icon;

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border-2"
        style={{
          borderColor: `color-mix(in srgb, ${color} 60%, transparent)`,
          backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
        }}
      >
        <Icon className="h-5 w-5" style={{ color }} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-baseline justify-between gap-2">
          <span
            className="font-['Press_Start_2P'] text-[10px] tracking-widest uppercase"
            style={{ color }}
          >
            {props.pilar.name}
          </span>
          <span className="font-['Press_Start_2P'] text-[10px] text-[#a1a1aa]">
            LVL{' '}
            <span style={{ color }} className="font-bold">
              {Math.floor(props.pilar.level)}
            </span>
          </span>
        </div>

        <div
          className="h-3 w-full overflow-hidden rounded-sm border"
          style={{
            borderColor: `color-mix(in srgb, ${color} 35%, transparent)`,
            backgroundColor: `color-mix(in srgb, ${color} 8%, #0a0a0f)`,
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-sm"
            style={{
              backgroundColor: color,
              boxShadow: `0 0 10px ${color}`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
