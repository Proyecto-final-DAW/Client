import {
  ArrowDownIcon,
  ArrowUpIcon,
  MinusIcon,
} from '@heroicons/react/24/outline';

export type Trend = 'up' | 'down' | 'flat';

const TREND_STYLES: Record<Trend, { color: string; prefix: string }> = {
  up: { color: 'text-green-400', prefix: '+' },
  down: { color: 'text-red-400', prefix: '' },
  flat: { color: 'text-[#71717a]', prefix: '' },
};

type Props = {
  trend: Trend;
  deltaPercent: number;
  previousValue: number;
};

export const TrendIndicator = (props: Props): React.JSX.Element => {
  const { color, prefix } = TREND_STYLES[props.trend];
  const iconClassName = `h-3 w-3 ${color}`;

  return (
    <span
      className={`flex items-center gap-1 font-['Press_Start_2P'] text-[9px] tracking-widest ${color}`}
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
