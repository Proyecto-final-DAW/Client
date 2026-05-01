import { useEffect, useState } from 'react';

import { useAuth } from '../../../../context/hooks/useAuth';
import type {
  CharacterState,
  PendingChoiceTier,
} from '../../core/domain/models/CharacterState';
import { characterRepository } from '../adapter';

export const useCharacterState = () => {
  const { token } = useAuth();
  const authToken = token ?? undefined;

  const [state, setState] = useState<CharacterState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [choosing, setChoosing] = useState<boolean>(false);

  const fetchState = async () => {
    setError(null);
    try {
      const result = await characterRepository.getState(authToken);
      setState(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al cargar el estado del personaje'
      );
    }
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    characterRepository
      .getState(authToken)
      .then((result) => {
        if (!cancelled) setState(result);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(
          err instanceof Error
            ? err.message
            : 'Error al cargar el estado del personaje'
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authToken]);

  const chooseClass = async (
    tier: PendingChoiceTier,
    classId: string
  ): Promise<boolean> => {
    setChoosing(true);
    setError(null);
    try {
      const updated = await characterRepository.chooseClass(
        tier,
        classId,
        authToken
      );
      setState(updated);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al elegir la clase');
      return false;
    } finally {
      setChoosing(false);
    }
  };

  return {
    state,
    loading,
    error,
    choosing,
    refetch: fetchState,
    chooseClass,
  };
};
