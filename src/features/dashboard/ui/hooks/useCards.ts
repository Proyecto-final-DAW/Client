import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@context/hooks/useAuth';
import type { Cards } from '../../core/domain/models/Cards';
import { cardsRepository } from '../adapter';

export const useCards = () => {
  const { token } = useAuth();

  const [cards, setCards] = useState<Cards | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = useCallback(async (): Promise<void> => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const result = await cardsRepository.getCards();
      setCards(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al cargar las cards';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Effect-scoped fetch with a `cancelled` guard so a token change
  // (logout → login as a different user) can't apply the previous
  // user's response on top of the new auth state. The caller-side
  // `refetch` keeps the un-guarded version because it's an explicit
  // user action that's expected to flash loading.
  useEffect(() => {
    if (!token) {
      setCards(null);
      setError(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    cardsRepository
      .getCards()
      .then((result) => {
        if (!cancelled) setCards(result);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : 'Error al cargar las cards';
        setError(message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  return { cards, loading, error, refetch: fetchCards };
};
