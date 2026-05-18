import { STAT_CONFIG, STAT_ORDER } from '@features/stats/ui/StatConfig';
import { PixelCorners } from '@shared/components/PixelCorners';
import { PixelSelect } from '@shared/components/PixelSelect';
import { useMemo, useState } from 'react';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';

import type { UserStats } from '../../../stats/core/domain/models/UserStats';
import type { StatsHistoryPoint } from '../hooks/useStatsHistory';

interface Props {
  stats: UserStats;
  history: StatsHistoryPoint[];
  /** Used to filter the time-window selector — only options whose
   *  lookback fits inside the account age are exposed. */
  accountCreatedAt: Date | null;
  /** Card title rendered to the left of the time-window dropdown.
   *  The selector sits next to the title to keep both controls on
   *  the same horizontal line — previously a separate row below the
   *  chart, which the user found visually disconnected. */
  title: string;
}

interface RadarPoint {
  stat: string;
  /** Live level for this stat — always populated, drives the solid
   *  polygon and the level number under each axis label. */
  current: number;
  /** Snapshot level for the active comparison window. Defaults to 0
   *  when window === 'now' (no comparison) so the comparison radar
   *  stays mounted and recharts can animate the grow/shrink between
   *  windows instead of mount/unmounting and snapping. */
  previous: number;
  max: number;
}

type TimeWindow = 'now' | '7d' | '30d' | '3m' | 'start';

interface WindowOption {
  id: TimeWindow;
  label: string;
  /** Days of account age required for this option to be shown. AHORA
   *  and INICIO are always available; the lookback options gate on
   *  the account being old enough that the snapshot would be real
   *  instead of clamping back to day-zero. */
  minAccountDays: number;
}

const WINDOW_OPTIONS: WindowOption[] = [
  { id: 'now', label: 'AHORA', minAccountDays: 0 },
  { id: '7d', label: 'HACE 7D', minAccountDays: 7 },
  { id: '30d', label: 'HACE 30D', minAccountDays: 30 },
  { id: '3m', label: 'HACE 3M', minAccountDays: 90 },
  { id: 'start', label: 'INICIO', minAccountDays: 1 },
];

const daysBetween = (from: Date, to: Date): number => {
  const ms = to.getTime() - from.getTime();
  return Math.floor(ms / 86_400_000);
};

/**
 * Picks the snapshot from `history` that best represents `window`:
 *   - `start`  → first snapshot (or empty defaults if no sessions yet).
 *   - `now`    → null; caller falls back to live stats.
 *   - `7d/30d` → latest snapshot whose date is ≤ N days ago. If the
 *                user has no session that old, fall back to the very
 *                first snapshot (their starting baseline) so the radar
 *                isn't blank.
 */
const LOOKBACK_DAYS: Record<Exclude<TimeWindow, 'now' | 'start'>, number> = {
  '7d': 7,
  '30d': 30,
  '3m': 90,
};

/**
 * Short labels for the radar's axis ticks. All six stats truncated to
 * a uniform 3-letter code so the hexagon reads symmetrically — the
 * earlier mix of FUERZA / RESIST / ESTAM / AGIL / TENAC / VIGOR was
 * legible but visually unbalanced (a 6-char tick next to a 4-char
 * tick across the polygon). Full names still appear in the StatsPanel.
 */
const SHORT_LABELS: Record<string, string> = {
  FUERZA: 'FUE',
  RESISTENCIA: 'RES',
  ESTAMINA: 'EST',
  AGILIDAD: 'AGI',
  TENACIDAD: 'TEN',
  VIGOR: 'VIG',
};

const pickSnapshot = (
  history: StatsHistoryPoint[],
  window: TimeWindow
): StatsHistoryPoint | null => {
  if (window === 'now' || history.length === 0) return null;
  if (window === 'start') return history[0];

  const days = LOOKBACK_DAYS[window];
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = `${cutoff.getFullYear()}-${String(
    cutoff.getMonth() + 1
  ).padStart(2, '0')}-${String(cutoff.getDate()).padStart(2, '0')}`;

  // Latest snapshot dated on/before the cutoff. The list is ASC, so
  // walking from the end and stopping on the first match is fine.
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].date <= cutoffStr) return history[i];
  }
  return history[0];
};

/**
 * Six-stat radar with a time-window selector. The hex stays the
 * headline visual; picking AHORA / HACE 7D / HACE 30D / INICIO swaps
 * the silhouette so the user sees how it grew. Tenacidad and vigor
 * are pulled from the live stats (their server-side rules depend on
 * streak / diet state that can't be replayed faithfully) — they stay
 * constant across windows.
 */
export const StatRadarChart = ({
  stats,
  history,
  accountCreatedAt,
  title,
}: Props): React.JSX.Element => {
  const [window, setWindow] = useState<TimeWindow>('now');
  // Hovered/touched stat — drives the glow on the matching axis label
  // when the user points at a polygon vertex (or vice versa). null
  // when nothing is active.
  const [activeStat, setActiveStat] = useState<string | null>(null);

  const snapshot = pickSnapshot(history, window);

  // Filter out options whose lookback the account isn't old enough to
  // honour. Brand-new account → only AHORA. After a week → AHORA, 7D,
  // INICIO. Etc. Avoids the previous "click HACE 30D and see the same
  // hex as INICIO because there's no snapshot that old".
  const accountDays = accountCreatedAt
    ? daysBetween(accountCreatedAt, new Date())
    : 0;
  const visibleOptions = WINDOW_OPTIONS.filter((option) => {
    if (option.id === 'now') return true;
    if (option.id === 'start') {
      // Available the moment there's any history — the comparison
      // "AHORA vs INICIO" is meaningful even after a single session,
      // because INICIO renders the level-1 baseline. Previously gated
      // on accountDays >= 1 too, which hid the selector entirely on
      // brand-new accounts whose `created_at` lookups were flaky.
      return history.length > 0;
    }
    return accountDays >= option.minAccountDays;
  });

  const data: RadarPoint[] = useMemo(() => {
    // The replay-based snapshot lives on its own scale: it walks the
    // session table from level 1 upwards, so its "today" value reflects
    // what the user *earned* through sessions. The live `stats` row,
    // on the other hand, can also be set by other code paths (e.g. the
    // demo seed for the presentation user). When they diverge, the
    // raw replay snapshot reads as a tiny hex next to a giant live
    // one — "HACE 7D" looks like the user lost 50 levels overnight.
    //
    // Per-stat scaling: each replayed pillar is multiplied by the
    // ratio `live / latestReplay` for that same stat. Ratio is 1 when
    // the replay matches the live level (real user) and >1 when the
    // live value was bumped externally (seeded user) — in that case
    // the historic curve keeps its *shape* but expands to anchor at
    // the live level for the most recent snapshot.
    //
    // Tenacidad / vigor still use the overall scale factor below
    // because we don't replay them at all.
    const latest = history.length > 0 ? history[history.length - 1] : null;

    const liveByKey: Record<
      'strength' | 'resistance' | 'stamina' | 'agility',
      number
    > = {
      strength: 0,
      resistance: 0,
      stamina: 0,
      agility: 0,
    };
    (['strength', 'resistance', 'stamina', 'agility'] as const).forEach((k) => {
      const p = stats.pillar.find((pp) => pp.name === STAT_CONFIG[k].name);
      liveByKey[k] = p?.level ?? 0;
    });

    const replayScale: typeof liveByKey = {
      strength: 1,
      resistance: 1,
      stamina: 1,
      agility: 1,
    };
    if (latest) {
      if (latest.strength_level > 0) {
        replayScale.strength = liveByKey.strength / latest.strength_level;
      }
      if (latest.endurance_level > 0) {
        replayScale.resistance = liveByKey.resistance / latest.endurance_level;
      }
      if (latest.stamina_level > 0) {
        replayScale.stamina = liveByKey.stamina / latest.stamina_level;
      }
      if (latest.agility_level > 0) {
        replayScale.agility = liveByKey.agility / latest.agility_level;
      }
    }

    // Overall "how far along were you" multiplier for the two
    // un-replayed pillars (tenacidad/vigor). Average of the per-stat
    // scaled snapshots over the live levels — keeps the legacy
    // behaviour where INICIO collapses ten/vig to 0 and recent
    // windows hold them near current.
    let snapshotScale = 0;
    if (snapshot) {
      const scaledSnap =
        snapshot.strength_level * replayScale.strength +
        snapshot.endurance_level * replayScale.resistance +
        snapshot.stamina_level * replayScale.stamina +
        snapshot.agility_level * replayScale.agility;
      const liveSum =
        liveByKey.strength +
        liveByKey.resistance +
        liveByKey.stamina +
        liveByKey.agility;
      snapshotScale = liveSum > 0 ? scaledSnap / liveSum : 0;
    }

    return STAT_ORDER.map((key) => {
      const config = STAT_CONFIG[key];
      const livePilar = stats.pillar.find((p) => p.name === config.name);
      const liveLevel = livePilar?.level ?? 0;

      // Default 0 when no snapshot — polygon collapses to a point at
      // center (invisible) and animates open when the user picks a
      // past window. Keeps the comparison radar mounted so recharts
      // can interpolate between values instead of snapping.
      let previous = 0;
      if (snapshot) {
        if (key === 'strength') {
          previous = Math.round(snapshot.strength_level * replayScale.strength);
        } else if (key === 'resistance') {
          previous = Math.round(
            snapshot.endurance_level * replayScale.resistance
          );
        } else if (key === 'stamina') {
          previous = Math.round(snapshot.stamina_level * replayScale.stamina);
        } else if (key === 'agility') {
          previous = Math.round(snapshot.agility_level * replayScale.agility);
        } else {
          previous = Math.round(liveLevel * snapshotScale);
        }
      }

      const fullName = config.name.toUpperCase();
      return {
        stat: SHORT_LABELS[fullName] ?? fullName,
        current: liveLevel,
        previous,
        max: 99,
      };
    });
  }, [stats, snapshot, history]);

  // Per-stat accent color (same palette as the StatBar icons on
  // /inicio) so the radar's labels feel like part of the stat sheet
  // instead of a generic green wash. Recharts only pipes
  // `payload.value` (the stat string) through to the tick renderer,
  // so we key on the abbreviated name we wrote into `data.stat`.
  const colorByStat = useMemo(() => {
    const map = new Map<string, string>();
    for (const key of STAT_ORDER) {
      const config = STAT_CONFIG[key];
      const fullName = config.name.toUpperCase();
      const stat = SHORT_LABELS[fullName] ?? fullName;
      map.set(stat, config.accentColor);
    }
    return map;
  }, []);

  // Single-line tick: just the stat name, sized big enough to read
  // at a glance and tinted with each pillar's accent color. Levels
  // live in the StatsPanel on /perfil and /inicio — the radar's job
  // here is to show silhouette/evolution, not raw numbers. Hovering
  // the label (or its matching polygon vertex) lights it up with a
  // drop-shadow glow in the same accent.
  // Recharts widens `x` and `y` to `string | number` (rare SVG units),
  // but in practice they are always numbers here. The cast at the
  // boundary lets the rest of the function stay strict.
  const renderAngleTick = (tickProps: {
    x?: number | string;
    y?: number | string;
    textAnchor?: string;
    payload?: { value: string };
  }): React.JSX.Element => {
    const {
      x: rawX = 0,
      y: rawY = 0,
      textAnchor = 'middle',
      payload,
    } = tickProps;
    const x = typeof rawX === 'number' ? rawX : Number(rawX);
    const y = typeof rawY === 'number' ? rawY : Number(rawY);
    const label = payload?.value ?? '';
    const color = colorByStat.get(label) ?? '#22c55e';
    const isActive = label === activeStat;
    return (
      <text
        x={x}
        y={y}
        dy="0.35em"
        textAnchor={textAnchor as 'start' | 'middle' | 'end'}
        fill={color}
        fontFamily='"Press Start 2P", monospace'
        fontSize={10}
        style={{
          filter: isActive ? `drop-shadow(0 0 8px ${color})` : undefined,
          cursor: 'pointer',
          transition: 'filter 0.15s ease',
        }}
        onMouseEnter={() => setActiveStat(label)}
        onMouseLeave={() => setActiveStat(null)}
      >
        {label}
      </text>
    );
  };

  // Invisible interactive dot at each polygon vertex. r=12 catches
  // pointer events on/near the tip without painting anything visible
  // — pairs with the label glow above, so hovering either side lights
  // up the same stat.
  const renderInteractiveDot = (dotProps: {
    cx?: number;
    cy?: number;
    payload?: RadarPoint;
  }): React.JSX.Element => {
    const { cx = 0, cy = 0, payload } = dotProps;
    const stat = payload?.stat ?? '';
    return (
      <circle
        cx={cx}
        cy={cy}
        r={12}
        fill="rgba(0,0,0,0.001)"
        pointerEvents="all"
        style={{ cursor: 'pointer' }}
        onMouseEnter={() => setActiveStat(stat)}
        onMouseLeave={() => setActiveStat(null)}
      />
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header row: card title on the left, time-window dropdown on
          the right. Single line keeps the chrome compact and reads as
          one control surface for the chart below. */}
      <div className="flex items-center justify-between gap-3">
        <p className="font-pixel text-[10px] tracking-widest text-green-500">
          {title}
        </p>
        {visibleOptions.length > 1 && (
          <PixelSelect
            value={window}
            options={visibleOptions.map((o) => ({
              value: o.id,
              label: o.label,
            }))}
            placeholder="AHORA"
            onChange={(value) => setWindow(value as TimeWindow)}
            ariaLabel="Ventana de tiempo"
            className="w-32"
          />
        )}
      </div>

      <div className="relative border-2 border-green-500/40 bg-page p-2">
        <PixelCorners size="sm" className="border-green-500/40" />
        <ResponsiveContainer width="100%" height={420}>
          {/* outerRadius 72% — bumped from 68% to give the hex more
              visual weight. The radar section's parent padding was
              also tightened (p-5 → p-3 in ProgressView) so the SVG
              has the extra horizontal room for "RESIST" at 10px to
              still fit at this larger radius. */}
          <RadarChart data={data} outerRadius="72%">
            <PolarGrid stroke="rgba(34,197,94,0.18)" strokeDasharray="2 4" />
            <PolarAngleAxis dataKey="stat" tick={renderAngleTick} />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 99]}
              tick={false}
              axisLine={false}
              stroke="transparent"
            />
            {/* Faint white-tinted fill across the full hex — gives
                the interior a subtle bluish-gray cast against the
                dark page background. Without it the empty hex reads
                as flat black, which felt visually cold. */}
            <Radar
              name="Cap"
              dataKey="max"
              stroke="rgba(255,255,255,0.06)"
              fill="rgba(255,255,255,0.04)"
              fillOpacity={1}
              isAnimationActive={false}
              dot={false}
              activeDot={false}
            />
            <Radar
              name="Actual"
              dataKey="current"
              stroke="#22c55e"
              strokeWidth={2.5}
              fill="rgba(34,197,94,0.32)"
              fillOpacity={1}
              isAnimationActive
              dot={renderInteractiveDot}
              activeDot={false}
            />
            {/* Comparison polygon — solid blue hex painted ON TOP of
                the current green one so when the snapshot is smaller
                (typical: AHORA vs INICIO) the blue fill is visible
                inside the green outline, telling the "you grew from
                blue to green" story at a glance. Translucent enough
                that overlapping regions still show the green underneath.
                Always mounted (with previous=0 at AHORA) so recharts
                can animate the polygon morphing between time windows
                instead of snapping on mount/unmount. */}
            <Radar
              name="Anterior"
              dataKey="previous"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="rgba(59,130,246,0.4)"
              fillOpacity={1}
              isAnimationActive
              animationDuration={650}
              animationEasing="ease-out"
              dot={false}
              activeDot={false}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
