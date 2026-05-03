import { useCallback, useEffect, useState } from 'react';

import type {
  CharacterState,
  PendingChoiceTier,
} from '../features/character/core/domain/models/CharacterState';
import { characterRepository } from '../features/character/ui/adapter';
import { CharacterContext } from './CharacterContext';
import { useAuth } from './hooks/useAuth';

interface InternalState {
  state: CharacterState | null;
  loading: boolean;
  error: string | null;
  requiresOnboarding: boolean;
}

const INITIAL: InternalState = {
  state: null,
  loading: false,
  error: null,
  requiresOnboarding: false,
};

/**
 * Single source of truth for the character state. Mounted once below
 * `<AuthProvider>` so Dashboard, Profile, etc. share the same data and any
 * tier-up confirmation is reflected everywhere immediately.
 *
 * Re-fetches automatically when the auth token changes (login/logout).
 */
export const CharacterProvider = (props: {
  children: React.ReactNode;
}): React.JSX.Element => {
  const { token } = useAuth();
  const [data, setData] = useState<InternalState>(INITIAL);
  const [choosing, setChoosing] = useState<boolean>(false);

  const fetchState = useCallback(
    async (signal?: { cancelled: boolean }): Promise<void> => {
      if (!token) {
        setData(INITIAL);
        return;
      }
      setData((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const result = await characterRepository.getState();
        if (signal?.cancelled) return;
        if (result.kind === 'requiresOnboarding') {
          setData({
            state: null,
            loading: false,
            error: null,
            requiresOnboarding: true,
          });
        } else {
          setData({
            state: result.state,
            loading: false,
            error: null,
            requiresOnboarding: false,
          });
        }
      } catch (err) {
        if (signal?.cancelled) return;
        setData({
          state: null,
          loading: false,
          error:
            err instanceof Error
              ? err.message
              : 'Error al cargar el estado del personaje',
          requiresOnboarding: false,
        });
      }
    },
    [token]
  );

  useEffect(() => {
    const signal = { cancelled: false };
    void fetchState(signal);
    return () => {
      signal.cancelled = true;
    };
  }, [fetchState]);

  const chooseClass = useCallback(
    async (
      tier: PendingChoiceTier,
      classId: string
    ): Promise<CharacterState> => {
      setChoosing(true);
      try {
        const result = await characterRepository.chooseClass(tier, classId);
        if (result.kind === 'requiresOnboarding') {
          // Should never happen after a state was already loaded — surface clearly.
          throw new Error(
            'No se puede elegir clase sin completar el onboarding'
          );
        }
        setData({
          state: result.state,
          loading: false,
          error: null,
          requiresOnboarding: false,
        });
        return result.state;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Error al elegir la clase';
        setData((prev) => ({ ...prev, error: message }));
        throw err instanceof Error ? err : new Error(message);
      } finally {
        setChoosing(false);
      }
    },
    []
  );

  const refetch = useCallback(async (): Promise<void> => {
    await fetchState();
  }, [fetchState]);

  return (
    <CharacterContext.Provider
      value={{
        state: data.state,
        loading: data.loading,
        error: data.error,
        requiresOnboarding: data.requiresOnboarding,
        refetch,
        chooseClass,
        choosing,
      }}
    >
      {props.children}
    </CharacterContext.Provider>
  );
};
