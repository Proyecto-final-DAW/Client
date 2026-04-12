import type { SVGProps } from 'react';

type PixelIconProps = SVGProps<SVGSVGElement> & {
  color: string;
  accent?: string;
};

const renderGrid = (
  grid: string[],
  color: string,
  accent: string | undefined,
  svgProps: SVGProps<SVGSVGElement>
) => {
  const h = grid.length;
  const w = grid[0].length;
  const rects: React.ReactNode[] = [];
  for (let y = 0; y < h; y++) {
    const row = grid[y];
    for (let x = 0; x < w; x++) {
      const c = row[x];
      if (c === '#') {
        rects.push(
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width={1}
            height={1}
            fill={color}
          />
        );
      } else if (c === 'o') {
        rects.push(
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width={1}
            height={1}
            fill={color}
            fillOpacity={0.45}
          />
        );
      } else if (c === '*' && accent) {
        rects.push(
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width={1}
            height={1}
            fill={accent}
          />
        );
      } else if (c === '+' && accent) {
        rects.push(
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width={1}
            height={1}
            fill={accent}
            fillOpacity={0.55}
          />
        );
      }
    }
  }
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      style={{ imageRendering: 'pixelated' }}
      {...svgProps}
    >
      {rects}
    </svg>
  );
};

const SWORD = [
  '................',
  '................',
  '.......##.......',
  '.......##.......',
  '......####......',
  '......####......',
  '......####......',
  '......####......',
  '......####......',
  '....########....',
  '.......##.......',
  '......####......',
  '......++++......',
  '.......++.......',
  '................',
  '................',
];

const SHIELD = [
  '................',
  '..############..',
  '.##############.',
  '.##++++++++++##.',
  '.##++++++++++##.',
  '.##++++##++++##.',
  '.##++++##++++##.',
  '.##++++##++++##.',
  '..############..',
  '..############..',
  '...##########...',
  '....########....',
  '.....######.....',
  '......####......',
  '.......##.......',
  '................',
];

const HEART = [
  '................',
  '................',
  '..###......###..',
  '.#####....#####.',
  '################',
  '################',
  '##++############',
  '.##############.',
  '.##############.',
  '..############..',
  '...##########...',
  '....########....',
  '.....######.....',
  '......####......',
  '.......##.......',
  '................',
];

const BOLT = [
  '................',
  '...........###..',
  '..........###...',
  '.........####...',
  '........####....',
  '.......####.....',
  '......####......',
  '.....#######....',
  '....#######.....',
  '......####......',
  '.....####.......',
  '....####........',
  '...####.........',
  '..####..........',
  '.###............',
  '................',
];

const FLAME = [
  '................',
  '........#.......',
  '........##......',
  '.......###......',
  '......#####.....',
  '.....#######....',
  '....#########...',
  '....#########...',
  '...####ooo####..',
  '...###oooo####..',
  '..###ooooo####..',
  '..###ooooo####..',
  '...####ooo###...',
  '....########....',
  '.....######.....',
  '................',
];

const SCROLL = [
  '................',
  '................',
  '...##########...',
  '..############..',
  '..##oooooooo##..',
  '..##oo####oo##..',
  '..##oooooooo##..',
  '..##oo####oo##..',
  '..##oooooooo##..',
  '..##oo####oo##..',
  '..##oooooooo##..',
  '..##oo##oooo##..',
  '..##oooooooo##..',
  '..############..',
  '...##########...',
  '................',
];

const CHART_UP = [
  '................',
  '..............##',
  '.............###',
  '............###.',
  '...........###..',
  '..........###...',
  '.........###....',
  '........###.....',
  '.......###..##..',
  '......###...##..',
  '##...###....##..',
  '##...###....##..',
  '##...###....##..',
  '##...###....##..',
  '################',
  '################',
];

const TIMER = [
  '................',
  '.....######.....',
  '.....######.....',
  '....########....',
  '...##########...',
  '..####ooo#####..',
  '..###ooo######..',
  '..###oo#######..',
  '..###o########..',
  '..############..',
  '..############..',
  '...##########...',
  '....########....',
  '.....######.....',
  '.....######.....',
  '................',
];

const APPLE = [
  '................',
  '........##......',
  '.......##.......',
  '......##........',
  '....######......',
  '...########.....',
  '..##########....',
  '..############..',
  '..############..',
  '..############..',
  '..##oo######o##.',
  '..#ooo######oo#.',
  '..##o########o..',
  '...##########...',
  '....########....',
  '................',
];

const GEM = [
  '................',
  '................',
  '....########....',
  '...##oooooo##...',
  '..##oooooooo##..',
  '.##oo######oo##.',
  '.##oo######oo##.',
  '##############..',
  '.##ooooooooo##..',
  '..##ooooooo##...',
  '...##ooooo##....',
  '....##ooo##.....',
  '.....##o##......',
  '......###.......',
  '.......#........',
  '................',
];

const BOOK = [
  '................',
  '................',
  '..############..',
  '.##############.',
  '.##oooo##oooo##.',
  '.##oooo##oooo##.',
  '.##oooo##oooo##.',
  '.##oooo##oooo##.',
  '.##oooo##oooo##.',
  '.##oooo##oooo##.',
  '.##oooo##oooo##.',
  '.##oooo##oooo##.',
  '.##oooo##oooo##.',
  '.##############.',
  '..############..',
  '................',
];

const USER_PLUS = [
  '................',
  '......####......',
  '.....######.....',
  '.....######.....',
  '.....######.....',
  '......####......',
  '................',
  '..##########..**',
  '.############.**',
  '############..**',
  '..##########..**',
  '..............**',
  '...........*****',
  '..............**',
  '..............**',
  '................',
];

const PLAY = [
  '................',
  '................',
  '..##............',
  '..####..........',
  '..######........',
  '..########......',
  '..##########....',
  '..############..',
  '..############..',
  '..##########....',
  '..########......',
  '..######........',
  '..####..........',
  '..##............',
  '................',
  '................',
];

const STAR = [
  '................',
  '.......##.......',
  '.......##.......',
  '......####......',
  '......####......',
  '..############..',
  '.##############.',
  '..############..',
  '...##########...',
  '....########....',
  '...####..####...',
  '...###....###...',
  '..##........##..',
  '.##..........##.',
  '................',
  '................',
];

export const SwordIcon = ({ color, accent, ...p }: PixelIconProps) =>
  renderGrid(SWORD, color, accent ?? '#8b5a2b', p);

export const ShieldIcon = ({ color, accent, ...p }: PixelIconProps) =>
  renderGrid(SHIELD, color, accent, p);

export const PixelHeartIcon = ({ color, accent, ...p }: PixelIconProps) =>
  renderGrid(HEART, color, accent ?? '#ffffff', p);

export const PixelBoltIcon = ({ color, ...p }: PixelIconProps) =>
  renderGrid(BOLT, color, undefined, p);

export const PixelFlameIcon = ({ color, accent, ...p }: PixelIconProps) =>
  renderGrid(FLAME, color, accent ?? '#fde68a', p);

export const PixelStarIcon = ({ color, ...p }: PixelIconProps) =>
  renderGrid(STAR, color, undefined, p);

export const ScrollIcon = ({ color, accent, ...p }: PixelIconProps) =>
  renderGrid(SCROLL, color, accent, p);

export const ChartUpIcon = ({ color, ...p }: PixelIconProps) =>
  renderGrid(CHART_UP, color, undefined, p);

export const TimerIcon = ({ color, accent, ...p }: PixelIconProps) =>
  renderGrid(TIMER, color, accent, p);

export const AppleIcon = ({ color, accent, ...p }: PixelIconProps) =>
  renderGrid(APPLE, color, accent, p);

export const GemIcon = ({ color, accent, ...p }: PixelIconProps) =>
  renderGrid(GEM, color, accent, p);

export const BookIcon = ({ color, accent, ...p }: PixelIconProps) =>
  renderGrid(BOOK, color, accent, p);

export const UserPlusIcon = ({ color, accent, ...p }: PixelIconProps) =>
  renderGrid(USER_PLUS, color, accent ?? color, p);

export const PlayIcon = ({ color, ...p }: PixelIconProps) =>
  renderGrid(PLAY, color, undefined, p);

const MAP = [
  '................',
  '................',
  '................',
  '.##############.',
  '##oooooooooooo##',
  '##oo########oo##',
  '##o*oooooooo*o##',
  '##o*oo*##*oo*o##',
  '##o*o*####*o*o##',
  '##o*oo*##*oo*o##',
  '##o*oooooooo*o##',
  '##oo########oo##',
  '##oooooooooooo##',
  '.##############.',
  '................',
  '................',
];

const HOURGLASS = [
  '................',
  '.##############.',
  '.#oooooooooooo#.',
  '..############..',
  '..##oooooooo##..',
  '...##oooooo##...',
  '....##oooo##....',
  '.....##oo##.....',
  '.....##oo##.....',
  '....##oooo##....',
  '...##oooooo##...',
  '..##oooooooo##..',
  '..############..',
  '.#oooooooooooo#.',
  '.##############.',
  '................',
];

const TROPHY = [
  '................',
  '...##########...',
  '.##############.',
  '##oo########oo##',
  '##oo########oo##',
  '##oooooooooooo##',
  '##oooooooooooo##',
  '.##oooooooooo##.',
  '..############..',
  '....########....',
  '......####......',
  '......####......',
  '....########....',
  '...##########...',
  '################',
  '################',
];

const POTION = [
  '................',
  '......####......',
  '......#oo#......',
  '......#oo#......',
  '.....######.....',
  '.....######.....',
  '....########....',
  '...##oooooo##...',
  '..##oo****oo##..',
  '..##o******o##..',
  '..##oo****oo##..',
  '..##o******o##..',
  '..##oo****oo##..',
  '...##oooooo##...',
  '....########....',
  '................',
];

const CHEST = [
  '................',
  '................',
  '..############..',
  '.##############.',
  '.##oo######oo##.',
  '.##oooooooooo##.',
  '.##oo##**##oo##.',
  '.##oo##**##oo##.',
  '################',
  '.##oooooooooo##.',
  '.##oo######oo##.',
  '.##oooo##oooo##.',
  '.##oo######oo##.',
  '.##oooooooooo##.',
  '.##############.',
  '................',
];

const HELMET = [
  '................',
  '....########....',
  '...##oooooo##...',
  '..##oooooooo##..',
  '.##oo######oo##.',
  '.##oo######oo##.',
  '.##oo######oo##.',
  '.##oooooooooo##.',
  '.##oooooooooo##.',
  '.##oo##oo##oo##.',
  '.##oo##oo##oo##.',
  '.##oooooooooo##.',
  '.##oo######oo##.',
  '.##############.',
  '..############..',
  '................',
];

export const MapIcon = ({ color, accent, ...p }: PixelIconProps) =>
  renderGrid(MAP, color, accent ?? '#7c2d12', p);

export const HourglassIcon = ({ color, accent, ...p }: PixelIconProps) =>
  renderGrid(HOURGLASS, color, accent, p);

export const TrophyIcon = ({ color, accent, ...p }: PixelIconProps) =>
  renderGrid(TROPHY, color, accent, p);

export const PotionIcon = ({ color, accent, ...p }: PixelIconProps) =>
  renderGrid(POTION, color, accent ?? '#ef4444', p);

export const ChestIcon = ({ color, accent, ...p }: PixelIconProps) =>
  renderGrid(CHEST, color, accent ?? '#fde68a', p);

export const HelmetIcon = ({ color, accent, ...p }: PixelIconProps) =>
  renderGrid(HELMET, color, accent, p);
