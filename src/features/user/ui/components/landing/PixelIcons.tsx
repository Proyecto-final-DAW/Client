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

export const SwordIcon = (props: PixelIconProps): React.JSX.Element =>
  renderGrid(SWORD, props.color, props.accent ?? '#8b5a2b', props);

export const ShieldIcon = (props: PixelIconProps): React.JSX.Element =>
  renderGrid(SHIELD, props.color, props.accent, props);

export const PixelHeartIcon = (props: PixelIconProps): React.JSX.Element =>
  renderGrid(HEART, props.color, props.accent ?? '#ffffff', props);

export const PixelBoltIcon = (props: PixelIconProps): React.JSX.Element =>
  renderGrid(BOLT, props.color, undefined, props);

export const PixelFlameIcon = (props: PixelIconProps): React.JSX.Element =>
  renderGrid(FLAME, props.color, props.accent ?? '#fde68a', props);

export const PixelStarIcon = (props: PixelIconProps): React.JSX.Element =>
  renderGrid(STAR, props.color, undefined, props);

export const ScrollIcon = (props: PixelIconProps): React.JSX.Element =>
  renderGrid(SCROLL, props.color, props.accent, props);

export const ChartUpIcon = (props: PixelIconProps): React.JSX.Element =>
  renderGrid(CHART_UP, props.color, undefined, props);

export const TimerIcon = (props: PixelIconProps): React.JSX.Element =>
  renderGrid(TIMER, props.color, props.accent, props);

export const AppleIcon = (props: PixelIconProps): React.JSX.Element =>
  renderGrid(APPLE, props.color, props.accent, props);

export const GemIcon = (props: PixelIconProps): React.JSX.Element =>
  renderGrid(GEM, props.color, props.accent, props);

export const BookIcon = (props: PixelIconProps): React.JSX.Element =>
  renderGrid(BOOK, props.color, props.accent, props);

export const UserPlusIcon = (props: PixelIconProps): React.JSX.Element =>
  renderGrid(USER_PLUS, props.color, props.accent ?? props.color, props);

export const PlayIcon = (props: PixelIconProps): React.JSX.Element =>
  renderGrid(PLAY, props.color, undefined, props);

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

export const MapIcon = (props: PixelIconProps): React.JSX.Element =>
  renderGrid(MAP, props.color, props.accent ?? '#7c2d12', props);

export const HourglassIcon = (props: PixelIconProps): React.JSX.Element =>
  renderGrid(HOURGLASS, props.color, props.accent, props);

export const TrophyIcon = (props: PixelIconProps): React.JSX.Element =>
  renderGrid(TROPHY, props.color, props.accent, props);

export const PotionIcon = (props: PixelIconProps): React.JSX.Element =>
  renderGrid(POTION, props.color, props.accent ?? '#ef4444', props);

export const ChestIcon = (props: PixelIconProps): React.JSX.Element =>
  renderGrid(CHEST, props.color, props.accent ?? '#fde68a', props);

export const HelmetIcon = (props: PixelIconProps): React.JSX.Element =>
  renderGrid(HELMET, props.color, props.accent, props);
