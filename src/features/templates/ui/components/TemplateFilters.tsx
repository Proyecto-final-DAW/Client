import type {
  TemplateEquipment,
  TemplateGoal,
  TemplateLevel,
} from '../../core/domain/models/RoutineTemplate';
import { EQUIPMENT_OPTIONS, GOAL_OPTIONS, LEVEL_OPTIONS } from '../labels';

export type TemplateFiltersValue = {
  goal: TemplateGoal | '';
  equipment: TemplateEquipment | '';
  level: TemplateLevel | '';
};

type Props = {
  value: TemplateFiltersValue;
  onChange: (next: TemplateFiltersValue) => void;
};

const LABEL_CLASS = 'font-pixel text-[8px] tracking-widest text-ink-faint';

const SELECT_CLASS =
  'font-pixel text-[9px] tracking-widest border border-border-muted bg-transparent text-ink px-3 py-2 outline-none focus:border-green-500/60 hover:border-green-500/40 transition-colors [color-scheme:dark]';

export const TemplateFilters = (props: Props): React.JSX.Element => {
  const { value, onChange } = props;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <label className="flex flex-col gap-1.5">
        <span className={LABEL_CLASS}>OBJETIVO</span>
        <select
          className={SELECT_CLASS}
          value={value.goal}
          onChange={(e) =>
            onChange({ ...value, goal: e.target.value as TemplateGoal | '' })
          }
        >
          {GOAL_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={LABEL_CLASS}>EQUIPAMIENTO</span>
        <select
          className={SELECT_CLASS}
          value={value.equipment}
          onChange={(e) =>
            onChange({
              ...value,
              equipment: e.target.value as TemplateEquipment | '',
            })
          }
        >
          {EQUIPMENT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={LABEL_CLASS}>NIVEL</span>
        <select
          className={SELECT_CLASS}
          value={value.level}
          onChange={(e) =>
            onChange({ ...value, level: e.target.value as TemplateLevel | '' })
          }
        >
          {LEVEL_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};
