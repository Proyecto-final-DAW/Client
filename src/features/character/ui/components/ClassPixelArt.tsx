/**
 * Pixel-art icons for the two pillar-agnostic apex classes (MAESTRO_SUPREMO
 * and LEYENDA). The rest of the catalog reuses the stat icons (sword,
 * shield, etc.) coloured by the class's dominant/secondary pillar, but
 * these two don't fit that model — they sit above the stat ladder, so
 * they get bespoke artwork instead of the placeholder "◆" the rest of
 * the panteon used to render for them.
 *
 * 16×16 viewBox so each rect is a perfectly aligned "pixel" at any
 * display size. Single-colour fills keep the art crisp and let the
 * caller tint via CSS `color: <accent>` without per-cell overrides.
 */

import type { CSSProperties } from 'react';

type Props = {
  classId: 'MAESTRO_SUPREMO' | 'LEYENDA';
  /** Hex / colour token used to fill the pixels. */
  color: string;
  /** Optional className passthrough so callers can size the SVG. */
  className?: string;
  style?: CSSProperties;
};

// Grid cells written as flat coordinate strings for readability. Each
// pair (x, y) lights up one 1×1 pixel on the 16×16 viewBox. The art is
// hand-tuned to read clearly at 40px (the smallest size in the
// panteon card on mobile).

// MAESTRO_SUPREMO — meditating figure inside a halo / aureole. The
// shape evokes the lore line ("Trascendiste el cuerpo. Trascendiste
// el alma. Ahora ERES."): a body that exists *with* the aura, rather
// than wearing armour or wielding a weapon.
const MAESTRO_PIXELS: ReadonlyArray<readonly [number, number]> = [
  // Outer aureole — diamond rim around the figure
  [7, 1],
  [8, 1],
  [5, 2],
  [6, 2],
  [9, 2],
  [10, 2],
  [4, 3],
  [11, 3],
  [3, 4],
  [12, 4],
  [2, 5],
  [13, 5],
  [2, 6],
  [13, 6],
  [2, 7],
  [13, 7],
  [2, 8],
  [13, 8],
  [3, 9],
  [12, 9],
  [4, 10],
  [11, 10],
  [5, 11],
  [10, 11],
  [6, 12],
  [9, 12],
  [7, 13],
  [8, 13],
  // Inner figure — head + crossed arms + base (meditation pose)
  [7, 5],
  [8, 5],
  [7, 6],
  [8, 6],
  [5, 8],
  [6, 8],
  [7, 8],
  [8, 8],
  [9, 8],
  [10, 8], // shoulder line / arms
  [6, 9],
  [7, 9],
  [8, 9],
  [9, 9],
  [6, 10],
  [7, 10],
  [8, 10],
  [9, 10],
  [5, 11],
  [6, 11],
  [7, 11],
  [8, 11],
  [9, 11],
  [10, 11], // base / lotus seat
];

// LEYENDA — pixel crown topped by an apex star. Lore: "Cantaran tu
// nombre cuando ya no quede nadie para escucharlo." The crown is the
// trophy; the star marks the rank as above the laddered metals.
const LEYENDA_PIXELS: ReadonlyArray<readonly [number, number]> = [
  // Apex star — 5 pixel diamond floating above the crown
  [7, 0],
  [8, 0],
  [6, 1],
  [7, 1],
  [8, 1],
  [9, 1],
  [7, 2],
  [8, 2],
  // Crown peaks — three points (left, centre, right)
  [3, 4],
  [4, 4],
  [11, 4],
  [12, 4],
  [3, 5],
  [4, 5],
  [7, 5],
  [8, 5],
  [11, 5],
  [12, 5],
  [3, 6],
  [4, 6],
  [7, 6],
  [8, 6],
  [11, 6],
  [12, 6],
  // Crown band — solid horizontal strip
  [3, 7],
  [4, 7],
  [5, 7],
  [6, 7],
  [7, 7],
  [8, 7],
  [9, 7],
  [10, 7],
  [11, 7],
  [12, 7],
  [3, 8],
  [4, 8],
  [5, 8],
  [6, 8],
  [7, 8],
  [8, 8],
  [9, 8],
  [10, 8],
  [11, 8],
  [12, 8],
  // Jewel insets along the band — every-other-pixel dimples
  [5, 9],
  [7, 9],
  [8, 9],
  [10, 9],
  // Crown base — slimmer bottom strip
  [4, 10],
  [5, 10],
  [6, 10],
  [7, 10],
  [8, 10],
  [9, 10],
  [10, 10],
  [11, 10],
];

const PIXEL_MAP: Record<
  Props['classId'],
  ReadonlyArray<readonly [number, number]>
> = {
  MAESTRO_SUPREMO: MAESTRO_PIXELS,
  LEYENDA: LEYENDA_PIXELS,
};

export const ClassPixelArt = ({
  classId,
  color,
  className,
  style,
}: Props): React.JSX.Element => {
  const pixels = PIXEL_MAP[classId];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={className}
      style={style}
    >
      {pixels.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={color} />
      ))}
    </svg>
  );
};

export const hasPixelArt = (id: string): id is Props['classId'] =>
  id === 'MAESTRO_SUPREMO' || id === 'LEYENDA';
