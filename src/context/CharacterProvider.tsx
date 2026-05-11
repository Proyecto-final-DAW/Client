import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
  // Generation token shared by both `fetchState` and `chooseClass`:
  // every concurrent or stale call increments `genRef.current` on
  // start, then bails on completion if its captured generation no
  // longer matches. Without this, a `chooseClass` response that
  // resolves *after* a token swap (logout + login as B) would land
  // in the new user's state and show user A's class.
  const genRef = useRef(0);

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
      const myGen = ++genRef.current;
      setChoosing(true);
      try {
        const result = await characterRepository.chooseClass(tier, classId);
        if (result.kind === 'requiresOnboarding') {
          // Should never happen after a state was already loaded — surface clearly.
          throw new Error(
            'No se puede elegir clase sin completar la configuracion inicial.'
          );
        }
        // Token swap, parallel chooseClass, or fetchState bumped the
        // generation while we were in flight — discard our result so
        // we don't clobber whatever the newer call wrote.
        if (genRef.current !== myGen) return result.state;
        setData({
          state: result.state,
          loading: false,
          error: null,
          requiresOnboarding: false,
        });
        return result.state;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'No hemos podido confirmar tu clase. Vuelve a intentarlo.';
        if (genRef.current === myGen) {
          setData((prev) => ({ ...prev, error: message }));
        }
        throw err instanceof Error ? err : new Error(message);
      } finally {
        if (genRef.current === myGen) setChoosing(false);
      }
    },
    []
  );

  const refetch = useCallback(async (): Promise<void> => {
    await fetchState();
  }, [fetchState]);

  // Memoize the context value so consumers don't re-render on every
  // provider render. Without this, `useCharacterState()` triggered a
  // re-render in every page that read it whenever any unrelated state
  // bumped this provider's tree — and `data` is updated frequently.
  const value = useMemo(
    () => ({
      state: data.state,
      loading: data.loading,
      error: data.error,
      requiresOnboarding: data.requiresOnboarding,
      refetch,
      chooseClass,
      choosing,
    }),
    [data, refetch, chooseClass, choosing]
  );

  return (
    <CharacterContext.Provider value={value}>
      {props.children}
    </CharacterContext.Provider>
  );
};
