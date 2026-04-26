import type { Trend } from './TrendIndicator';
import { TrendIndicator } from './TrendIndicator';

type Props = {
  label: string;
  formattedValue: string;
  currentValue: number;
  previousValue: number;
};

const computeTrend = (currentValue: number, previousValue: number): Trend => {
  if (currentValue > previousValue) return 'up';
  if (currentValue < previousValue) return 'down';
  return 'flat';
};

const computeDeltaPercent = (
  currentValue: number,
  previousValue: number
): number => {
  if (previousValue === 0) return currentValue === 0 ? 0 : 100;
  return Math.round(((currentValue - previousValue) / previousValue) * 100);
};

export const SummaryRow = (props: Props): React.JSX.Element => {
  const trend = computeTrend(props.currentValue, props.previousValue);
  const deltaPercent = computeDeltaPercent(
    props.currentValue,
    props.previousValue
  );

  return (
    <div className="flex items-center justify-between border-b border-zinc-800 py-2 last:border-b-0">
      <span className="text-sm text-zinc-300">{props.label}</span>
      <div className="flex items-center gap-3">
        <span className="text-base font-semibold text-zinc-100">
          {props.formattedValue}
        </span>
        <TrendIndicator
          trend={trend}
          deltaPercent={deltaPercent}
          previousValue={props.previousValue}
        />
      </div>
    </div>
  );
};
