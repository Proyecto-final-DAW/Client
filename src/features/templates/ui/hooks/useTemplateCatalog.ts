import { useMemo, useState } from 'react';

import { useAuth } from '../../../../context/hooks/useAuth';
import type { RoutineTemplate } from '../../core/domain/models/RoutineTemplate';
import { recommendTemplates } from '../../data/recommend';
import { TEMPLATES } from '../../data/templates';
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

  const [filters, setFilters] = useState<TemplateFiltersValue>(INITIAL_FILTERS);

  const recommendedTemplates = useMemo(
    () => recommendTemplates(TEMPLATES, user, RECOMMENDATION_LIMIT),
    [user]
  );

  const recommendedTemplateIds = useMemo(
    () => new Set(recommendedTemplates.map((template) => template.id)),
    [recommendedTemplates]
  );

  const filteredTemplates = useMemo(
    () => TEMPLATES.filter((template) => matchesFilters(template, filters)),
    [filters]
  );

  return {
    filters,
    setFilters,
    recommendedTemplates,
    recommendedTemplateIds,
    filteredTemplates,
  };
};
