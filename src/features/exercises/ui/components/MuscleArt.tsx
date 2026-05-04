import type { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement> & {
  target: string;
};

// Iconic shapes per muscle group used as a deterministic fallback when the
// upstream gif fails. Designed to read clearly at ~48px — single-glyph,
// thick strokes, no anatomical detail. Prefer "obvious symbol" over
// "anatomically correct" because at thumbnail size the latter looks like
// noise.

const ChestArt = (props: SVGProps<SVGSVGElement>) => (
  // Two filled circles = pectorals viewed front-on.
  <svg viewBox="0 0 64 64" fill="currentColor" {...props}>
    <circle cx="20" cy="32" r="14" />
    <circle cx="44" cy="32" r="14" />
  </svg>
);

const BackArt = (props: SVGProps<SVGSVGElement>) => (
  // V-taper of a developed back (lats spread).
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" {...props}>
    <path
      d="M16 8 L32 56 L48 8"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M24 8 L32 32 L40 8"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.5"
    />
  </svg>
);

const ArmArt = (props: SVGProps<SVGSVGElement>) => (
  // Flexed bicep — bent arm with a clear bicep bulge.
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" {...props}>
    <path
      d="M10 50 L24 50 Q24 30 32 24 Q40 18 44 12"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="28" cy="32" r="8" fill="currentColor" stroke="none" />
  </svg>
);

const ShoulderArt = (props: SVGProps<SVGSVGElement>) => (
  // Three-circle delt cap.
  <svg viewBox="0 0 64 64" fill="currentColor" {...props}>
    <circle cx="14" cy="36" r="8" />
    <circle cx="32" cy="22" r="10" />
    <circle cx="50" cy="36" r="8" />
    <rect x="8" y="42" width="48" height="4" rx="2" />
  </svg>
);

const LegArt = (props: SVGProps<SVGSVGElement>) => (
  // Two thigh shapes tapering to calves.
  <svg viewBox="0 0 64 64" fill="currentColor" {...props}>
    <path d="M18 6 L28 6 L26 32 L24 56 L18 56 Z" />
    <path d="M36 6 L46 6 L46 56 L40 56 L38 32 Z" />
  </svg>
);

const CoreArt = (props: SVGProps<SVGSVGElement>) => (
  // Six-pack grid.
  <svg viewBox="0 0 64 64" fill="currentColor" {...props}>
    <rect x="14" y="10" width="16" height="12" rx="2" />
    <rect x="34" y="10" width="16" height="12" rx="2" />
    <rect x="14" y="26" width="16" height="12" rx="2" />
    <rect x="34" y="26" width="16" height="12" rx="2" />
    <rect x="14" y="42" width="16" height="12" rx="2" />
    <rect x="34" y="42" width="16" height="12" rx="2" />
  </svg>
);

const CardioArt = (props: SVGProps<SVGSVGElement>) => (
  // Heart with a horizontal ECG line crossing it.
  <svg viewBox="0 0 64 64" fill="currentColor" {...props}>
    <path d="M32 54 C 8 38, 8 14, 22 14 C 28 14, 32 18, 32 22 C 32 18, 36 14, 42 14 C 56 14, 56 38, 32 54 Z" />
    <path
      d="M4 32 L18 32 L22 24 L28 40 L34 28 L40 32 L60 32"
      stroke="#0a0a0f"
      strokeWidth="3"
      fill="none"
    />
  </svg>
);

const DefaultArt = (props: SVGProps<SVGSVGElement>) => (
  // Generic dumbbell.
  <svg viewBox="0 0 64 64" fill="currentColor" {...props}>
    <rect x="6" y="22" width="8" height="20" rx="1" />
    <rect x="14" y="28" width="6" height="8" />
    <rect x="20" y="30" width="24" height="4" />
    <rect x="44" y="28" width="6" height="8" />
    <rect x="50" y="22" width="8" height="20" rx="1" />
  </svg>
);

const TARGET_TO_ART: Record<string, React.FC<SVGProps<SVGSVGElement>>> = {
  pectorals: ChestArt,
  chest: ChestArt,
  serratus_anterior: ChestArt,
  lats: BackArt,
  back: BackArt,
  upper_back: BackArt,
  middle_back: BackArt,
  lower_back: BackArt,
  spine: BackArt,
  traps: BackArt,
  neck: BackArt,
  levator_scapulae: BackArt,
  biceps: ArmArt,
  triceps: ArmArt,
  forearms: ArmArt,
  delts: ShoulderArt,
  shoulders: ShoulderArt,
  quads: LegArt,
  quadriceps: LegArt,
  hamstrings: LegArt,
  glutes: LegArt,
  calves: LegArt,
  abductors: LegArt,
  adductors: LegArt,
  abs: CoreArt,
  abdominals: CoreArt,
  obliques: CoreArt,
  cardiovascular_system: CardioArt,
};

export const MuscleArt = ({ target, ...rest }: Props): React.JSX.Element => {
  const key = target.toLowerCase().replace(/\s+/g, '_');
  const Art = TARGET_TO_ART[key] ?? DefaultArt;
  return <Art {...rest} />;
};
