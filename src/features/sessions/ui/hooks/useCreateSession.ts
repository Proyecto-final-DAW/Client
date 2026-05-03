import { useState } from 'react';

import { useAuth } from '../../../../context/hooks/useAuth';
import type { CreateSessionInput } from '../../core/domain/models/Session';
import { sessionRepository } from '../adapter';

export const useCreateSession = () => {
  const { token } = useAuth();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const submit = async (input: CreateSessionInput): Promise<boolean> => {
    if (!token) {
      setError('Tu sesión ha caducado. Vuelve a iniciar sesión.');
      return false;
    }

    setSaving(true);
    setError(null);

    try {
      await sessionRepository.createSession(input);
      setSavedAt(Date.now());
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al guardar la sesión';
      setError(message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const dismiss = () => setSavedAt(null);

  return {
    saving,
    error,
    saved: savedAt !== null,
    submit,
    dismiss,
  };
};
