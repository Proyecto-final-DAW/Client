import { useEffect, useState } from 'react';

import { useAuth } from '../../../../context/hooks/useAuth';
import type { Session } from '../../core/domain/models/Session';
import { sessionRepository } from '../adapter';

export const useSessions = () => {
  const { token } = useAuth();

  const [sessions, setSessions] = useState<Session[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const result = await sessionRepository.getUserSessions(token);
      setSessions(result);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error al cargar el historial de sesiones';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [token]);

  return { sessions, loading, error, refetch: fetchSessions };
};
