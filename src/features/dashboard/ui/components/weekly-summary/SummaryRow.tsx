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
    <div className="flex items-center justify-between border-b-2 border-[#1e1e2e] py-3 last:border-b-0">
      <span className="font-['Press_Start_2P'] text-[9px] tracking-widest text-[#a1a1aa]">
        {props.label.toUpperCase()}
      </span>
      <div className="flex items-center gap-3">
        <span className="font-['Press_Start_2P'] text-xs text-green-400 [text-shadow:0_0_8px_rgba(34,197,94,0.4)]">
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
