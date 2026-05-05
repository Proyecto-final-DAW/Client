import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';

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
import { useClassCatalog } from './hooks/useClassCatalog';

// ────────────────────────────────────────────────────────────────────────
// Tree node visual states. Drives both border + glow + icon variants.
// ────────────────────────────────────────────────────────────────────────
type NodeStatus = 'current' | 'owned' | 'alternate' | 'future';

interface NodeData {
  id: string;
  tier: number;
  name: string;
  frase: string;
  status: NodeStatus;
}

const STATUS_STYLE: Record<NodeStatus, string> = {
  current:
    'border-green-400 bg-green-500/15 text-green-400 shadow-[0_0_18px_rgba(34,197,94,0.55)]',
  owned: 'border-green-500/60 bg-green-500/8 text-green-400/90',
  alternate: 'border-border bg-card text-ink-muted',
  future: 'border-border-muted bg-card text-ink-disabled',
};

const STATUS_GLYPH: Record<NodeStatus, string> = {
  current: '◆',
  owned: '◇',
  alternate: '·',
  future: '·',
};

// 6 lineages laid out as columns. The order here is the visual reading
// order across the page — chosen to spread the dominant stats so adjacent
// columns feel different (strength, vigor, agility, stamina, tenacity,
// endurance is too clustered alphabetically).
const LINEAGE_ORDER: readonly LineageId[] = [
  'GUERRERO',
  'PALADIN',
  'CAZADOR',
  'PICARO',
  'MONJE',
  'DRUIDA',
];

// ────────────────────────────────────────────────────────────────────────
// Node card — shared visual for every tier.
// ────────────────────────────────────────────────────────────────────────
const ClassNode = ({
  node,
  onSelect,
}: {
  node: NodeData;
  onSelect?: (node: NodeData) => void;
}): React.JSX.Element => {
  const interactive = node.status !== 'future';
  const Tag = interactive ? 'button' : 'div';

  return (
    <Tag
      type={interactive ? 'button' : undefined}
      onClick={interactive && onSelect ? () => onSelect(node) : undefined}
      title={node.frase}
      className={`relative flex w-full flex-col items-center gap-1 border-2 px-2 py-2 text-center transition-all ${STATUS_STYLE[node.status]} ${interactive ? 'hover:scale-[1.03] hover:border-green-400 cursor-pointer' : 'cursor-not-allowed'}`}
    >
      <span className="font-pixel text-[10px] leading-none">
        {STATUS_GLYPH[node.status]}
      </span>
      <span className="font-pixel text-[9px] leading-tight tracking-widest uppercase break-words">
        {/* Future nodes hide their name — silhouette only. Mystery is the
            point: at tier 0 the user shouldn't already know "Druida →
            Chamán" exists, just that something does. */}
        {node.status === 'future' ? '???' : node.name}
      </span>
    </Tag>
  );
};

// ────────────────────────────────────────────────────────────────────────
// Detail panel — fixed bottom strip, shows the selected node.
// ────────────────────────────────────────────────────────────────────────
const DetailPanel = ({
  node,
}: {
  node: NodeData | null;
}): React.JSX.Element => {
  if (!node) {
    return (
      <div className="border-2 border-dashed border-border bg-card p-4 text-center">
        <p className="font-pixel-mono text-base text-ink-faint">
          Selecciona una clase para ver su descripción.
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
        T{node.tier} · {STATUS_GLYPH[node.status]}{' '}
        {node.status === 'current'
          ? 'TU CLASE ACTUAL'
          : node.status === 'owned'
            ? 'YA RECORRIDO'
            : node.status === 'alternate'
              ? 'CAMINO ALTERNATIVO'
              : 'BLOQUEADO'}
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
// Tree builder — turns the flat catalog + the user's character state into
// the nested NodeData arrays the layout consumes. Centralizes status
// detection so the rendering JSX stays declarative.
// ────────────────────────────────────────────────────────────────────────
interface OwnedIds {
  noviceId: string;
  vocationId: string | null;
  specializationId: string | null;
  legendaryId: string | null;
  isMaestroSupremo: boolean;
}

const noviceStatus = (owned: OwnedIds): NodeStatus =>
  owned.vocationId ? 'owned' : 'current';

const vocationStatus = (
  vocation: VocationClass,
  owned: OwnedIds
): NodeStatus => {
  if (owned.vocationId === null) return 'alternate'; // user hasn't picked yet
  if (owned.vocationId === vocation.id) {
    return owned.specializationId ? 'owned' : 'current';
  }
  return 'alternate';
};

const specializationStatus = (
  spec: SpecializationClass,
  owned: OwnedIds
): NodeStatus => {
  // Hidden until the user has at least chosen their vocation.
  if (owned.vocationId === null) return 'future';
  // Specs from a different lineage are forever alternates.
  if (spec.lineage !== owned.vocationId) return 'alternate';
  // Same lineage but not chosen yet → user can pick → alternate.
  if (owned.specializationId === null) return 'alternate';
  // Same lineage, already chosen.
  if (owned.specializationId === spec.id) {
    return owned.legendaryId ? 'owned' : 'current';
  }
  return 'alternate';
};

const legendaryStatus = (leg: LegendaryClass, owned: OwnedIds): NodeStatus => {
  if (owned.specializationId === null) return 'future';
  if (owned.legendaryId === null) return 'alternate';
  if (owned.legendaryId === leg.id) {
    return owned.isMaestroSupremo ? 'owned' : 'current';
  }
  return 'alternate';
};

const buildOwned = (
  state: ReturnType<typeof useCharacterState>['state']
): OwnedIds => ({
  noviceId: 'ESCUDERO',
  vocationId: state?.vocation?.id ?? null,
  specializationId: state?.specialization?.id ?? null,
  legendaryId: state?.legendary?.id ?? null,
  isMaestroSupremo: state?.isMaestroSupremo ?? false,
});

const toNode = (
  raw: NoviceClass | VocationClass | SpecializationClass | LegendaryClass,
  status: NodeStatus
): NodeData => ({
  id: raw.id,
  tier: raw.tier,
  name: raw.name,
  frase: raw.frase,
  status,
});

// ────────────────────────────────────────────────────────────────────────
// Main view.
// ────────────────────────────────────────────────────────────────────────
export const ClassTreeView = (): React.JSX.Element => {
  const { catalog, loading, error } = useClassCatalog();
  const { state } = useCharacterState();
  const [selected, setSelected] = useState<NodeData | null>(null);

  // Recompute the tree only when catalog or character state changes —
  // the layout is otherwise pure data → JSX.
  const tree = useMemo(() => {
    if (!catalog) return null;
    const owned = buildOwned(state);

    const novice = toNode(catalog.novice, noviceStatus(owned));

    const vocationsByLineage = LINEAGE_ORDER.map((lineageId) => {
      const vocation = catalog.vocations.find((v) => v.id === lineageId);
      return vocation
        ? toNode(vocation, vocationStatus(vocation, owned))
        : null;
    });

    const specializationsByLineage = LINEAGE_ORDER.map((lineageId) =>
      catalog.specializations
        .filter((s) => s.lineage === lineageId)
        .map((s) => toNode(s, specializationStatus(s, owned)))
    );

    const legendaries = catalog.legendaries.map((l) =>
      toNode(l, legendaryStatus(l, owned))
    );

    return {
      novice,
      vocationsByLineage,
      specializationsByLineage,
      legendaries,
    };
  }, [catalog, state]);

  return (
    <AsyncState
      loading={loading}
      error={error}
      data={tree}
      loadingLabel="CARGANDO CAMINO"
    >
      {(t) => (
        <div className="mx-auto max-w-7xl">
          <header className="mb-6">
            <p className="font-pixel text-[9px] tracking-widest text-green-500">
              ◆ DESTINO
            </p>
            <h1 className="mt-2 font-pixel text-base sm:text-lg tracking-widest text-green-400 [text-shadow:0_0_16px_rgba(34,197,94,0.55)]">
              EL CAMINO
            </h1>
            <p className="mt-3 font-pixel-mono text-xl leading-snug text-ink-muted">
              Las 38 clases del sistema. Tu camino actual brilla; las
              alternativas que no elegiste se mantienen visibles; lo que aún no
              has alcanzado se oculta como silueta.
            </p>
          </header>

          {/* T0 — Iniciado, centered above the lineage columns. */}
          <section className="mb-8 flex flex-col items-center gap-3">
            <p className="font-pixel text-[8px] tracking-widest text-ink-faint">
              T0 · INICIADO
            </p>
            <div className="w-40">
              <ClassNode node={t.novice} onSelect={setSelected} />
            </div>
            <span className="font-pixel text-base text-green-500/60">↓</span>
          </section>

          {/* T1 + T2 grid — 6 lineage columns, each holding a vocation on top
              and 3 specializations stacked below. The user reads down: the
              column that lights up is theirs. */}
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {LINEAGE_ORDER.map((lineageId, i) => {
              const vocation = t.vocationsByLineage[i];
              const specs = t.specializationsByLineage[i];
              return (
                <div key={lineageId} className="flex flex-col gap-2">
                  <p className="text-center font-pixel text-[8px] tracking-widest text-ink-faint">
                    T1 · {lineageId}
                  </p>
                  {vocation && (
                    <ClassNode node={vocation} onSelect={setSelected} />
                  )}
                  <div className="my-1 h-px bg-border" />
                  <p className="text-center font-pixel text-[8px] tracking-widest text-ink-faint">
                    T2
                  </p>
                  {specs.map((spec) => (
                    <ClassNode
                      key={spec.id}
                      node={spec}
                      onSelect={setSelected}
                    />
                  ))}
                </div>
              );
            })}
          </section>

          {/* T3 — Legendaries form a row (or wrap on narrow). They're
              cross-lineage: a legendary can be reached from specializations
              in different vocations, so they don't belong in any single
              column. */}
          <section className="mt-8">
            <p className="mb-3 font-pixel text-[10px] tracking-widest text-green-500">
              ⚔ T3 · LEGENDARIOS
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {t.legendaries.map((leg) => (
                <ClassNode key={leg.id} node={leg} onSelect={setSelected} />
              ))}
            </div>
          </section>

          {/* T4–T6 — fixed tail. Don't appear in the catalog (T4 is a
              transcendent stage upgrade of T3, T5/T6 are server-side
              singletons), so they're rendered as static placeholders that
              communicate "the path continues". */}
          <section className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {[
              { tier: 4, label: 'TRASCENDENTE', hint: 'Tu T3 evoluciona.' },
              {
                tier: 5,
                label: 'MAESTRO SUPREMO',
                hint: 'Todas las stats al 99.',
              },
              { tier: 6, label: 'LEYENDA', hint: 'El título final.' },
            ].map((tail) => (
              <div
                key={tail.tier}
                className="border-2 border-dashed border-border-muted bg-card p-4 text-center"
              >
                <p className="font-pixel text-[8px] tracking-widest text-ink-faint">
                  T{tail.tier}
                </p>
                <p className="mt-2 font-pixel text-[10px] tracking-widest text-ink-muted">
                  {tail.label}
                </p>
                <p className="mt-2 font-pixel-mono text-base leading-tight text-ink-faint">
                  {tail.hint}
                </p>
              </div>
            ))}
          </section>

          <section className="mt-8">
            <DetailPanel node={selected} />
          </section>
        </div>
      )}
    </AsyncState>
  );
};
