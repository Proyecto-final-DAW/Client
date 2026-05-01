import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '../../../../context/hooks/useAuth';
import type { RoutineTemplate } from '../../core/domain/models/RoutineTemplate';
import { recommendTemplates } from '../../core/domain/services/recommendTemplates';
import { templateRepository } from '../adapter';
import type { TemplateFiltersValue } from '../components/TemplateFilters';

const RECOMMENDATION_LIMIT = 3;

const INITIAL_FILTERS: TemplateFiltersValue = {
  goal: '',
  equipment: '',
  level: '',
};

const matchesFilters = (
  template: RoutineTemplate,
  filters: TemplateFiltersValue
): boolean => {
  if (filters.goal && template.goal !== filters.goal) return false;
  if (filters.equipment && template.equipment !== filters.equipment)
    return false;
  if (filters.level && template.level !== filters.level) return false;
  return true;
};

export const useTemplateCatalog = () => {
  const { user } = useAuth();

  const [templates, setTemplates] = useState<RoutineTemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TemplateFiltersValue>(INITIAL_FILTERS);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    templateRepository
      .getAll()
      .then((result) => {
        if (!cancelled) setTemplates(result);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : 'Error al cargar las plantillas';
        setError(message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const recommendedTemplates = useMemo(
    () => recommendTemplates(templates, user, RECOMMENDATION_LIMIT),
    [templates, user]
  );

  const recommendedTemplateIds = useMemo(
    () => new Set(recommendedTemplates.map((template) => template.id)),
    [recommendedTemplates]
  );

  const filteredTemplates = useMemo(
    () => templates.filter((template) => matchesFilters(template, filters)),
    [templates, filters]
  );

  return {
    loading,
    error,
    filters,
    setFilters,
    recommendedTemplates,
    recommendedTemplateIds,
    filteredTemplates,
  };
};
