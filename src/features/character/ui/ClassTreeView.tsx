import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useCharacterState } from '../../../context/hooks/useCharacterState';
import { AsyncState } from '../../../shared/components/AsyncState';
import { PixelCorners } from '../../../shared/components/PixelCorners';
import type {
  LegendaryClass,
  LineageId,
  NoviceClass,
  SpecializationClass,
  VocationClass,
} from '../core/domain/models/CharacterClass';
import type { ClassCatalog } from '../core/domain/models/ClassCatalog';
import { useClassCatalog } from './hooks/useClassCatalog';

// ────────────────────────────────────────────────────────────────────────
// Tree node visual states.
// ────────────────────────────────────────────────────────────────────────
type NodeStatus = 'current' | 'owned' | 'alternate' | 'future';

interface NodeData {
  id: string;
  tier: number;
  name: string;
  frase: string;
  status: NodeStatus;
}

interface PositionedNode extends NodeData {
  x: number;
  y: number;
}

const STATUS_STYLE: Record<NodeStatus, string> = {
  current:
    'border-green-400 bg-green-500/20 text-green-400 shadow-[0_0_22px_rgba(34,197,94,0.65)]',
  owned: 'border-green-500/60 bg-green-500/10 text-green-400/90',
  alternate: 'border-border bg-card text-ink-muted',
  future: 'border-border-muted bg-card text-ink-disabled',
};

const STATUS_GLYPH: Record<NodeStatus, string> = {
  current: '◆',
  owned: '◇',
  alternate: '·',
  future: '·',
};

const STATUS_LABEL: Record<NodeStatus, string> = {
  current: 'TU CLASE ACTUAL',
  owned: 'YA RECORRIDO',
  alternate: 'CAMINO ALTERNATIVO',
  future: 'BLOQUEADO',
};

// ────────────────────────────────────────────────────────────────────────
// Map geometry. Wide canvas with generous tier spacing — the user pans
// inside, so density isn't a constraint. More breathing room reads as
// "exploration" rather than "dashboard". Vertical gaps in particular are
// large so the curved connector lines have room to arc without crossing
// each other into a tangle.
// ────────────────────────────────────────────────────────────────────────
const NODE_W = 140;
const NODE_H = 60;
const CANVAS_W = 3300;
const CANVAS_H = 1900;

// 6 lineage anchor positions used only when the user is at T0 and the six
// vocations are spread out as upcoming-choice options. From T1 onwards the
// tree collapses to a centred column (see CENTER_X / PATH_*_OFFSETS) and
// these column anchors are unused.
const LINEAGE_COL_X: Record<LineageId, number> = {
  GUERRERO: 280,
  PALADIN: 820,
  CAZADOR: 1360,
  PICARO: 1900,
  MONJE: 2440,
  DRUIDA: 2980,
};

const NOVICE_POS = { x: CANVAS_W / 2 - NODE_W / 2, y: 120 };
const VOCATION_Y = 460;
const SPEC_Y = 800;
// T3 lives on a single row, distributed across the canvas — same fan
// principle as T2 (one tier of choices per Y, no vertical stacking).
const LEGENDARY_Y = 1180;
const TRANSCENDENT_Y = 1480;
const SUPREMO_POS = { x: CANVAS_W / 2 - NODE_W / 2, y: 1660 };
const LEYENDA_POS = { x: CANVAS_W / 2 - NODE_W / 2, y: 1820 };

// Horizontal divider lines drawn between tier bands so the user can read
// at a glance "this row of nodes is T2". Y values sit halfway between the
// bottom of one tier and the top of the next.
const TIER_DIVIDERS_Y = [
  (NOVICE_POS.y + NODE_H + VOCATION_Y) / 2, // T0 ↔ T1
  (VOCATION_Y + NODE_H + SPEC_Y) / 2, // T1 ↔ T2
  (SPEC_Y + NODE_H + LEGENDARY_Y) / 2, // T2 ↔ T3
  (LEGENDARY_Y + NODE_H + TRANSCENDENT_Y) / 2, // T3 ↔ T4
  (TRANSCENDENT_Y + NODE_H + SUPREMO_POS.y) / 2, // T4 ↔ T5
  (SUPREMO_POS.y + NODE_H + LEYENDA_POS.y) / 2, // T5 ↔ T6
];

const center = (pos: { x: number; y: number }) => ({
  x: pos.x + NODE_W / 2,
  y: pos.y + NODE_H / 2,
});

// ────────────────────────────────────────────────────────────────────────
// Status detection.
// ────────────────────────────────────────────────────────────────────────
interface OwnedIds {
  vocationId: string | null;
  specializationId: string | null;
  legendaryId: string | null;
  isMaestroSupremo: boolean;
  isLeyenda: boolean;
  /** Highest tier the user has actually reached. Anything above this is
   *  rendered as a `???` silhouette — progressive reveal that matches the
   *  rest of the app's "you don't know what's coming" treatment. */
  userTier: number;
}

const deriveUserTier = (
  state: ReturnType<typeof useCharacterState>['state']
): number => {
  if (state?.isMaestroSupremo && state.isLeyenda) return 6;
  if (state?.isMaestroSupremo) return 5;
  if (state?.legendaryStage === 'TRANSCENDENT') return 4;
  if (state?.legendary) return 3;
  if (state?.specialization) return 2;
  if (state?.vocation) return 1;
  return 0;
};

const noviceStatus = (owned: OwnedIds): NodeStatus =>
  owned.userTier > 0 ? 'owned' : 'current';

const vocationStatus = (
  vocation: VocationClass,
  owned: OwnedIds
): NodeStatus => {
  // Tier 1 hidden until the user has reached at least T1 — without this
  // a fresh user lands on /clases and immediately sees the names of all
  // six lineages, which spoils the discovery moment of the tier-up modal.
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
  if (spec.lineage !== owned.vocationId) return 'alternate';
  if (owned.specializationId === spec.id) {
    return owned.legendaryId ? 'owned' : 'current';
  }
  return 'alternate';
};

const legendaryStatus = (leg: LegendaryClass, owned: OwnedIds): NodeStatus => {
  if (owned.userTier < 3) return 'future';
  if (owned.legendaryId === leg.id) {
    // Once the user reaches T4 (transcendent) or beyond, the T3 form is
    // historical — "owned" reads better than "current" since the bright
    // ring should now belong to the T4 transcendent above the same column.
    return owned.userTier >= 4 ? 'owned' : 'current';
  }
  return 'alternate';
};

// T4 transcendents are stage upgrades of each T3 legendary. Same parent →
// same node identity; the only thing that changes is the displayed name.
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

const buildOwned = (
  state: ReturnType<typeof useCharacterState>['state']
): OwnedIds => ({
  vocationId: state?.vocation?.id ?? null,
  specializationId: state?.specialization?.id ?? null,
  legendaryId: state?.legendary?.id ?? null,
  isMaestroSupremo: state?.isMaestroSupremo ?? false,
  isLeyenda: state?.isLeyenda ?? false,
  userTier: deriveUserTier(state),
});

const toNode = (
  raw: NoviceClass | VocationClass | SpecializationClass | LegendaryClass,
  status: NodeStatus,
  pos: { x: number; y: number }
): PositionedNode => ({
  id: raw.id,
  tier: raw.tier,
  name: raw.name,
  frase: raw.frase,
  status,
  x: pos.x,
  y: pos.y,
});

interface TreeEdge {
  from: { x: number; y: number };
  to: { x: number; y: number };
  key: string;
  /** True when both endpoints belong to the user's actual path (current or
   *  owned). Drives the visual: highlighted edges render bright, the rest
   *  fade into ambient background so the spec→legendary fan doesn't read
   *  as a tangled mess. */
  highlighted: boolean;
}

interface BuiltTree {
  novice: PositionedNode;
  vocations: PositionedNode[];
  specs: PositionedNode[];
  legendaries: PositionedNode[];
  /** One transcendent node per legendary — the T4 stage upgrade. Sits
   *  directly below its parent legendary so the T3↔T4 line is a clean
   *  vertical drop. */
  transcendents: PositionedNode[];
  edges: TreeEdge[];
  /** Forwarded from buildOwned so the render layer can gate the T4-T6
   *  placeholder visibility without re-deriving from CharacterState. */
  userTier: number;
}

const isOnPath = (status: NodeStatus): boolean =>
  status === 'current' || status === 'owned';

// Linear path layout — once the user has chosen any class, only their
// branch of the tree is rendered. The path collapses to a vertical column
// down the centre of the canvas: 1 vocation → 3 specs → 2 legendaries →
// 1 transcendent. The 6-lineage spread layout is only used at T0 (when
// the user is about to make their first choice and the six options
// matter equally).
const CENTER_X = CANVAS_W / 2;
const PATH_SPEC_OFFSETS = [-220, 0, 220] as const;
const PATH_LEGENDARY_OFFSETS = [-110, 110] as const;

const buildTree = (
  catalog: ClassCatalog,
  state: ReturnType<typeof useCharacterState>['state']
): BuiltTree => {
  const owned = buildOwned(state);

  const novice = toNode(catalog.novice, noviceStatus(owned), NOVICE_POS);

  // T1 — at T0 (user hasn't chosen yet), spread all 6 vocations across the
  // canvas as the upcoming choice. From T1 onwards, only render the user's
  // chosen vocation, centred under the canvas, so the rest of the tree
  // can flow as a vertical column without other lineages cluttering the
  // view.
  const vocations: PositionedNode[] =
    owned.userTier === 0
      ? catalog.vocations.map((v) =>
          toNode(v, vocationStatus(v, owned), {
            x: LINEAGE_COL_X[v.id] - NODE_W / 2,
            y: VOCATION_Y,
          })
        )
      : catalog.vocations
          .filter((v) => v.id === owned.vocationId)
          .map((v) =>
            toNode(v, vocationStatus(v, owned), {
              x: CENTER_X - NODE_W / 2,
              y: VOCATION_Y,
            })
          );

  // T2 — visible only once the user has chosen a vocation. Renders the
  // three specs of that lineage, fanned ±220 around centre. Other
  // lineages' specs are filtered out entirely.
  const specs: PositionedNode[] =
    owned.userTier >= 1 && owned.vocationId !== null
      ? catalog.specializations
          .filter((s) => s.lineage === owned.vocationId)
          .map((spec, i) => {
            const offset = PATH_SPEC_OFFSETS[i] ?? 0;
            return toNode(spec, specializationStatus(spec, owned), {
              x: CENTER_X + offset - NODE_W / 2,
              y: SPEC_Y,
            });
          })
      : [];

  // T3 — visible only once the user has chosen a spec. Renders the two
  // legendaries reachable from that spec via legendaryOptions.
  const reachableLegendaryIds: string[] = (() => {
    if (owned.userTier < 2 || owned.specializationId === null) return [];
    const userSpec = catalog.specializations.find(
      (s) => s.id === owned.specializationId
    );
    return userSpec ? [...userSpec.legendaryOptions] : [];
  })();

  const legendaries: PositionedNode[] = reachableLegendaryIds
    .map((legId, i) => {
      const leg = catalog.legendaries.find((l) => l.id === legId);
      if (!leg) return null;
      const offset = PATH_LEGENDARY_OFFSETS[i] ?? 0;
      return toNode(leg, legendaryStatus(leg, owned), {
        x: CENTER_X + offset - NODE_W / 2,
        y: LEGENDARY_Y,
      });
    })
    .filter((n): n is PositionedNode => n !== null);

  // T4 — single transcendent (the user's). Visible only once the user has
  // a legendary set; sits directly below it.
  const transcendents: PositionedNode[] =
    owned.userTier >= 3 && owned.legendaryId !== null
      ? catalog.legendaries
          .filter((l) => l.id === owned.legendaryId)
          .map((leg) => {
            const parent = legendaries.find((l) => l.id === leg.id);
            return {
              id: `${leg.id}-T4`,
              tier: 4 as const,
              name: leg.transcendentName,
              frase: leg.transcendentFrase,
              status: transcendentStatus(leg, owned),
              x: parent?.x ?? CENTER_X - NODE_W / 2,
              y: TRANSCENDENT_Y,
            };
          })
      : [];

  const edges: TreeEdge[] = [];

  vocations.forEach((v) => {
    edges.push({
      from: center(NOVICE_POS),
      to: center({ x: v.x, y: v.y }),
      key: `n-${v.id}`,
      highlighted: isOnPath(novice.status) && isOnPath(v.status),
    });
  });

  // T1 → T2 — only the chosen vocation has children (others are filtered
  // out). Each spec connects to the one visible vocation.
  specs.forEach((spec) => {
    const parent = vocations.find((v) => v.id === owned.vocationId);
    if (!parent) return;
    edges.push({
      from: center({ x: parent.x, y: parent.y }),
      to: center({ x: spec.x, y: spec.y }),
      key: `${parent.id}-${spec.id}`,
      highlighted: isOnPath(parent.status) && isOnPath(spec.status),
    });
  });

  // T2 → T3 — only edges from the chosen spec to its two legendaries.
  legendaries.forEach((leg) => {
    const parent = specs.find((s) => s.id === owned.specializationId);
    if (!parent) return;
    edges.push({
      from: center({ x: parent.x, y: parent.y }),
      to: center({ x: leg.x, y: leg.y }),
      key: `${parent.id}-${leg.id}`,
      highlighted: isOnPath(parent.status) && isOnPath(leg.status),
    });
  });

  // T3 → T4 — vertical drops since each transcendent shares its parent
  // legendary's x coordinate. Highlighted when the user has actually
  // reached T4 with this specific legendary.
  legendaries.forEach((leg) => {
    const t4 = transcendents.find((t) => t.id === `${leg.id}-T4`);
    if (!t4) return;
    edges.push({
      from: center({ x: leg.x, y: leg.y }),
      to: center({ x: t4.x, y: t4.y }),
      key: `${leg.id}-t4`,
      highlighted: isOnPath(leg.status) && isOnPath(t4.status),
    });
  });

  return {
    novice,
    vocations,
    specs,
    legendaries,
    transcendents,
    edges,
    userTier: owned.userTier,
  };
};

/**
 * Cubic-Bezier path string from one node center to another, biased so the
 * curve flows mostly vertically (control points pinch the x-axis at the
 * midpoint Y). Reads as a smooth S-shape between tiers, much less
 * "marabunta" than straight lines especially when several edges converge
 * on the same node.
 */
const curvedPath = (
  from: { x: number; y: number },
  to: { x: number; y: number }
): string => {
  const midY = (from.y + to.y) / 2;
  return `M ${from.x},${from.y} C ${from.x},${midY} ${to.x},${midY} ${to.x},${to.y}`;
};

// ────────────────────────────────────────────────────────────────────────
// Node card.
// ────────────────────────────────────────────────────────────────────────
const ClassNode = ({
  node,
  onSelect,
  isSelected,
}: {
  node: PositionedNode;
  onSelect: (node: PositionedNode) => void;
  isSelected: boolean;
}): React.JSX.Element => {
  const interactive = node.status !== 'future';
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        if (interactive) onSelect(node);
      }}
      disabled={!interactive}
      title={node.status === 'future' ? 'Bloqueado' : node.frase}
      style={{
        left: node.x,
        top: node.y,
        width: NODE_W,
        height: NODE_H,
      }}
      className={`absolute flex flex-col items-center justify-center gap-0.5 border-2 px-2 py-1 text-center transition-transform ${STATUS_STYLE[node.status]} ${interactive ? 'hover:scale-[1.06] cursor-pointer' : 'cursor-not-allowed'} ${isSelected ? 'ring-2 ring-green-400 ring-offset-2 ring-offset-page' : ''}`}
    >
      <span className="font-pixel text-[10px] leading-none">
        {STATUS_GLYPH[node.status]}
      </span>
      <span className="font-pixel text-[9px] leading-tight tracking-widest uppercase break-words">
        {node.status === 'future' ? '???' : node.name}
      </span>
    </button>
  );
};

// ────────────────────────────────────────────────────────────────────────
// Detail panel.
// ────────────────────────────────────────────────────────────────────────
const DetailPanel = ({
  node,
}: {
  node: PositionedNode | null;
}): React.JSX.Element => {
  if (!node) {
    return (
      <div className="border-2 border-dashed border-border bg-card p-4 text-center">
        <p className="font-pixel-mono text-base text-ink-faint">
          Arrastra el mapa para explorarlo. Pulsa una clase para ver su
          descripción.
        </p>
      </div>
    );
  }
  return (
    <motion.div
      key={node.id}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="relative border-2 border-green-500/50 bg-card p-4 shadow-[0_0_18px_rgba(34,197,94,0.18)]"
    >
      <PixelCorners size="sm" className="border-green-500/50" />
      <p className="font-pixel text-[8px] tracking-widest text-green-500">
        T{node.tier} · {STATUS_GLYPH[node.status]} {STATUS_LABEL[node.status]}
      </p>
      <h3 className="mt-2 font-pixel text-sm leading-relaxed text-green-400 [text-shadow:0_0_12px_rgba(34,197,94,0.4)]">
        {node.status === 'future' ? 'CLASE OCULTA' : node.name.toUpperCase()}
      </h3>
      <p className="mt-2 font-pixel-mono text-lg italic leading-snug text-ink">
        {node.status === 'future'
          ? 'Llega a este punto del camino para revelar su nombre y su frase.'
          : `“${node.frase}”`}
      </p>
    </motion.div>
  );
};

// ────────────────────────────────────────────────────────────────────────
// Pan controller — drag-to-scroll on desktop, native touch scroll on
// mobile. Hijacks mousedown/move/up to translate the container's scroll
// position when the user drags the canvas itself.
// ────────────────────────────────────────────────────────────────────────
const usePanControl = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{
    startX: number;
    startY: number;
    scrollLeft: number;
    scrollTop: number;
  } | null>(null);
  const [dragging, setDragging] = useState(false);

  const onMouseDown = (e: React.MouseEvent): void => {
    if (!containerRef.current) return;
    dragStateRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      scrollLeft: containerRef.current.scrollLeft,
      scrollTop: containerRef.current.scrollTop,
    };
    setDragging(true);
  };

  const onMouseMove = (e: React.MouseEvent): void => {
    if (!dragStateRef.current || !containerRef.current) return;
    const dx = e.clientX - dragStateRef.current.startX;
    const dy = e.clientY - dragStateRef.current.startY;
    containerRef.current.scrollLeft = dragStateRef.current.scrollLeft - dx;
    containerRef.current.scrollTop = dragStateRef.current.scrollTop - dy;
  };

  const stop = (): void => {
    dragStateRef.current = null;
    setDragging(false);
  };

  return {
    containerRef,
    dragging,
    onMouseDown,
    onMouseMove,
    onMouseUp: stop,
    onMouseLeave: stop,
  };
};

// ────────────────────────────────────────────────────────────────────────
// Tree map — the canvas with all the nodes + line layer + tier bands.
// Reused inside the modal but extracted so it could be embedded elsewhere
// later (e.g. a small embedded teaser on the dashboard).
// ────────────────────────────────────────────────────────────────────────
const ClassTreeMap = ({
  tree,
  selected,
  onSelect,
  onCenterReady,
  zoom,
  onZoomDelta,
}: {
  tree: BuiltTree;
  selected: PositionedNode | null;
  onSelect: (node: PositionedNode) => void;
  /** Fires once on mount with the initial pan position so the parent can
   *  scroll the user's current node into view. */
  onCenterReady?: (containerEl: HTMLDivElement | null) => void;
  /** Scale factor applied to the inner canvas. 1.0 = 100%, < 1 zooms out
   *  (more of the tree fits in the viewport), > 1 zooms in. The outer
   *  scroll-wrapper is sized to CANVAS × zoom so scrollbars stay accurate. */
  zoom: number;
  /** Called when the user pinches on a trackpad or holds Ctrl/Cmd while
   *  scrolling the wheel. Delta is the raw wheel deltaY — the modal owns
   *  the clamping and step size. */
  onZoomDelta?: (deltaY: number) => void;
}): React.JSX.Element => {
  const pan = usePanControl();

  useEffect(() => {
    onCenterReady?.(pan.containerRef.current);
    // Run only once after the container mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Trackpad pinch (browsers fire wheel + ctrlKey:true on pinch) and
  // Ctrl/Cmd+wheel on a regular mouse. Native listener with passive:false
  // is required because React's synthetic onWheel registers a passive
  // handler that can't preventDefault, which causes the browser to
  // hijack the gesture as page zoom.
  useEffect(() => {
    const el = pan.containerRef.current;
    if (!el || !onZoomDelta) return;
    const handler = (e: WheelEvent): void => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      onZoomDelta(e.deltaY);
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [onZoomDelta, pan.containerRef]);

  return (
    // Hidden scrollbars: the experience reads as a "map you drag", not a
    // "div with two scrollbars". Drag-to-pan still works; touch scroll
    // still works; only the visual handles disappear.
    <div
      ref={pan.containerRef}
      onMouseDown={pan.onMouseDown}
      onMouseMove={pan.onMouseMove}
      onMouseUp={pan.onMouseUp}
      onMouseLeave={pan.onMouseLeave}
      className={`relative h-full w-full overflow-auto bg-page [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${pan.dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
    >
      {/* Outer scroll wrapper sized to the SCALED canvas, so scrollbars
          (and our drag-to-pan, which uses scrollLeft/Top) stay accurate
          after zooming. `mx-auto` centres the wrapper inside the scroll
          container when the scaled canvas is narrower than the viewport
          (typical at <50% zoom — without this the canvas would hug the
          left edge and the right half of the modal would feel "in
          desuso"). When the scaled canvas is wider than the viewport,
          mx-auto resolves to zero margins and the user scrolls naturally.
          The inner canvas keeps its native dimensions and uses CSS scale
          on top-left origin — coordinates inside (node positions, SVG
          line endpoints) stay 1:1 with the constants and are simply
          rendered larger or smaller. */}
      <div
        className="mx-auto"
        style={{
          width: CANVAS_W * zoom,
          height: CANVAS_H * zoom,
        }}
      >
        <div
          className="relative origin-top-left"
          style={{
            width: CANVAS_W,
            height: CANVAS_H,
            transform: `scale(${zoom})`,
          }}
        >
          {/* Sparse dot field — far less visually loud than a square grid,
            but enough to anchor the eye and tell the user the canvas is
            finite (not just bg-page). 90px spacing keeps the pattern
            almost-decorative without overwhelming the lines or nodes. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(34,197,94,0.10) 1.5px, transparent 1.5px)',
              backgroundSize: '90px 90px',
            }}
          />

          {/* SVG layer — drawn under the nodes. Two passes:
              1. Low-opacity ambient edges (the catalog topology in the
                 background), so the user can faintly see how everything
                 connects without it looking like a tangled mess.
              2. A second pass for highlighted edges (the user's actual
                 path), drawn brighter and thicker on top so it visually
                 lifts off the ambient layer.
            All edges are cubic Beziers — straight lines from many specs
            converging on a few cross-lineage legendaries was the worst
            offender for visual tangling. */}
          <svg
            aria-hidden="true"
            width={CANVAS_W}
            height={CANVAS_H}
            className="absolute left-0 top-0 pointer-events-none"
          >
            {/* Horizontal dividers between tier bands. Faintly visible so
              the user can read tier boundaries even when zoomed in on a
              single column. Drawn first so the connection curves go on
              top of them. */}
            {TIER_DIVIDERS_Y.map((y, i) => (
              <line
                key={`divider-${i}`}
                x1={0}
                x2={CANVAS_W}
                y1={y}
                y2={y}
                stroke="rgba(34,197,94,0.08)"
                strokeWidth={1}
                strokeDasharray="2 8"
              />
            ))}

            {tree.edges
              .filter((edge) => !edge.highlighted)
              .map((edge) => (
                <path
                  key={edge.key}
                  d={curvedPath(edge.from, edge.to)}
                  fill="none"
                  stroke="rgba(34,197,94,0.10)"
                  strokeWidth={1.5}
                />
              ))}
            {tree.edges
              .filter((edge) => edge.highlighted)
              .map((edge) => (
                <path
                  key={`hl-${edge.key}`}
                  d={curvedPath(edge.from, edge.to)}
                  fill="none"
                  stroke="rgba(34,197,94,0.85)"
                  strokeWidth={3}
                  style={{
                    filter: 'drop-shadow(0 0 6px rgba(34,197,94,0.55))',
                  }}
                />
              ))}
          </svg>

          {/* Tier band labels — anchored to the canvas left edge. */}
          {[
            { y: NOVICE_POS.y + NODE_H / 2, label: 'T0' },
            { y: VOCATION_Y + NODE_H / 2, label: 'T1' },
            { y: SPEC_Y + NODE_H / 2, label: 'T2' },
            { y: LEGENDARY_Y + NODE_H / 2, label: 'T3' },
            { y: TRANSCENDENT_Y + NODE_H / 2, label: 'T4' },
            { y: SUPREMO_POS.y + NODE_H / 2, label: 'T5' },
            { y: LEYENDA_POS.y + NODE_H / 2, label: 'T6' },
          ].map((band) => (
            <span
              key={band.label}
              aria-hidden="true"
              className="absolute -translate-y-1/2 font-pixel text-[10px] tracking-widest text-green-500/50"
              style={{ left: 24, top: band.y }}
            >
              {band.label}
            </span>
          ))}

          <ClassNode
            node={tree.novice}
            onSelect={onSelect}
            isSelected={selected?.id === tree.novice.id}
          />
          {tree.vocations.map((v) => (
            <ClassNode
              key={v.id}
              node={v}
              onSelect={onSelect}
              isSelected={selected?.id === v.id}
            />
          ))}
          {tree.specs.map((s) => (
            <ClassNode
              key={s.id}
              node={s}
              onSelect={onSelect}
              isSelected={selected?.id === s.id}
            />
          ))}
          {tree.legendaries.map((l) => (
            <ClassNode
              key={l.id}
              node={l}
              onSelect={onSelect}
              isSelected={selected?.id === l.id}
            />
          ))}
          {/* T4 — 12 transcendent nodes, one directly below each T3 legendary.
            Each one is the upgraded form of its parent (legendary.transcendentName).
            Renders the same `???` silhouette as any other future node when
            the user hasn't reached T4 with that specific T3 lineage. */}
          {tree.transcendents.map((t) => (
            <ClassNode
              key={t.id}
              node={t}
              onSelect={onSelect}
              isSelected={selected?.id === t.id}
            />
          ))}

          {/* T5 + T6 — singletons that don't appear in the catalog. Only
              rendered once the user has actually reached that prestige
              tier; before then the node is hidden entirely (consistent
              with the rest of the tree's "your branch only" treatment). */}
          {tree.userTier >= 5 && (
            <div
              style={{
                left: SUPREMO_POS.x,
                top: SUPREMO_POS.y,
                width: NODE_W,
                height: NODE_H,
              }}
              className="absolute flex flex-col items-center justify-center border-2 border-green-500/60 bg-green-500/10 text-green-400 text-center"
            >
              <p className="font-pixel text-[8px] tracking-widest text-green-500">
                T5
              </p>
              <p className="mt-0.5 font-pixel text-[9px] tracking-widest">
                MAESTRO
              </p>
            </div>
          )}
          {tree.userTier >= 6 && (
            <div
              style={{
                left: LEYENDA_POS.x,
                top: LEYENDA_POS.y,
                width: NODE_W,
                height: NODE_H,
              }}
              className="absolute flex flex-col items-center justify-center border-2 border-green-500/60 bg-green-500/10 text-green-400 text-center"
            >
              <p className="font-pixel text-[8px] tracking-widest text-green-500">
                T6
              </p>
              <p className="mt-0.5 font-pixel text-[9px] tracking-widest">
                LEYENDA
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────
// Modal — fullscreen overlay containing the map. Open/close keyboarded
// with ESC, focus management is light because the only interactive
// elements inside are the node buttons and they're already
// keyboard-reachable.
// ────────────────────────────────────────────────────────────────────────
// Synthesizes a CharacterState that matches the requested tier, used by
// the "preview" buttons in the modal header to render the tree as if the
// user were at any tier without actually progressing them. Picks
// deterministic representatives (first GUERRERO vocation → first GUERRERO
// spec → first legendary option of that spec) so the preview always shows
// the same path; the goal is "see what each tier looks like", not
// "explore alternates".
const synthStateForTier = (
  tier: number,
  catalog: ClassCatalog
): ReturnType<typeof useCharacterState>['state'] => {
  const vocation = catalog.vocations.find((v) => v.id === 'GUERRERO') ?? null;
  const spec =
    catalog.specializations.find((s) => s.lineage === 'GUERRERO') ?? null;
  const leg =
    spec && spec.legendaryOptions[0]
      ? (catalog.legendaries.find((l) => l.id === spec.legendaryOptions[0]) ??
        null)
      : null;

  return {
    currentTier: Math.min(tier, 6) as 0 | 1 | 2 | 3 | 4 | 5 | 6,
    heroLevel: tier * 12,
    novice: catalog.novice,
    vocation: tier >= 1 ? vocation : null,
    specialization: tier >= 2 ? spec : null,
    legendary: tier >= 3 ? leg : null,
    legendaryStage: tier >= 4 ? 'TRANSCENDENT' : tier >= 3 ? 'NORMAL' : null,
    isMaestroSupremo: tier >= 5,
    isLeyenda: tier >= 6,
    pendingChoice: null,
  };
};

const ClassTreeModal = ({
  open,
  onClose,
  tree,
  catalog,
}: {
  open: boolean;
  onClose: () => void;
  tree: BuiltTree;
  catalog: ClassCatalog;
}): React.JSX.Element | null => {
  const [selected, setSelected] = useState<PositionedNode | null>(null);
  const [previewTier, setPreviewTier] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const prefersReducedMotion = useReducedMotion();

  // When a preview tier is selected, rebuild the tree locally with a synth
  // state instead of the user's actual one. Lets the user click through
  // T0..T6 to see what each progression looks like without touching their
  // real character.
  const effectiveTree =
    previewTier !== null
      ? buildTree(catalog, synthStateForTier(previewTier, catalog))
      : tree;

  // Zoom helpers. Range chosen so the user can see the entire 3300×1900
  // canvas at ~0.4× on a typical viewport (FIT button computes this
  // automatically) and zoom in to 1.5× for detail. Outside that the
  // canvas either disappears (too zoomed out) or makes nodes useless
  // big (too zoomed in).
  const ZOOM_MIN = 0.3;
  const ZOOM_MAX = 1.5;
  const ZOOM_STEP = 0.1;
  const zoomIn = (): void =>
    setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)));
  const zoomOut = (): void =>
    setZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)));
  const zoomReset = (): void => setZoom(1);

  // Center the user's current node in the viewport when the modal opens —
  // most users land on /clases to "see where I am", not "see the whole
  // catalog from the top". Only the first time per modal open.
  const handleCenter = (containerEl: HTMLDivElement | null): void => {
    if (!containerEl) return;
    const allNodes = [
      effectiveTree.novice,
      ...effectiveTree.vocations,
      ...effectiveTree.specs,
      ...effectiveTree.legendaries,
      ...effectiveTree.transcendents,
    ];
    const current = allNodes.find((n) => n.status === 'current');
    if (!current) return;
    const targetX = current.x + NODE_W / 2 - containerEl.clientWidth / 2;
    const targetY = current.y + NODE_H / 2 - containerEl.clientHeight / 2;
    containerEl.scrollLeft = Math.max(0, targetX);
    containerEl.scrollTop = Math.max(0, targetY);
  };

  // Re-center whenever the preview tier changes — without this, switching
  // from T2 to T6 keeps the viewport fixed where T2 was, leaving T6 off
  // screen.
  useEffect(() => {
    // Wait one frame so the canvas has the new content before scrolling.
    const timer = window.requestAnimationFrame(() => {
      // Querying via ref here would require lifting it out of usePanControl.
      // Cheaper: trust handleCenter to re-fire on the next render.
    });
    return () => window.cancelAnimationFrame(timer);
  }, [previewTier]);

  // Reset preview when modal closes so reopening starts on the real state.
  useEffect(() => {
    if (!open) setPreviewTier(null);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    // Lock body scroll while the modal is open so the page beneath doesn't
    // bounce when the user pans the map past its edges.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  // Reset selection on close so reopening starts clean.
  useEffect(() => {
    if (!open) setSelected(null);
  }, [open]);

  if (!open) return null;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="class-tree-modal-title"
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={prefersReducedMotion ? undefined : { opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex flex-col bg-page"
    >
      {/* Close button rendered via portal directly into document.body so
          NO ancestor (framer-motion's transform layer, the modal flex
          column, anything else) can mask, reposition, or stacking-context
          its way over it. Inline styles too — bypasses any tailwind
          override that might have been hiding it. */}
      {createPortal(
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar mapa"
          style={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 99999,
            width: 56,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid rgba(239, 68, 68, 0.8)',
            background: 'rgba(239, 68, 68, 0.2)',
            color: 'rgb(252, 165, 165)',
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '20px',
            cursor: 'pointer',
            boxShadow: '0 0 18px rgba(239,68,68,0.5)',
          }}
        >
          ✕
        </button>,
        document.body
      )}

      <header className="flex flex-col gap-3 border-b-2 border-green-500/40 bg-card px-4 py-3 pr-20 shadow-[0_0_18px_rgba(34,197,94,0.2)]">
        {/* `pr-20` reserves room on the right for the floating close
            button so the title/preview row never reaches under it. */}
        <div>
          <p className="font-pixel text-[8px] tracking-widest text-green-500">
            ◆ DESTINO
          </p>
          <h2
            id="class-tree-modal-title"
            className="mt-1 font-pixel text-sm tracking-widest text-green-400 [text-shadow:0_0_12px_rgba(34,197,94,0.5)]"
          >
            EL CAMINO
          </h2>
        </div>

        {/* Tier preview controls — second row, always visible regardless
            of viewport width. Click any TX to see how the tree renders at
            that progression stage without actually advancing the user's
            character. REAL returns to the real state. */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-pixel text-[8px] tracking-widest text-ink-faint">
            VISTA PREVIA:
          </span>
          {[0, 1, 2, 3, 4, 5, 6].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setPreviewTier(t)}
              className={`font-pixel text-[9px] tracking-widest border-2 px-2 py-1.5 transition-colors ${previewTier === t ? 'border-green-400 bg-green-500/15 text-green-400 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'border-border bg-card text-ink-muted hover:border-green-500/40 hover:text-green-400'}`}
              aria-label={`Vista previa tier ${t}`}
              aria-pressed={previewTier === t}
            >
              T{t}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPreviewTier(null)}
            className={`font-pixel text-[9px] tracking-widest border-2 px-2 py-1.5 transition-colors ${previewTier === null ? 'border-green-400 bg-green-500/15 text-green-400' : 'border-border bg-card text-ink-muted hover:border-green-500/40 hover:text-green-400'}`}
            aria-pressed={previewTier === null}
          >
            REAL
          </button>
        </div>

        {/* Zoom row — three buttons + a current-percentage readout. The
            user pans inside a viewport of finite size, so being able to
            zoom out to see the whole tree (and back in for detail) is the
            other half of "navigable map" UX. */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-pixel text-[8px] tracking-widest text-ink-faint">
            ZOOM:
          </span>
          <button
            type="button"
            onClick={zoomOut}
            disabled={zoom <= ZOOM_MIN}
            className="font-pixel text-[10px] tracking-widest border-2 border-border bg-card text-ink-muted hover:border-green-500/40 hover:text-green-400 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-1.5 transition-colors"
            aria-label="Reducir zoom"
          >
            −
          </button>
          <span className="min-w-[3.5rem] text-center font-pixel text-[9px] tracking-widest text-green-400">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={zoomIn}
            disabled={zoom >= ZOOM_MAX}
            className="font-pixel text-[10px] tracking-widest border-2 border-border bg-card text-ink-muted hover:border-green-500/40 hover:text-green-400 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-1.5 transition-colors"
            aria-label="Aumentar zoom"
          >
            +
          </button>
          <button
            type="button"
            onClick={zoomReset}
            className="font-pixel text-[8px] tracking-widest border-2 border-border bg-card text-ink-muted hover:border-green-500/40 hover:text-green-400 px-2 py-1.5 transition-colors"
            aria-label="Restablecer zoom"
          >
            100%
          </button>
        </div>
      </header>

      <div className="relative flex-1 overflow-hidden">
        <ClassTreeMap
          tree={effectiveTree}
          selected={selected}
          onSelect={setSelected}
          onCenterReady={handleCenter}
          zoom={zoom}
          onZoomDelta={(deltaY) => {
            // Smooth multiplier — trackpad pinch produces small deltaY
            // chunks, mouse wheel fires bigger ones. 0.002 keeps both
            // gestures landing in a similar perceived speed.
            setZoom((z) => {
              const next = z - deltaY * 0.002;
              return Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, +next.toFixed(2)));
            });
          }}
        />

        {/* Floating detail panel — bottom-left, doesn't steal map space.
            Hidden until the user picks a node so the empty state doesn't
            clutter the experience. */}
        {selected && (
          <div className="pointer-events-none absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md">
            <div className="pointer-events-auto">
              <DetailPanel node={selected} />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ────────────────────────────────────────────────────────────────────────
// Main view — landing page with CTA that opens the modal.
// ────────────────────────────────────────────────────────────────────────
export const ClassTreeView = (): React.JSX.Element => {
  const { catalog, loading, error } = useClassCatalog();
  const { state } = useCharacterState();
  const [modalOpen, setModalOpen] = useState(false);

  const tree = useMemo(() => {
    if (!catalog) return null;
    return buildTree(catalog, state);
  }, [catalog, state]);

  // Quick stats for the landing card. CLASES counts the catalog total
  // (Iniciado + 6 vocations + 18 specs + 12 legendaries + Maestro Supremo
  // = 38). RANGOS is the user-progression path: T0 Iniciado → T1 Vocacion
  // → T2 Especialista → T3 Legendario → T4 Trascendente = 5 ranks. T5
  // Maestro and T6 Leyenda are endgame prestige states layered on top.
  const stats = useMemo(() => {
    if (!catalog) return null;
    const totalClasses =
      1 +
      catalog.vocations.length +
      catalog.specializations.length +
      catalog.legendaries.length +
      1;
    const current = tree
      ? [
          tree.novice,
          ...tree.vocations,
          ...tree.specs,
          ...tree.legendaries,
          ...tree.transcendents,
        ].find((n) => n.status === 'current')
      : null;
    return {
      totalClasses,
      currentRank: current?.name ?? 'Iniciado',
    };
  }, [catalog, tree]);

  return (
    <AsyncState
      loading={loading}
      error={error}
      data={tree}
      loadingLabel="CARGANDO CAMINO"
    >
      {(t) => (
        <div className="mx-auto max-w-4xl">
          <header className="mb-6">
            <p className="font-pixel text-[9px] tracking-widest text-green-500">
              ◆ DESTINO
            </p>
            <h1 className="mt-2 font-pixel text-base sm:text-lg tracking-widest text-green-400 [text-shadow:0_0_16px_rgba(34,197,94,0.55)]">
              EL CAMINO
            </h1>
            <p className="mt-3 font-pixel-mono text-xl leading-snug text-ink-muted">
              Tu árbol de clases. Cada sesión te empuja hacia el siguiente
              rango. Aquí ves dónde estás, lo que ya recorriste y lo que aún te
              espera.
            </p>
          </header>

          {/* Launch card — big retro panel with stats + CTA. The user clicks
              into a fullscreen exploration modal; keeping the map out of the
              page itself avoids the "tiny map embedded in a long document"
              feel the previous version had. */}
          <section className="relative border-2 border-green-500/60 bg-card p-6 sm:p-8 shadow-[0_0_0_4px_rgba(10,10,15,0.6),0_0_60px_rgba(34,197,94,0.2)]">
            <PixelCorners size="md" className="border-green-500/60" />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="border-2 border-border bg-page p-3 text-center">
                <p className="font-pixel text-[8px] tracking-widest text-ink-faint">
                  CLASES
                </p>
                <p className="mt-2 font-pixel text-lg text-green-400 [text-shadow:0_0_10px_rgba(34,197,94,0.4)]">
                  {stats?.totalClasses ?? 38}
                </p>
              </div>
              <div className="border-2 border-border bg-page p-3 text-center">
                <p className="font-pixel text-[8px] tracking-widest text-ink-faint">
                  RANGOS
                </p>
                <p className="mt-2 font-pixel text-lg text-green-400 [text-shadow:0_0_10px_rgba(34,197,94,0.4)]">
                  5
                </p>
              </div>
              <div className="col-span-2 border-2 border-border bg-page p-3 text-center sm:col-span-1">
                <p className="font-pixel text-[8px] tracking-widest text-ink-faint">
                  TU RANGO
                </p>
                <p className="mt-2 font-pixel text-base text-green-400 [text-shadow:0_0_10px_rgba(34,197,94,0.4)] uppercase">
                  ◆ {stats?.currentRank ?? 'Iniciado'}
                </p>
              </div>
            </div>

            <p className="mt-6 text-center font-pixel-mono text-lg leading-snug text-ink-muted">
              Arrastra el mapa para moverte por los siete rangos. Lo que brilla
              es tuyo, lo que está en silueta llegará.
            </p>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="font-pixel text-xs sm:text-sm tracking-widest bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-8 py-3.5 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_20px_rgba(34,197,94,0.45)]"
              >
                ▶ EXPLORAR EL ÁRBOL
              </button>
            </div>
          </section>

          {catalog && (
            <ClassTreeModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              tree={t}
              catalog={catalog}
            />
          )}
        </div>
      )}
    </AsyncState>
  );
};
