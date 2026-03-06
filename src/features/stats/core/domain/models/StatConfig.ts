export const STAT_CONFIG: Record<
  string,
  { name: string; icon: string; colorVar: string }
> = {
  fuerza: {
    name: 'Fuerza',
    icon: '💪',
    colorVar: '--stat-fuerza',
  },
  resistencia: {
    name: 'Resistencia',
    icon: '🛡️',
    colorVar: '--stat-resistencia',
  },
  estamina: {
    name: 'Estamina',
    icon: '⚡',
    colorVar: '--stat-estamina',
  },
  agilidad: {
    name: 'Agilidad',
    icon: '🏃',
    colorVar: '--stat-agilidad',
  },
  tenacidad: {
    name: 'Tenacidad',
    icon: '🔥',
    colorVar: '--stat-tenacidad',
  },
  vigor: {
    name: 'Vigor',
    icon: '🍎',
    colorVar: '--stat-vigor',
  },
};

// Orden en el que se muestran las barras en el panel
export const STAT_ORDER = [
  'fuerza',
  'resistencia',
  'estamina',
  'agilidad',
  'tenacidad',
  'vigor',
] as const;
