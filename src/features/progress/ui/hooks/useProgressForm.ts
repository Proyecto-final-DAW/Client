import { parseLocalDate, toISODate } from '@shared/utils/date';
import { useState } from 'react';

import type { RegisterWeightInput } from '../../core/domain/models/Progress';

const WEIGHT_MIN = 1;
const WEIGHT_MAX = 300;
const MIN_DATE = '2000-01-01';

const todayISO = (): string => toISODate(new Date());

interface UseProgressFormParams {
  onSubmit: (input: RegisterWeightInput) => Promise<boolean>;
  onSuccess?: () => void;
}

export const useProgressForm = ({
  onSubmit,
  onSuccess,
}: UseProgressFormParams) => {
  const [weight, setWeight] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const maxDate = todayISO();

  const validate = (): RegisterWeightInput | null => {
    if (!weight || !date) {
      setError('El peso y la fecha son obligatorios');
      return null;
    }

    const numericWeight = Number(weight);
    if (
      !Number.isFinite(numericWeight) ||
      numericWeight < WEIGHT_MIN ||
      numericWeight > WEIGHT_MAX
    ) {
      setError(
        `Introduce un peso realista entre ${WEIGHT_MIN} y ${WEIGHT_MAX} kg`
      );
      return null;
    }

    if (date < MIN_DATE || date > maxDate) {
      setError('La fecha debe estar entre el año 2000 y hoy');
      return null;
    }

    // `parseLocalDate` builds the Date from the YYYY-MM-DD components
    // at local midnight. The previous `new Date(date)` resolved
    // YYYY-MM-DD to UTC-midnight, which TZ-east-of-UTC users would
    // see persisted as "tomorrow" (and TZ-west sees as "yesterday").
    const selectedDate = parseLocalDate(date);
    if (!selectedDate) {
      setError('Introduce una fecha valida');
      return null;
    }

    return { weight: numericWeight, date: selectedDate };
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const input = validate();
    if (!input) return;

    setError(null);

    const ok = await onSubmit(input);
    if (!ok) return;

    setWeight('');
    setDate('');
    onSuccess?.();
  };

  return {
    weight,
    date,
    error,
    minDate: MIN_DATE,
    maxDate,
    setWeight,
    setDate,
    handleSubmit,
  };
};
