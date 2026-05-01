import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import type { RoutineTemplate } from '../../core/domain/models/RoutineTemplate';
import { templateRepository } from '../adapter';

export const useTemplateDetail = () => {
  const { id } = useParams<{ id: string }>();

  const [template, setTemplate] = useState<RoutineTemplate | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setTemplate(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    templateRepository
      .getById(id)
      .then((result) => {
        if (!cancelled) setTemplate(result);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : 'Error al cargar la plantilla';
        setError(message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { template, loading, error };
};
