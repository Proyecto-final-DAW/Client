import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { TEMPLATES } from '../../data/templates';

export const useTemplateDetail = () => {
  const { id } = useParams<{ id: string }>();

  const template = useMemo(
    () => TEMPLATES.find((candidate) => candidate.id === id) ?? null,
    [id]
  );

  return { template };
};
