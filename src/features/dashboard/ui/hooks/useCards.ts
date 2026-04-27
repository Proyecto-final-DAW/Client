import { useEffect, useState } from 'react';

import { useAuth } from '../../../../context/hooks/useAuth';
import type { Cards } from '../../core/domain/models/Cards';
import { cardsRepository } from '../adapter';

export const useCards = () => {
  const { token } = useAuth();

  const [cards, setCards] = useState<Cards | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = async () => {
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
  };

  useEffect(() => {
    fetchCards();
  }, [token]);

  return { cards, loading, error, refetch: fetchCards };
};
