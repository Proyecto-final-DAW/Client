import { useEffect, useRef, useState } from 'react';

import type { ClassCatalog } from '../../core/domain/models/ClassCatalog';
import { characterRepository } from '../adapter';

interface UseClassCatalogResult {
  catalog: ClassCatalog | null;
  loading: boolean;
  error: string | null;
}

// Module-level cache. The catalog is identical for every user and never
// changes within a session, so we hand it back instantly on subsequent
// hook mounts instead of re-hitting the network.
let cached: ClassCatalog | null = null;

/**
 * Read-only fetch of the full class catalog (~38 entries). Used by the
 * class-tree view; not part of CharacterProvider because it's pure
 * reference data — keeping it out of context avoids re-rendering the
 * dashboard every time the user navigates into the tree.
 */
export const useClassCatalog = (): UseClassCatalogResult => {
  const [catalog, setCatalog] = useState<ClassCatalog | null>(cached);
  const [loading, setLoading] = useState(cached === null);
  const [error, setError] = useState<string | null>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    if (cached) return;
    void (async () => {
      try {
        setLoading(true);
        const result = await characterRepository.getCatalog();
        cached = result;
        if (!cancelledRef.current) setCatalog(result);
      } catch (err) {
        if (!cancelledRef.current) {
          setError(err instanceof Error ? err.message : 'Error desconocido');
        }
      } finally {
        if (!cancelledRef.current) setLoading(false);
      }
    })();
    return () => {
      cancelledRef.current = true;
    };
  }, []);

  return { catalog, loading, error };
};
