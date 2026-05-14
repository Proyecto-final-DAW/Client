import type { CharacterState } from './CharacterState';

/**
 * Display labels for the 7-tier rank progression.
 *
 * Internally the character tier is an index 0–6 (NoviceClass through
 * Leyenda). The UI presents this as an arcade-style letter grade
 * F→S — the long Spanish tier names (INICIADO, VOCACION, …, LEYENDA)
 * never fit a horizontal ladder cleanly, and "S" as the apex rank is
 * universal gaming convention (Sonic, DMC, Persona). The class names
 * the user actually picks (Escudero, Guerrero, …) are a separate
 * concept — they label the *what*, the rank labels the *how far*.
 */
export const RANK_LETTERS = ['F', 'E', 'D', 'C', 'B', 'A', 'S'] as const;

export type RankLetter = (typeof RANK_LETTERS)[number];

/**
 * Derives the tier index 0-6 from a CharacterState. Single source of
 * truth — header, dashboard hero, profile banner and class tree all
 * call into this so a future tier rule (e.g. an interim "ascended"
 * stage) only needs to update one helper. The `currentTier` field
 * on CharacterState already holds this value mid-flight, but it can
 * lag the boolean flags during a tier-up mutation; the booleans /
 * legendaryStage are the canonical late-binding source.
 */
export const tierIndexFromState = (state: CharacterState | null): number => {
  if (!state) return 0;
  if (state.isMaestroSupremo && state.isLeyenda) return 6;
  if (state.isMaestroSupremo) return 5;
  if (state.legendaryStage === 'TRANSCENDENT') return 4;
  if (state.legendary) return 3;
  if (state.specialization) return 2;
  if (state.vocation) return 1;
  return 0;
};

/**
 * Returns the letter for a given tier index, clamping out-of-range
 * values to the boundaries so a stale tier from the server can't
 * crash the UI.
 */
export const rankLetterFromTier = (tierIndex: number): RankLetter => {
  if (tierIndex < 0) return RANK_LETTERS[0];
  if (tierIndex >= RANK_LETTERS.length)
    return RANK_LETTERS[RANK_LETTERS.length - 1];
  return RANK_LETTERS[tierIndex];
};

/**
 * Per-rank colour palette. Each letter has its own hue so a glance at
 * a "RANGO X" pill or a ladder tile communicates progression without
 * reading the letter — green for the start, cool blues climbing the
 * early ranks, warm purple/pink/orange for the legendary tiers, then
 * gold for `S` as the apex.
 *
 * Returned as raw colour values (hex / rgba) instead of Tailwind class
 * names because consumers need to dim them with `color-mix` for
 * non-current ranks; Tailwind's JIT can't see classes built at runtime,
 * so generating them via string concat would silently produce missing
 * styles. Inline `style={{...}}` is the simplest path that survives
 * the build pipeline.
 *
 * `text`   – foreground colour for the letter itself
 * `border` – tile border at full saturation (active state)
 * `bg`     – tile fill base colour (consumer applies its own opacity)
 * `glow`   – rgba used for box-shadow halos
 */
export interface RankStyle {
  text: string;
  border: string;
  bg: string;
  glow: string;
}

/**
 * LoL-inspired tier palette: each rank is a precious-metal /
 * gemstone tone the user immediately recognises from competitive
 * gaming. Iron → Bronze → Silver → Gold → Platinum → Diamond → and
 * an apex gold for `S` (Challenger-style; a separate, brighter gold
 * that reads as "above the normal ladder").
 *
 * The previous rainbow (green→cyan→blue→purple→pink→orange→gold) was
 * legible but didn't carry the same "I've earned this" weight — Iron
 * to Diamond is a vocabulary every gamer reads instantly.
 */
export const RANK_STYLES: Record<RankLetter, RankStyle> = {
  // F — Iron. Cool dark gray, the "starting bottom" colour. Glow uses
  // a lighter silver-white tone (instead of straight Iron grey, which
  // is barely visible on a dark page) so the "you are here" pulse
  // reads as luminous even though the tile itself is the dimmest hue.
  F: {
    text: '#d4d4d8',
    border: '#a1a1aa',
    bg: '#52525b',
    glow: 'rgba(212,212,216,0.85)',
  },
  // E — Bronze. Warm copper.
  E: {
    text: '#fdba74',
    border: '#c2410c',
    bg: '#9a3412',
    glow: 'rgba(194,65,12,0.7)',
  },
  // D — Silver. Cool light gray with a slight blue cast.
  D: {
    text: '#e2e8f0',
    border: '#94a3b8',
    bg: '#64748b',
    glow: 'rgba(148,163,184,0.7)',
  },
  // C — Gold. The first "shiny" tier — yellow-amber.
  C: {
    text: '#fde68a',
    border: '#ca8a04',
    bg: '#a16207',
    glow: 'rgba(202,138,4,0.75)',
  },
  // B — Platinum. Cyan-teal, the LoL signature for that tier.
  B: {
    text: '#99f6e4',
    border: '#14b8a6',
    bg: '#0d9488',
    glow: 'rgba(20,184,166,0.8)',
  },
  // A — Diamond. Bright sky-cyan, the classic gemstone tone.
  A: {
    text: '#bae6fd',
    border: '#38bdf8',
    bg: '#0284c7',
    glow: 'rgba(56,189,248,0.85)',
  },
  // S — Apex. Bright gold with the strongest glow — sits "above" the
  // Iron→Diamond ladder rather than continuing it, so the colour is a
  // brighter, shinier yellow than C's gold (which is amber-deep).
  // Consumers should layer pulsing/shimmer on this one.
  S: {
    text: '#fde047',
    border: '#facc15',
    bg: '#eab308',
    glow: 'rgba(253,224,71,0.95)',
  },
};

export const styleForRank = (letter: RankLetter): RankStyle =>
  RANK_STYLES[letter];

/** True iff this is the apex rank — useful for "give it the special
 *  treatment" branches in tile/pill renderers. */
export const isApexRank = (letter: RankLetter): boolean => letter === 'S';
