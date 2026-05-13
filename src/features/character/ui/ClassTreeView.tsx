import { statConfigFor } from '@features/stats/ui/StatConfig';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import { useCharacterState } from '../../../context/hooks/useCharacterState';
import { AsyncState } from '../../../shared/components/AsyncState';
import { PixelCorners } from '../../../shared/components/PixelCorners';
import { useBodyScrollLock } from '../../../shared/hooks/useBodyScrollLock';
import type {
  LegendaryClass,
  SpecializationClass,
  StatKey,
  VocationClass,
} from '../core/domain/models/CharacterClass';
import type { ClassCatalog } from '../core/domain/models/ClassCatalog';
import {
  rankLetterFromTier,
  styleForRank,
  tierIndexFromState,
  type RankLetter,
} from '../core/domain/models/RankLabels';
import { useAuth } from '../../../context/hooks/useAuth';
import { ClassesIntroModal } from './components/ClassesIntroModal';
import { ClassPixelArt, hasPixelArt } from './components/ClassPixelArt';
import { useClassCatalog } from './hooks/useClassCatalog';

// ────────────────────────────────────────────────────────────────────────
// Status types — kept identical to the previous tree view so the existing
// status-detection logic transfers 1:1. The panteon just renders the
// statuses differently (a card per class instead of a node on a canvas).
// ────────────────────────────────────────────────────────────────────────
type NodeStatus = 'current' | 'owned' | 'alternate' | 'future';

const STATUS_RING: Record<NodeStatus, string> = {
  current:
    'border-green-400 shadow-[0_0_22px_rgba(34,197,94,0.55)] ring-2 ring-green-400/40',
  owned: 'border-green-500/55',
  alternate: 'border-border',
  future: 'border-border-muted',
};

const STATUS_BG: Record<NodeStatus, string> = {
  current: 'bg-green-500/12',
  owned: 'bg-green-500/[0.06]',
  alternate: 'bg-card',
  future: 'bg-card/60',
};

const STATUS_LABEL: Record<NodeStatus, string> = {
  current: 'TU CLASE ACTUAL',
  owned: 'YA RECORRIDO',
  alternate: 'CAMINO ALTERNATIVO',
  future: 'BLOQUEADO',
};

const STATUS_TONE: Record<NodeStatus, string> = {
  current: 'text-green-400',
  owned: 'text-green-400/80',
  alternate: 'text-ink-muted',
  future: 'text-ink-disabled',
};

// ────────────────────────────────────────────────────────────────────────
// Owned-ids + per-class status detection. Reused as-is from the canvas
// tree — keeps the progressive-reveal rules identical (future cards stay
// silhouettes until the user reaches the gating tier).
// ────────────────────────────────────────────────────────────────────────
interface OwnedIds {
  vocationId: string | null;
  specializationId: string | null;
  legendaryId: string | null;
  isMaestroSupremo: boolean;
  isLeyenda: boolean;
  userTier: number;
}

const buildOwned = (
  state: ReturnType<typeof useCharacterState>['state']
): OwnedIds => ({
  vocationId: state?.vocation?.id ?? null,
  specializationId: state?.specialization?.id ?? null,
  legendaryId: state?.legendary?.id ?? null,
  isMaestroSupremo: state?.isMaestroSupremo ?? false,
  isLeyenda: state?.isLeyenda ?? false,
  userTier: tierIndexFromState(state ?? null),
});

const noviceStatus = (owned: OwnedIds): NodeStatus =>
  owned.userTier > 0 ? 'owned' : 'current';

const vocationStatus = (
  vocation: VocationClass,
  owned: OwnedIds
): NodeStatus => {
  if (owned.userTier < 1) return 'future';
  if (owned.vocationId === vocation.id) {
    return owned.specializationId ? 'owned' : 'current';
  }
  return 'alternate';
};

const specializationStatus = (
  spec: SpecializationClass,
  owned: OwnedIds
): NodeStatus => {
  if (owned.userTier < 2) return 'future';
  if (owned.specializationId === spec.id) {
    return owned.legendaryId ? 'owned' : 'current';
  }
  return 'alternate';
};

const legendaryStatus = (leg: LegendaryClass, owned: OwnedIds): NodeStatus => {
  if (owned.userTier < 3) return 'future';
  if (owned.legendaryId === leg.id) {
    return owned.userTier >= 4 ? 'owned' : 'current';
  }
  return 'alternate';
};

const transcendentStatus = (
  leg: LegendaryClass,
  owned: OwnedIds
): NodeStatus => {
  if (owned.userTier < 4) return 'future';
  if (owned.legendaryId === leg.id) {
    return owned.userTier >= 5 ? 'owned' : 'current';
  }
  return 'alternate';
};

// ────────────────────────────────────────────────────────────────────────
// Panteon node + builder. Builds ONLY the user's path: the chosen
// vocation's lineage (1 vocation → 3 specs → 2 reachable legendaries
// → 1 transcendent), plus the prestige singletons when reached. At T0
// the user hasn't picked yet so all 6 vocations are surfaced as the
// upcoming-choice — from T1 onwards the 5 unchosen lineages disappear
// entirely. This matches the user's mental model of "my classes",
// not the full catalog.
// ────────────────────────────────────────────────────────────────────────
interface PanteonNode {
  id: string;
  tier: number;
  name: string;
  frase: string;
  status: NodeStatus;
  /** Stat that drives the icon + accent color. null on the
   *  pillar-agnostic singletons (novice, maestro, leyenda). */
  stat: StatKey | null;
}

interface PanteonSection {
  tier: number;
  /** "INICIADO", "VOCACION", "ESPECIALIZACION", etc. — header subtitle
   *  rendered next to the rank letter (RANGO F · INICIADO). */
  label: string;
  nodes: PanteonNode[];
}

const buildPanteon = (
  catalog: ClassCatalog,
  state: ReturnType<typeof useCharacterState>['state']
): PanteonSection[] => {
  const owned = buildOwned(state);
  const sections: PanteonSection[] = [];

  // RANGO F · INICIADO — always shown.
  sections.push({
    tier: 0,
    label: 'INICIADO',
    nodes: [
      {
        id: catalog.novice.id,
        tier: 0,
        name: catalog.novice.name,
        frase: catalog.novice.frase,
        status: noviceStatus(owned),
        stat: null,
      },
    ],
  });

  // RANGO E · VOCACION — all 6 lineages always rendered. At T0 they
  // are silhouettes (the upcoming choice); at T1+ the chosen vocation
  // is highlighted (`current` / `owned`) and the other 5 sit as
  // `alternate` so the user can read what they could have been.
  // Vocation is the meaningful branching point of the journey, so
  // surfacing the full palette here (and only here at this depth) is
  // worth the extra cards — deeper tiers stay scoped to the user's
  // own lineage.
  sections.push({
    tier: 1,
    label: 'VOCACION',
    nodes: catalog.vocations.map((v) => ({
      id: v.id,
      tier: 1,
      name: v.name,
      frase: v.frase,
      status: vocationStatus(v, owned),
      stat: v.dominantStat,
    })),
  });

  // RANGO D · ESPECIALIZACION — only the 3 specs of the user's lineage.
  // Visible from T1 onwards (silhouettes at T1 — pending choice; status
  // resolves once the user picks one at T2). Hidden entirely at T0
  // since there's no lineage yet.
  if (owned.userTier >= 1 && owned.vocationId) {
    const lineageSpecs = catalog.specializations.filter(
      (s) => s.lineage === owned.vocationId
    );
    if (lineageSpecs.length > 0) {
      sections.push({
        tier: 2,
        label: 'ESPECIALIZACION',
        nodes: lineageSpecs.map((s) => ({
          id: s.id,
          tier: 2,
          name: s.name,
          frase: s.frase,
          status: specializationStatus(s, owned),
          stat: s.secondaryStat,
        })),
      });
    }
  }

  // RANGO C · LEGENDARIA — 2 legendaries reachable from the user's
  // chosen spec. Hidden until the spec exists (i.e. T2+).
  if (owned.userTier >= 2 && owned.specializationId) {
    const userSpec = catalog.specializations.find(
      (s) => s.id === owned.specializationId
    );
    if (userSpec) {
      const reachableLegs = userSpec.legendaryOptions
        .map((id) => catalog.legendaries.find((l) => l.id === id))
        .filter((l): l is LegendaryClass => Boolean(l));
      if (reachableLegs.length > 0) {
        sections.push({
          tier: 3,
          label: 'LEGENDARIA',
          nodes: reachableLegs.map((l) => ({
            id: l.id,
            tier: 3,
            name: l.name,
            frase: l.frase,
            status: legendaryStatus(l, owned),
            stat: l.requiredStats[0] ?? null,
          })),
        });
      }
    }
  }

  // RANGO B · TRASCENDENTE — 1 card, the stage-2 form of the user's
  // chosen legendary. Hidden until the legendary is set (T3+).
  if (owned.userTier >= 3 && owned.legendaryId) {
    const userLeg = catalog.legendaries.find((l) => l.id === owned.legendaryId);
    if (userLeg) {
      sections.push({
        tier: 4,
        label: 'TRASCENDENTE',
        nodes: [
          {
            id: `${userLeg.id}-T4`,
            tier: 4,
            name: userLeg.transcendentName,
            frase: userLeg.transcendentFrase,
            status: transcendentStatus(userLeg, owned),
            stat: userLeg.requiredStats[0] ?? null,
          },
        ],
      });
    }
  }

  // RANGO A · MAESTRO and RANGO S · LEYENDA — prestige singletons,
  // surfaced only when actually reached. Keeping them hidden until then
  // preserves the surprise reveal of the late-game ascension flows.
  if (owned.userTier >= 5) {
    sections.push({
      tier: 5,
      label: 'MAESTRO',
      nodes: [
        {
          id: 'MAESTRO_SUPREMO',
          tier: 5,
          name: 'Maestro Supremo',
          frase: 'Cantaran tu nombre cuando ya no quede nadie para escucharlo.',
          status: owned.isLeyenda ? 'owned' : 'current',
          stat: null,
        },
      ],
    });
  }

  if (owned.userTier >= 6) {
    sections.push({
      tier: 6,
      label: 'LEYENDA',
      nodes: [
        {
          id: 'LEYENDA',
          tier: 6,
          name: 'Leyenda',
          frase: 'Mas alla del tiempo. Mas alla del nombre.',
          status: 'current',
          stat: null,
        },
      ],
    });
  }

  return sections;
};

// ────────────────────────────────────────────────────────────────────────
// Class card — single panteon tile. Replaces the old ClassNode (which
// was a tiny 140×60 button on a pannable canvas). Now a roomy ~220×170
// card with the stat icon front and center, the lore frase visible
// inline, and a status ring color-coded per state.
// ────────────────────────────────────────────────────────────────────────
const ClassCard = ({
  node,
  index,
  compact = false,
}: {
  node: PanteonNode;
  /** Used to drive a small entry-stagger so the cards "draw in" rather
   *  than appearing all at once. Stagger is capped at 12 cards' worth so
   *  large rows (T2 has 18 specs) don't trail too long. */
  index: number;
  /** When true, the card opts into the dense mobile layout: half-width
   *  (so 2 fit per row at < sm), tighter padding, smaller icon,
   *  description hidden on phone for `future` cards. Single-card
   *  sections (F-rank TU CLASE ACTUAL) leave this off so they
   *  stretch full-width instead of looking like a stranded tile. */
  compact?: boolean;
}): React.JSX.Element => {
  const isFuture = node.status === 'future';
  // The F-rank "Sin clase" tile starts the user with no class chosen
  // yet. We strip the inner glyph from its icon box so the card
  // doesn't pretend there's something to depict; an empty box reads
  // as "blank slate", which is what the user is at this stage.
  const isNovice = node.id === 'ESCUDERO';
  // statConfigFor handles the server `endurance` ↔ client `resistance`
  // bridge so we don't re-implement it here.
  const config = node.stat ? statConfigFor(node.stat) : undefined;
  const Icon = config?.icon ?? null;
  // Apex classes (A / S) don't have a stat pillar, so we tint them
  // with their rank palette instead of the green fallback — gold for
  // LEYENDA, cyan/diamond for MAESTRO_SUPREMO. This makes the two
  // pixel-art tiles read as visually elevated from the stat-tinted
  // legendary cards above them.
  const apexAccent =
    node.id === 'LEYENDA'
      ? styleForRank('S').text
      : node.id === 'MAESTRO_SUPREMO'
        ? styleForRank('A').text
        : null;
  const accent = config?.accentColor ?? apexAccent ?? '#22c55e';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: Math.min(index, 12) * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`relative flex flex-col items-center text-center border-2 p-3 sm:p-4 ${
        compact ? 'w-[calc(50%-0.375rem)] sm:w-[260px]' : 'w-full sm:w-[260px]'
      } ${STATUS_RING[node.status]} ${STATUS_BG[node.status]}`}
    >
      {/* Status eyebrow — label only. Drops the leading STATUS_GLYPH
          (◆/●/✕) the previous version prefixed: it shifted the visual
          centre of the eyebrow to the right and made the card look
          asymmetric next to its centred name + frase. The status is
          carried by colour (STATUS_TONE) anyway. */}
      <p
        className={`font-pixel text-[8px] tracking-widest ${STATUS_TONE[node.status]}`}
      >
        {STATUS_LABEL[node.status]}
      </p>

      {/* Stat icon — accented per pillar (sword/shield/bolt/feather/diamond/heart).
          Hidden for the pillar-agnostic singletons (novice/maestro/leyenda)
          where we render a small diamond glyph instead. Smaller on
          mobile compact mode so two cards fit a 360-px viewport
          without the icon dominating the tile. */}
      <div
        className="mt-2 sm:mt-3 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-sm border-2"
        style={{
          borderColor: isFuture
            ? 'rgba(120,120,140,0.25)'
            : `color-mix(in srgb, ${accent} 55%, transparent)`,
          backgroundColor: isFuture
            ? 'rgba(120,120,140,0.08)'
            : `color-mix(in srgb, ${accent} 12%, transparent)`,
        }}
      >
        {Icon && !isFuture ? (
          <Icon className="h-6 w-6 sm:h-7 sm:w-7" style={{ color: accent }} />
        ) : isNovice ? (
          // Empty box for the F-rank "Sin clase" tile — the user
          // hasn't picked a path yet, so any glyph here would be
          // pretending there's something to show.
          <span aria-hidden="true" />
        ) : !isFuture && hasPixelArt(node.id) ? (
          // Custom pixel art for the apex classes (MAESTRO_SUPREMO,
          // LEYENDA) that don't have a stat pillar — replaces the
          // placeholder ◆ glyph the user called out as bland for
          // ranks A and S. The art is tinted with the same accent
          // colour the rest of the card uses so it sits naturally
          // in the existing palette.
          <ClassPixelArt
            classId={node.id}
            color={accent}
            className="h-6 w-6 sm:h-7 sm:w-7"
            style={{
              filter: `drop-shadow(0 0 6px color-mix(in srgb, ${accent} 55%, transparent))`,
            }}
          />
        ) : (
          <span
            className="font-pixel text-base"
            style={{ color: isFuture ? 'rgba(120,120,140,0.6)' : accent }}
          >
            {isFuture ? '?' : '◆'}
          </span>
        )}
      </div>

      {/* Class name — silhouetted to "???" until the user reaches the
          unlock tier. Same progressive-reveal rule as the previous tree. */}
      <h4
        className={`mt-3 font-pixel text-[11px] tracking-widest leading-tight ${isFuture ? 'text-ink-disabled' : 'text-green-400'}`}
        style={
          !isFuture && node.status === 'current'
            ? { textShadow: '0 0 10px rgba(34,197,94,0.45)' }
            : undefined
        }
      >
        {isFuture ? '???' : node.name.toUpperCase()}
      </h4>

      {/* Lore frase — italic VT323. Hidden for future classes (no
          spoilers); replaced by a one-line "what unlocks this" hint.
          On mobile compact mode the locked hint is hidden because
          every locked card carries the same "Llega a este punto…"
          string — repeating it 6× on a phone is pure noise. The
          eyebrow and the silhouetted name already convey the locked
          state. */}
      <p
        className={`mt-2 font-pixel-mono text-base italic leading-snug ${
          isFuture
            ? `text-ink-disabled ${compact ? 'hidden sm:block' : ''}`
            : 'text-ink/90'
        }`}
      >
        {isFuture
          ? 'Llega a este punto del camino para revelarla.'
          : `“${node.frase}”`}
      </p>
    </motion.div>
  );
};

// ────────────────────────────────────────────────────────────────────────
// Rank-letter badge — colored tile (Iron/Bronze/Silver/Gold/Platinum/
// Diamond/apex-Gold) using the centralised RankLabels palette. Renders
// as the visual anchor of each tier section header so the user reads
// the rank at a glance, with the long Spanish stage name (INICIADO,
// VOCACION, …) as a subtitle.
// ────────────────────────────────────────────────────────────────────────
const RankBadge = ({ letter }: { letter: RankLetter }): React.JSX.Element => {
  const palette = styleForRank(letter);
  return (
    <span
      aria-hidden="true"
      className="flex h-12 w-12 shrink-0 items-center justify-center border-2 font-pixel text-lg leading-none"
      style={{
        borderColor: palette.border,
        backgroundColor: `color-mix(in srgb, ${palette.bg} 35%, transparent)`,
        color: palette.text,
        textShadow: `0 0 12px ${palette.glow}`,
        boxShadow: `0 0 18px color-mix(in srgb, ${palette.glow} 50%, transparent)`,
      }}
    >
      {letter}
    </span>
  );
};

// Plain-language unlock requirements per rank. Painted under the tier
// header when the user hasn't reached that rank yet so they understand
// *why* the section is still locked — the previous panteon just listed
// the classes with no explanation of how to access them. Hidden once
// the user crosses the threshold so reached-rank sections don't carry
// stale "alcanza X" hints. Numbers mirror the gates in
// `classProgression.service.ts` (T1 any≥5, T2 dom≥15+sec≥10, T3
// hero≥25 + dom≥35 + sec≥22, T4 min≥50, T5 min≥80, T6 all≥99).
const RANK_REQUIREMENT: Partial<Record<RankLetter, string>> = {
  E: 'Alcanza nivel 5 en cualquier stat.',
  D: 'Sube tu stat dominante a 15 y la secundaria a 10.',
  C: 'Nivel de heroe 25 + dominante 35 + secundaria 22.',
  B: 'Sube todas tus stats al nivel 50.',
  A: 'Sube todas tus stats al nivel 80.',
  S: 'Sube todas tus stats al nivel 99.',
};

// ────────────────────────────────────────────────────────────────────────
// Tier section — RankBadge + stage label header, then a flat card grid.
// Now that the panteon only renders the user's path (no alternates,
// no cross-lineage browsing), every section has at most 6 cards (T1 at
// T0 — 6 vocations to choose from) and usually 1–3, so a single grid
// reads cleanly without sub-grouping.
// ────────────────────────────────────────────────────────────────────────
const TierSection = ({
  section,
  startIndex,
  userTier,
}: {
  section: PanteonSection;
  startIndex: number;
  /** User's current rank tier (0–6) — used to decide whether the
   *  "para llegar aquí necesitas …" hint is still relevant. Once the
   *  user reaches a rank, the requirement copy disappears. */
  userTier: number;
}): React.JSX.Element => {
  const letter = rankLetterFromTier(section.tier);
  const showRequirement = section.tier > userTier;
  const requirement = RANK_REQUIREMENT[letter];
  return (
    <section className="flex flex-col gap-5">
      <header className="flex items-center gap-4 border-b-2 border-green-500/25 pb-3">
        <RankBadge letter={letter} />
        <div className="flex-1 min-w-0">
          <p className="font-pixel text-[8px] tracking-widest text-ink-faint">
            RANGO {letter}
          </p>
          <h3 className="mt-1 font-pixel text-sm sm:text-base tracking-widest text-green-400 [text-shadow:0_0_12px_rgba(34,197,94,0.4)]">
            {section.label}
          </h3>
          {showRequirement && requirement && (
            <p className="mt-1 font-pixel-mono text-base sm:text-lg leading-snug text-ink-muted">
              {requirement}
            </p>
          )}
        </div>
        <span className="font-pixel text-[9px] tracking-widest text-ink-faint">
          {section.nodes.length}{' '}
          {section.nodes.length === 1 ? 'CLASE' : 'CLASES'}
        </span>
      </header>

      {/* Flex-wrap centred layout, capped at ~3 columns wide so 6-card
          tiers (the vocations) split as 3 + 3 instead of 4 + 2 — the
          orphan-2 row read as visually broken on wide screens. Cap is
          260px × 3 cards + 12px × 2 gaps ≈ 804px; 820 leaves a tiny
          buffer. Sections with fewer cards still center naturally
          inside the cap. `compact` flips multi-card sections to a
          half-width / 2-col layout on phones — single-card sections
          (the F-rank "TU CLASE ACTUAL") keep full-width so they don't
          look like a half-rendered tile. */}
      <div className="mx-auto flex max-w-[820px] flex-wrap justify-center gap-3">
        {section.nodes.map((node, i) => (
          <ClassCard
            key={node.id}
            node={node}
            index={startIndex + i}
            compact={section.nodes.length >= 2}
          />
        ))}
      </div>
    </section>
  );
};

// ────────────────────────────────────────────────────────────────────────
// Panteon modal — fullscreen overlay that contains the tier sections
// stacked vertically. Replaces the previous canvas-based ClassTreeModal:
// no pan, no zoom, no edges. Just scroll.
// ────────────────────────────────────────────────────────────────────────
const ClassPanteonModal = ({
  open,
  onClose,
  catalog,
  realState,
}: {
  open: boolean;
  onClose: () => void;
  catalog: ClassCatalog;
  realState: ReturnType<typeof useCharacterState>['state'];
}): React.JSX.Element | null => {
  const prefersReducedMotion = useReducedMotion();

  const sections = useMemo(
    () => buildPanteon(catalog, realState),
    [catalog, realState]
  );

  // ESC closes. Body scroll lock goes through the shared hook so a
  // TierUpModal that opens on top doesn't leak `overflow:hidden` when
  // the close-order mismatched the open-order (see useBodyScrollLock).
  useBodyScrollLock(open);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  // Portal to body so the modal escapes the DashboardLayout's stacking
  // context — the layout wraps its main content in a `relative z-10`
  // div and pins the top bar at `sticky z-30`, which means a modal
  // rendered as a child (even with `fixed inset-0 z-50`) gets stuck
  // *under* the top bar. The previous canvas tree worked around this
  // by portaling only the close button; portaling the whole modal is
  // cleaner and removes the workaround.
  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="class-panteon-title"
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex flex-col bg-page"
    >
      {/* Sticky header with title and close button. The close button
          sits inline with the title (top-right) styled as the same
          primary green CTA as "▶ ABRIR PANTEON" on the landing — open
          / close mirror each other (▶ vs ◀). */}
      <header className="sticky top-0 z-10 flex flex-col gap-3 border-b-2 border-green-500/40 bg-card/95 backdrop-blur px-4 py-3 shadow-[0_0_18px_rgba(34,197,94,0.2)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-pixel text-[8px] tracking-widest text-green-500">
              ◆ PANTEON
            </p>
            <h2
              id="class-panteon-title"
              className="mt-1 font-pixel text-sm tracking-widest text-green-400 [text-shadow:0_0_12px_rgba(34,197,94,0.5)]"
            >
              EL CAMINO
            </h2>
          </div>
          {/* Close button — same primary-CTA pixel style as "▶ ABRIR
              PANTEON" on the landing card, just pointing the other
              way. Mirrors the open / close pair so the visual language
              of "entering" and "leaving" the panteon is symmetrical. */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar panteon"
            className="shrink-0 inline-flex items-center gap-2 font-pixel text-[10px] sm:text-[11px] tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-3 sm:px-4 py-2 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(34,197,94,0.45)]"
          >
            <span aria-hidden="true">◀</span>
            <span>VOLVER</span>
          </button>
        </div>
      </header>

      {/* Scrollable body — vertical scroll through the tier sections.
          `mx-auto max-w-7xl` keeps line lengths comfortable on ultra-
          wide monitors; gap-12 between sections so the tier boundaries
          are obvious without needing dividers. The arbitrary-value
          classes restyle the scrollbar to a thin green-tinted thumb
          on a dark track — the default OS scrollbar (light gray slab)
          looked out of place over the dark pixel-art aesthetic. */}
      <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 [scrollbar-width:thin] [scrollbar-color:rgba(34,197,94,0.45)_rgba(15,15,20,0.4)] [&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar-track]:bg-black/40 [&::-webkit-scrollbar-thumb]:bg-green-500/45 [&::-webkit-scrollbar-thumb]:border [&::-webkit-scrollbar-thumb]:border-green-500/70 hover:[&::-webkit-scrollbar-thumb]:bg-green-500/65">
        <div className="mx-auto flex max-w-7xl flex-col gap-12">
          {sections.map((section, idx) => {
            // Stagger card delays cumulatively across sections so the
            // panteon "draws itself in" top-to-bottom on open.
            const startIndex = sections
              .slice(0, idx)
              .reduce((acc, s) => acc + s.nodes.length, 0);
            return (
              <TierSection
                key={section.tier}
                section={section}
                startIndex={startIndex}
                userTier={tierIndexFromState(realState)}
              />
            );
          })}
        </div>
      </div>
    </motion.div>,
    document.body
  );
};

// ────────────────────────────────────────────────────────────────────────
// Main view — landing page with stats card + CTA that opens the modal.
// Same pattern as before; only the modal contents changed.
// ────────────────────────────────────────────────────────────────────────
export const ClassTreeView = (): React.JSX.Element => {
  const { user } = useAuth();
  const { catalog, loading, error } = useClassCatalog();
  const { state } = useCharacterState();
  const [modalOpen, setModalOpen] = useState(false);

  // One-time panteon explainer — per-user localStorage flag.
  const classesIntroStorageKey =
    user?.id != null ? `classes_intro_seen_${user.id}` : null;

  const [classesIntroDismissed, setClassesIntroDismissed] = useState(
    () =>
      classesIntroStorageKey !== null &&
      localStorage.getItem(classesIntroStorageKey) === '1'
  );

  useEffect(() => {
    if (classesIntroStorageKey === null) {
      setClassesIntroDismissed(true);
      return;
    }
    setClassesIntroDismissed(
      localStorage.getItem(classesIntroStorageKey) === '1'
    );
  }, [classesIntroStorageKey]);

  const showClassesIntro =
    classesIntroStorageKey !== null && !classesIntroDismissed;

  const handleDismissClassesIntro = (): void => {
    if (classesIntroStorageKey !== null) {
      localStorage.setItem(classesIntroStorageKey, '1');
    }
    setClassesIntroDismissed(true);
  };

  const stats = useMemo(() => {
    if (!catalog) return null;
    const owned = buildOwned(state);
    // Personal counters instead of catalog totals — the user wants to
    // see their own progress on the landing card, not the abstract
    // catalog size. "DESBLOQUEADAS" climbs by 1 each tier the user
    // completes (Iniciado at T0, +Vocacion at T1, …, +Leyenda at T6).
    // userTier already reflects the highest tier reached, so it's
    // exactly the count of additional unlocks beyond the always-on
    // Iniciado — `userTier + 1` is the total.
    const unlockedClasses = owned.userTier + 1;
    // Best-effort current name. The panteon's own status logic finds
    // the same answer; mirroring it here just for the landing card.
    const currentName = ((): string => {
      if (owned.isLeyenda) return 'Leyenda';
      if (owned.isMaestroSupremo) return 'Maestro Supremo';
      if (state?.legendaryStage === 'TRANSCENDENT' && state.legendary)
        return state.legendary.transcendentName;
      if (state?.legendary) return state.legendary.name;
      if (state?.specialization) return state.specialization.name;
      if (state?.vocation) return state.vocation.name;
      return catalog.novice.name;
    })();
    const currentRank = rankLetterFromTier(owned.userTier);
    return { unlockedClasses, currentName, currentRank };
  }, [catalog, state]);

  return (
    <>
      <ClassesIntroModal
        open={showClassesIntro}
        onClose={handleDismissClassesIntro}
      />
      <AsyncState
        loading={loading}
        error={error}
        data={catalog}
        loadingLabel="CARGANDO PANTEON"
      >
      {(c) => (
        <div className="mx-auto max-w-4xl">
          <header className="mb-6">
            <p className="font-pixel text-[9px] tracking-widest text-green-500">
              DESTINO
            </p>
            <h1 className="mt-2 font-pixel text-base sm:text-lg tracking-widest text-green-400 [text-shadow:0_0_16px_rgba(34,197,94,0.55)]">
              EL CAMINO
            </h1>
            <p className="mt-3 font-pixel-mono text-base leading-snug text-ink-muted">
              Toda leyenda empieza sin nombre. Forja el tuyo: cada rango que
              conquistes despertara una nueva clase en tu sangre.
            </p>
          </header>

          <section className="relative border-2 border-green-500/60 bg-card p-6 sm:p-8 shadow-[0_0_0_4px_rgba(10,10,15,0.6),0_0_60px_rgba(34,197,94,0.2)]">
            <PixelCorners size="md" className="border-green-500/60" />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {/* DESBLOQUEADAS — personal progress (1 + userTier),
                  not the catalog total. The user wanted to see what
                  they've actually unlocked, not the abstract count of
                  what exists in the game. */}
              <div className="border-2 border-border bg-page p-3 text-center">
                <p className="font-pixel text-[8px] tracking-widest text-ink-faint">
                  DESBLOQUEADAS
                </p>
                <p className="mt-2 font-pixel text-lg text-green-400 [text-shadow:0_0_10px_rgba(34,197,94,0.4)]">
                  {stats?.unlockedClasses ?? 1}
                </p>
              </div>
              {/* RANGO — current rank letter (F/E/D/C/B/A/S) painted
                  in the rank's own palette so it visually echoes the
                  RankBadge inside the panteon modal. The previous "7"
                  was the static total of ranks, which the user already
                  knows from the ladder elsewhere. */}
              <div className="border-2 border-border bg-page p-3 text-center">
                <p className="font-pixel text-[8px] tracking-widest text-ink-faint">
                  RANGO
                </p>
                <p
                  className="mt-2 font-pixel text-lg"
                  style={{
                    color: styleForRank(stats?.currentRank ?? 'F').text,
                    textShadow: `0 0 10px ${styleForRank(stats?.currentRank ?? 'F').glow}`,
                  }}
                >
                  {stats?.currentRank ?? 'F'}
                </p>
              </div>
              {/* TU CLASE — class name only, no decorative diamond
                  glyph in front (it duplicated the eyebrow's ◆ and
                  read as part of the class name). */}
              <div className="col-span-2 border-2 border-border bg-page p-3 text-center sm:col-span-1">
                <p className="font-pixel text-[8px] tracking-widest text-ink-faint">
                  TU CLASE
                </p>
                <p className="mt-2 font-pixel text-base text-green-400 [text-shadow:0_0_10px_rgba(34,197,94,0.4)] uppercase">
                  {stats?.currentName ?? 'Iniciado'}
                </p>
              </div>
            </div>

            <p className="mt-6 text-center font-pixel-mono text-base leading-snug text-ink-muted">
              Abre el panteon y contempla los caminos que aun no son tuyos. Cada
              heroe deja huella en alguno de ellos.
            </p>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="font-pixel text-xs sm:text-sm tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-8 py-3.5 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_20px_rgba(34,197,94,0.45)]"
              >
                ▶ ABRIR PANTEON
              </button>
            </div>
          </section>

          <ClassPanteonModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            catalog={c}
            realState={state}
          />
        </div>
      )}
      </AsyncState>
    </>
  );
};
