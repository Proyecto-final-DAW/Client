# GymQuest — Sistema de Diseño

Documento de referencia para la memoria del TFG. Recoge las decisiones
visuales del cliente (paleta, tipografías, primitivas de layout, iconografía
y motion). Pensado para copiar/pegar bloques en los apartados de "interfaz
de usuario" / "diseño" de la memoria.

---

## 1. Identidad visual

GymQuest adopta un lenguaje **retro-pixel / RPG 8-bit**. La inspiración
viene de los HUDs de juegos clásicos de NES/SNES (menús de FFI, FFVI,
Dragon Quest) reinterpretados con tipografía pixelada y neón verde sobre
fondos casi negros.

**Decisión justificada**: el dominio (entreno + gamificación) gana
coherencia narrativa cuando la UI parece un "personaje en un menú de
juego" en vez de un dashboard genérico tipo SaaS. La estética también
diferencia visualmente la app de competidores como MyFitnessPal, Strong o
Hevy, que usan estilos limpios "iOS-like".

---

## 2. Paleta de colores

Centralizada en `tailwind.config.js`. Cada color tiene un nombre semántico
para que la intención sea evidente en el código sin tener que mirar el
hex.

### 2.1 Superficies (fondos)

| Token Tailwind | Hex | Uso |
|---|---|---|
| `bg-page` | `#0a0a0f` | Fondo de página / página oscura más profunda |
| `bg-card` | `#0d0d14` | Superficie de panel / tarjeta |
| `bg-subtle` | `#12121a` | Bloques anidados o inputs dentro de un panel |

### 2.2 Bordes

| Token Tailwind | Hex | Uso |
|---|---|---|
| `border-border` | `#1e1e2e` | Borde estándar de tarjeta |
| `border-border-muted` | `#27272a` | Divisores internos / elementos secundarios |

### 2.3 Texto (paleta de tinta)

| Token Tailwind | Hex | Uso |
|---|---|---|
| `text-ink` | `#e4e4e7` | Texto principal (cuerpo, valores) |
| `text-ink-muted` | `#a1a1aa` | Etiquetas / metadata / texto auxiliar |
| `text-ink-faint` | `#71717a` | Hints / placeholders / texto de fondo |
| `text-ink-disabled` | `#52525b` | Estados deshabilitados |

### 2.4 Acento — verde "neón"

| Token Tailwind | Hex | Uso |
|---|---|---|
| `text-accent` / `bg-accent` | `#22c55e` | Color principal de marca |
| `bg-accent-hover` | `#4ade80` | Hover de botones primarios |
| `border-accent-deep` | `#15803d` | Sombras / borde inferior de botones (efecto 3D presionable) |

Equivalentes a `green-500`, `green-400` y `green-700` de Tailwind por
defecto. Se mantienen los nombres `green-*` en código heredado por
compatibilidad; se prefiere `accent-*` para código nuevo.

### 2.5 Colores funcionales

| Color | Hex | Significado |
|---|---|---|
| Rojo | `#ef4444` (`red-500`) | Errores, acciones destructivas, racha en peligro |
| Ámbar | `#eab308` (`yellow-500`) | Advertencias, nivel intermedio, mejor récord |
| Naranja | `#f97316` (`orange-500`) | Racha activa (icono de fuego) |
| Azul | `#3b82f6` (`blue-500`) | Fechas, datos neutros |
| Púrpura | `#a855f7` (`purple-500`) | Tier legendario, tenacidad |
| Rosa | `#ec4899` (`pink-500`) | Estamina (stat) |

### 2.6 Paleta de stats (RPG)

Cada stat tiene un color de identidad propio para el icono. La barra de
progreso usa un degradado del color de la stat hacia el verde de marca,
manteniendo cohesión con identidad visible.

| Stat | Hex | Mapping con atributo de juego |
|---|---|---|
| Fuerza | `#f97316` | Naranja — STR clásico |
| Resistencia | `#22c55e` | Verde — VIT |
| Estamina | `#ec4899` | Rosa — END |
| Agilidad | `#3b82f6` | Azul — AGI |
| Tenacidad | `#a855f7` | Púrpura — INT/WIS |
| Vigor | `#eab308` | Amarillo — LUK / CHA |

---

## 3. Tipografía

Sistema dual: una fuente para titulares y UI, otra para texto largo.

| Token | Fuente | Uso |
|---|---|---|
| `font-pixel` | **Press Start 2P** (Google Fonts) | Toda la UI: títulos, etiquetas, botones, datos |
| `font-pixel-mono` | **VT323** (Google Fonts) | Descripciones, párrafos largos, frases narrativas |

### 3.1 Escala tipográfica

Tailwind con tamaños arbitrarios. Por convención:

| Clase | px | Uso |
|---|---|---|
| `text-[7px]` | 7px | Tags / chips muy pequeños |
| `text-[8px]` | 8px | Labels secundarias en sidebar / metadata |
| `text-[9px]` | 9px | Subtitles, breadcrumbs |
| `text-[10px]` | 10px | Items de menú, body de cards |
| `text-[11px]` | 11px | Subtítulos prominentes |
| `text-base` (16px) | 16px | Texto VT323 estándar |
| `text-lg` / `text-xl` | 18-20px | Títulos de página |

### 3.2 Detalles tipográficos

- `tracking-widest` (`letter-spacing: 0.1em`) en práctica universal con
  Press Start 2P para que las letras pixeladas respiren.
- Texto en mayúsculas para títulos y CTAs (`uppercase` o constantes
  ya en mayúsculas) — refuerza el feel arcade.
- Glow consistente en títulos verde:
  `[text-shadow:0_0_14px_rgba(34,197,94,0.55)]`.

---

## 4. Layout y espaciado

### 4.1 Contenedor base

Pages usan `max-w-{4xl|5xl|6xl}` + `mx-auto` para limitar el ancho de
contenido en desktop. El layout principal es `DashboardLayout` con header
sticky + sidebar lateral (en desktop) o drawer (en móvil).

### 4.2 Grid

Sistema mobile-first. Patrones recurrentes:

- Stats compactos: `grid-cols-1 sm:grid-cols-2 xl:grid-cols-3`
- Cards de dashboard: `grid-cols-1 md:grid-cols-3`
- Pareja card-card: `grid-cols-1 md:grid-cols-2`
- Tablas y formularios: `grid-cols-1 sm:grid-cols-2` o `sm:grid-cols-3`

### 4.3 Bordes

Bordes de 2px (`border-2`) para todas las superficies importantes. Los
bordes son un elemento dominante del estilo 8-bit — definen las "ventanas"
de la UI.

### 4.4 Pixel corners

Componente `<PixelCorners>` que renderiza marcas en las 4 esquinas de un
panel, evocando los bordes ornamentados de los menús de juegos retro.

---

## 5. Sombras y efectos

Todas las sombras siguen el patrón "glow neón verde" sobre fondo oscuro.

### 5.1 Tokens de sombra

| Token Tailwind | Valor | Uso |
|---|---|---|
| `shadow-pixel-glow-sm` | `0 0 12px rgba(34,197,94,0.35)` | Botones secundarios |
| `shadow-pixel-glow` | `0 0 18px rgba(34,197,94,0.45)` | Botones primarios destacados |
| `shadow-pixel-glow-lg` | `0 0 60px rgba(34,197,94,0.35)` | Hero cards |
| `shadow-pixel-frame` | `0 0 0 4px rgba(10,10,15,0.8), 0 0 60px rgba(34,197,94,0.35)` | Tarjetas hero con marco interno |

### 5.2 Botones primarios — efecto presionable

Los botones de acción primaria tienen un `border-b-4 border-green-700`
que al hacer click se sustituye por `border-b-0 active:mt-1`. Imita el
efecto de un botón físico siendo presionado, igual que en Game Boy.

```tsx
className="bg-green-500 hover:bg-green-400 text-page
           border-b-4 border-green-700 hover:border-green-600
           active:border-b-0 active:mt-1
           transition-all duration-150
           shadow-pixel-glow-sm"
```

---

## 6. Iconografía

Tres familias de iconos coexisten:

1. **Heroicons** (`@heroicons/react`) — outline + solid. Se usan para
   navegación, acciones y datos genéricos. Encajan con el estilo retro
   por ser monocromáticos y geométricos simples.

2. **SVG inline custom** — silueta pixel-art de personajes (espadas en
   `StatConfig.tsx`) y formas decorativas como las "esquinas" de panel.

3. **MuscleArt** — SVGs ilustrativos por grupo muscular, usados como
   fallback visual en la búsqueda de ejercicios cuando la API no
   devuelve gif. Diseñados como pictogramas reconocibles a 48×48 px.

---

## 7. Motion

Toda la animación usa **framer-motion**. Decisiones clave:

- **Duración estándar**: 150–250ms para transiciones de UI
- **Easing**: `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out fuerte) para que
  las animaciones se sientan "snap" en vez de gomosas
- **Respeto a `useReducedMotion`** — todas las animaciones no esenciales
  se desactivan si el usuario tiene preferencia de reducción de movimiento
  en el sistema (accesibilidad)
- **Stagger** en listas — los hijos aparecen con 100ms de retraso entre
  ellos (efecto cascada) en cards de dashboard

### 7.1 Animaciones CSS personalizadas (`index.css`)

| Keyframe | Uso |
|---|---|
| `pixelFloat` / `pixelFloatAlt` | Elementos decorativos del fondo flotando |
| `pixelPulse` | Pulso de elementos interactivos |
| `scanlineShift` | Líneas de escaneo CRT en backgrounds |
| `gridDrift` | Cuadrícula de fondo desplazándose lentamente |
| `twinkle` | Estrellas parpadeantes en landing |
| `orbFloat` | Orbes de luz flotando en fondo |
| `slideInLeft` | Entrada de elementos desde la izquierda |

---

## 8. Patrones de componente

### 8.1 Hero card (CharacterBadge, RoutineDetail, RecommendedRoutineCard)

```tsx
<article className="relative border-2 border-green-500/60 bg-card
                    p-5 sm:p-6 shadow-pixel-frame">
  <PixelCorners size="md" className="border-green-500/60" />
  {/* contenido */}
</article>
```

### 8.2 Card neutro (StatBar, AccountSummary tile)

```tsx
<div className="border-2 border-border bg-page p-3">
  {/* contenido */}
</div>
```

### 8.3 Botón primario

```tsx
<button className="font-pixel text-[10px] tracking-widest
                   bg-accent hover:bg-accent-hover text-page
                   px-5 py-3 border-b-4 border-accent-deep
                   active:border-b-0 active:mt-1
                   transition-all duration-150
                   shadow-pixel-glow-sm">
  ▶ ACCION
</button>
```

### 8.4 Tag / chip

```tsx
<span className="font-pixel text-[7px] tracking-widest
                 border border-green-500/40 bg-green-500/10
                 text-accent px-1.5 py-0.5 uppercase">
  PECTORALS
</span>
```

---

## 9. Accesibilidad

- **Contraste**: paleta diseñada para WCAG AA. Texto `text-ink` (`#e4e4e7`)
  sobre `bg-card` (`#0d0d14`) tiene ratio > 14:1.
- **Focus visible**: todos los elementos interactivos tienen
  `focus-visible:outline-2 outline-green-400`.
- **Navegación por teclado**: drawer móvil cierra con ESC, modales tienen
  focus trap (Tab cicla dentro del diálogo).
- **`aria-pressed` / `aria-expanded`** en toggles y disclosure widgets.
- **`prefers-reduced-motion`** respetado en todas las animaciones.

---

## 10. Responsive

Mobile-first con breakpoints estándar de Tailwind:

| Breakpoint | Min width | Comportamiento del layout |
|---|---|---|
| (default) | 0px | Sidebar oculto, drawer accesible vía hamburguesa, cards apiladas |
| `sm` | 640px | Algunas grids 2-col, paddings sm |
| `md` | 768px | Grids 2-col / 3-col en dashboard, formularios 2-col |
| `lg` | 1024px | Sidebar fija visible, layout 2-col en perfil |
| `xl` | 1280px | Stats compactos en 3-col |

---

## 11. Referencias de inspiración

- Final Fantasy VI (1994) — menús de stats con ventanas enmarcadas
- Pokémon Red/Blue (1996) — diálogos en ventanas con bordes
- Stardew Valley (2016) — paleta nocturna con acentos vibrantes
- Lo-fi terminal aesthetics — verde fosforito sobre negro
- shadcn/ui — sistema de tokens semánticos (`background`, `foreground`,
  `muted`, `accent`)

---

## 12. Stack tecnológico de UI

- **React 19** + **TypeScript** — base
- **Tailwind CSS 3** — utility-first styling
- **framer-motion** — animaciones
- **Heroicons** — iconografía base
- **recharts** — gráficos (peso, progresión)
- **Press Start 2P** + **VT323** (Google Fonts) — tipografías retro

---
