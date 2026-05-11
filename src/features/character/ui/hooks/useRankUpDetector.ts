import { useEffect, useState } from 'react';

import type { CharacterState } from '../../core/domain/models/CharacterState';
import {
  type RankLetter,
  rankLetterFromTier,
  tierIndexFromState,
} from '../../core/domain/models/RankLabels';

/**
 * Detects automatic rank promotions (B / A / S) so the dashboard can
 * surface a celebration modal for each unseen ascent.
 *
 * E, D and C have their own choice modal (`TierUpModal`); the user
 * actively picks a class to advance, so the celebration is implicit.
 * B, A and S happen silently in the server once min(stats) crosses
 * the gate, so without this hook the user only sees the letter on
 * their hero card change at some point — anticlimactic for what is
 * meant to be the apex moment of the progression arc.
 *
 * Queue semantics: if `last_seen` is null and the user's current
 * rank is S, we walk through every auto-rank above `last_seen` in
 * order (B → A → S), persisting each one as the user acknowledges
 * it. A user who skipped tiers (e.g. data import jumped them from
 * C straight to S) still gets the full three-beat ceremony — fixing
 * the original "RANGO S aparece sin contexto" complaint where two
 * silent promotions made the apex feel arbitrary.
 *
 * Per-user storage key keeps the queue honest across logout/login
 * on the same browser; without it, account A's "celebrated S"
 * would mute account B's first apex unlock forever.
 */
const STORAGE_PREFIX = 'rank_up_seen_';
const AUTO_RANKS: readonly RankLetter[] = ['B', 'A', 'S'] as const;

const indexOfRank = (letter: RankLetter): number =>
  AUTO_RANKS.indexOf(letter);

interface RankUpDetector {
  /** Next rank in the celebration queue, or null when nothing pending. */
  pendingCelebration: RankLetter | null;
  /** Call after the user closes the modal — persists this rank as
   *  seen and advances to the next pending rank, if any. */
  acknowledge: () => void;
}

const readLastSeen = (storageKey: string): RankLetter | null => {
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw && (AUTO_RANKS as readonly string[]).includes(raw)
      ? (raw as RankLetter)
      : null;
  } catch {
    return null;
  }
};

const writeLastSeen = (storageKey: string, letter: RankLetter): void => {
  try {
    window.localStorage.setItem(storageKey, letter);
  } catch {
    // localStorage unavailable (private mode, quota) — the modal
    // simply re-fires next reload. Harmless, just noisier than ideal.
  }
};

export const useRankUpDetector = (
  state: CharacterState | null,
  userId: number | null,
): RankUpDetector => {
  const [pendingCelebration, setPendingCelebration] =
    useState<RankLetter | null>(null);

  useEffect(() => {
    if (!state || userId == null) {
      setPendingCelebration(null);
      return;
    }
    const currentLetter = rankLetterFromTier(tierIndexFromState(state));
    const currentIdx = indexOfRank(currentLetter);
    if (currentIdx < 0) {
      // Below B (i.e. F/E/D/C) → no auto-celebration owed. Choice
      // modals own those tiers.
      setPendingCelebration(null);
      return;
    }
    const storageKey = `${STORAGE_PREFIX}${userId}`;
    const lastSeenIdx = indexOfRank(readLastSeen(storageKey) ?? ('' as RankLetter));
    if (currentIdx > lastSeenIdx) {
      // The next rank to celebrate is whichever sits immediately
      // *above* what the user has already seen. Walking the queue
      // one step per acknowledge keeps every ascent its own beat.
      setPendingCelebration(AUTO_RANKS[lastSeenIdx + 1]);
    } else {
      setPendingCelebration(null);
    }
  }, [state, userId]);

  const acknowledge = (): void => {
    if (!pendingCelebration || userId == null) {
      setPendingCelebration(null);
      return;
    }
    const storageKey = `${STORAGE_PREFIX}${userId}`;
    writeLastSeen(storageKey, pendingCelebration);

    // Re-derive the next pending rank against the rank we just stored
    // so a skipped-tier user sees B → A → S in sequence. Reading
    // current state from `state` here mirrors the effect above.
    const currentLetter = state
      ? rankLetterFromTier(tierIndexFromState(state))
      : null;
    const currentIdx = currentLetter ? indexOfRank(currentLetter) : -1;
    const justAckedIdx = indexOfRank(pendingCelebration);
    if (currentIdx > justAckedIdx) {
      setPendingCelebration(AUTO_RANKS[justAckedIdx + 1]);
    } else {
      setPendingCelebration(null);
    }
  };

  return { pendingCelebration, acknowledge };
};
