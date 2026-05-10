import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@context/hooks/useAuth';
import type { Cards } from '../../core/domain/models/Cards';
import { cardsRepository } from '../adapter';

export const useCards = () => {
  const { token } = useAuth();

  const [cards, setCards] = useState<Cards | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Single fetch implementation, parameterised on a cancellation
  // ref the effect can flip on unmount/token-change. Caller-side
  // `refetch` runs without a guard (it's an explicit action). The
  // earlier shape duplicated the body across `fetchCards` and the
  // useEffect's inline promise chain.
  const runFetch = useCallback(
    async (cancelled?: { current: boolean }): Promise<void> => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const result = await cardsRepository.getCards();
        if (!cancelled?.current) setCards(result);
      } catch (err) {
        if (cancelled?.current) return;
        const message =
          err instanceof Error ? err.message : 'Error al cargar las cards';
        setError(message);
      } finally {
        if (!cancelled?.current) setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (!token) {
      setCards(null);
      setError(null);
      setLoading(false);
      return;
    }
    const cancelled = { current: false };
    void runFetch(cancelled);
    return () => {
      cancelled.current = true;
    };
  }, [token, runFetch]);

  const refetch = useCallback((): Promise<void> => runFetch(), [runFetch]);

  return { cards, loading, error, refetch };
};
