import {
  PixelSelect,
  type PixelSelectOption,
} from '@shared/components/PixelSelect';

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

// The labels arrays from `../labels` already include the empty-value
// option as their first entry (e.g. "Todos los objetivos") so they map
// directly to PixelSelect — the placeholder string is only shown if no
// such empty option is present, which would never happen here.
const toOptions = (
  list: ReadonlyArray<{ value: string; label: string }>
): PixelSelectOption[] => list.map((o) => ({ value: o.value, label: o.label }));

export const TemplateFilters = (props: Props): React.JSX.Element => {
  const { value, onChange } = props;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="flex flex-col gap-1.5">
        <span className={LABEL_CLASS}>OBJETIVO</span>
        <PixelSelect
          ariaLabel="Filtrar por objetivo"
          placeholder="Todos los objetivos"
          options={toOptions(GOAL_OPTIONS)}
          value={value.goal}
          onChange={(next) =>
            onChange({ ...value, goal: next as TemplateGoal | '' })
          }
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className={LABEL_CLASS}>EQUIPAMIENTO</span>
        <PixelSelect
          ariaLabel="Filtrar por equipamiento"
          placeholder="Todo el equipamiento"
          options={toOptions(EQUIPMENT_OPTIONS)}
          value={value.equipment}
          onChange={(next) =>
            onChange({
              ...value,
              equipment: next as TemplateEquipment | '',
            })
          }
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className={LABEL_CLASS}>NIVEL</span>
        <PixelSelect
          ariaLabel="Filtrar por nivel"
          placeholder="Todos los niveles"
          options={toOptions(LEVEL_OPTIONS)}
          value={value.level}
          onChange={(next) =>
            onChange({ ...value, level: next as TemplateLevel | '' })
          }
        />
      </div>
    </div>
  );
};
