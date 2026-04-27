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

const SELECT_CLASS =
  "font-['Press_Start_2P'] text-[9px] tracking-widest border-2 border-[#1e1e2e] bg-[#0d0d14] text-[#e4e4e7] px-3 py-2.5 outline-none focus:border-green-500/60";

export const TemplateFilters = (props: Props): React.JSX.Element => {
  const { value, onChange } = props;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <label className="flex flex-col gap-1.5">
        <span className="font-['Press_Start_2P'] text-[8px] tracking-widest text-[#a1a1aa]">
          OBJETIVO
        </span>
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
        <span className="font-['Press_Start_2P'] text-[8px] tracking-widest text-[#a1a1aa]">
          EQUIPAMIENTO
        </span>
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
        <span className="font-['Press_Start_2P'] text-[8px] tracking-widest text-[#a1a1aa]">
          NIVEL
        </span>
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
