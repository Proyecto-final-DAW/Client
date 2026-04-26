import {
  ArrowDownIcon,
  ArrowUpIcon,
  MinusIcon,
} from '@heroicons/react/24/outline';

export type Trend = 'up' | 'down' | 'flat';

const TREND_STYLES: Record<Trend, { color: string; prefix: string }> = {
  up: { color: 'text-emerald-400', prefix: '+' },
  down: { color: 'text-rose-400', prefix: '' },
  flat: { color: 'text-zinc-400', prefix: '' },
};

type Props = {
  trend: Trend;
  deltaPercent: number;
  previousValue: number;
};

export const TrendIndicator = (props: Props): React.JSX.Element => {
  const { color, prefix } = TREND_STYLES[props.trend];
  const iconClassName = `h-4 w-4 ${color}`;

  return (
    <span
      className={`flex items-center gap-1 text-xs font-medium ${color}`}
      title={`Semana anterior: ${props.previousValue}`}
    >
      {props.trend === 'up' && <ArrowUpIcon className={iconClassName} />}
      {props.trend === 'down' && <ArrowDownIcon className={iconClassName} />}
      {props.trend === 'flat' && <MinusIcon className={iconClassName} />}
      {prefix}
      {props.deltaPercent}%
    </span>
  );
};
