import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface PixelDatePickerProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  error?: boolean;
  placeholder?: string;
  /**
   * Year the calendar lands on the first time it opens with an empty
   * `value`. Defaults to the current year, which is the right answer
   * for almost every use case (e.g. logging today's weight). The
   * onboarding birth-date step overrides this to ~25 years ago so the
   * average new user doesn't have to scroll back two and a half
   * decades just to pick their year of birth.
   */
  initialYear?: number;
}

const MONTHS_ES = [
  'ENERO',
  'FEBRERO',
  'MARZO',
  'ABRIL',
  'MAYO',
  'JUNIO',
  'JULIO',
  'AGOSTO',
  'SEPTIEMBRE',
  'OCTUBRE',
  'NOVIEMBRE',
  'DICIEMBRE',
];

// Spanish week starts on Monday (L). The native getDay() returns
// Sunday=0; we shift to Monday=0 below so the grid lines up with this
// label row.
const DAYS_ES = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

const parseISO = (
  s: string
): { year: number; month: number; day: number } | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split('-').map(Number);
  return { year: y, month: m - 1, day: d };
};

const formatISO = (year: number, month: number, day: number): string =>
  `${String(year).padStart(4, '0')}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

const formatDisplay = (s: string): string => {
  const p = parseISO(s);
  if (!p) return '';
  return `${String(p.day).padStart(2, '0')}/${String(p.month + 1).padStart(2, '0')}/${p.year}`;
};

const daysInMonth = (year: number, month: number): number =>
  new Date(year, month + 1, 0).getDate();

// Sunday-based getDay() → Monday-based offset so the grid begins on
// the L (lunes) column. (sunday=0 maps to 6, monday=1 maps to 0, …).
const firstWeekdayMon0 = (year: number, month: number): number => {
  const sun0 = new Date(year, month, 1).getDay();
  return (sun0 + 6) % 7;
};

const compareYmd = (
  a: { year: number; month: number; day: number },
  b: { year: number; month: number; day: number }
): number => {
  if (a.year !== b.year) return a.year - b.year;
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day;
};

type PixelSelectOption = { value: number; label: string };

/**
 * Custom select used in the date picker's header. Native `<select>`
 * only lets CSS style the closed trigger — the open option list is
 * drawn by the OS (Windows dropdown, macOS popup, iOS wheel picker),
 * which broke visual continuity with the rest of the pixel calendar.
 * Portalled to <body> so the list stacks above the date popover and
 * isn't clipped by its `overflow-y-auto`. Outside-click is
 * stop-propagated at the list so the parent date picker doesn't
 * mis-interpret a click on a year/month as "click outside calendar"
 * and dismiss itself.
 */
const PixelSelect = (props: {
  ariaLabel: string;
  value: number;
  options: PixelSelectOption[];
  onChange: (value: number) => void;
  className?: string;
}): React.JSX.Element => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLButtonElement>(null);

  type PixelSelectPos =
    | {
        placement: 'below';
        top: number;
        left: number;
        width: number;
        maxHeight: number;
      }
    | {
        placement: 'above';
        bottom: number;
        left: number;
        width: number;
        maxHeight: number;
      };
  const [pos, setPos] = useState<PixelSelectPos>({
    placement: 'below',
    top: 0,
    left: 0,
    width: 0,
    maxHeight: 0,
  });

  useLayoutEffect(() => {
    if (!open) return;
    const update = (): void => {
      if (!triggerRef.current) return;
      const r = triggerRef.current.getBoundingClientRect();
      const GAP = 4;
      const VIEWPORT_PAD = 8;
      const PREFERRED = 240;
      const width = Math.max(r.width, 80);
      const left = Math.min(
        Math.max(VIEWPORT_PAD, r.left),
        window.innerWidth - width - VIEWPORT_PAD
      );
      const spaceBelow = window.innerHeight - r.bottom - GAP - VIEWPORT_PAD;
      const spaceAbove = r.top - GAP - VIEWPORT_PAD;
      const placeBelow = spaceBelow >= 120 || spaceBelow >= spaceAbove;
      const available = Math.max(80, placeBelow ? spaceBelow : spaceAbove);
      const maxHeight = Math.min(PREFERRED, available);
      if (placeBelow) {
        setPos({
          placement: 'below',
          top: r.bottom + GAP,
          left,
          width,
          maxHeight,
        });
      } else {
        setPos({
          placement: 'above',
          bottom: window.innerHeight - r.top + GAP,
          left,
          width,
          maxHeight,
        });
      }
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open]);

  // Year lists are ~125 items long — scroll the saved value into the
  // centre on open so the user lands on their current selection
  // instead of the top of the list.
  useLayoutEffect(() => {
    if (!open) return;
    selectedItemRef.current?.scrollIntoView({ block: 'center' });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent): void => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        listRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    const onEsc = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const current = props.options.find((o) => o.value === props.value);

  const list = open ? (
    <div
      ref={listRef}
      role="listbox"
      aria-label={props.ariaLabel}
      // Stop propagation so the parent date picker's outside-click
      // handler doesn't see clicks inside the portalled list (the
      // list lives outside the calendar's DOM subtree).
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        ...(pos.placement === 'below'
          ? { top: pos.top }
          : { bottom: pos.bottom }),
        left: pos.left,
        width: pos.width,
        maxHeight: pos.maxHeight,
        // Above the date popover (z-index 1000) so the list isn't
        // hidden behind the calendar grid when it expands downward.
        zIndex: 1001,
      }}
      className="bg-card border-2 border-green-500/40 shadow-[0_0_24px_rgba(34,197,94,0.25)] overflow-y-auto"
    >
      {props.options.map((o) => {
        const isSelected = o.value === props.value;
        return (
          <button
            key={o.value}
            ref={isSelected ? selectedItemRef : undefined}
            type="button"
            role="option"
            aria-selected={isSelected}
            onClick={() => {
              props.onChange(o.value);
              setOpen(false);
            }}
            className={`w-full text-center px-2 py-2 font-pixel text-[9px] tracking-widest transition-colors ${
              isSelected
                ? 'bg-green-500/15 text-green-300'
                : 'text-ink hover:bg-green-500/10 hover:text-green-300'
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  ) : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={props.ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`bg-subtle border-2 px-2 py-2 font-pixel text-[9px] tracking-widest text-ink transition-colors flex items-center justify-between gap-2 ${
          open
            ? 'border-green-500/70'
            : 'border-border hover:border-green-500/50'
        } ${props.className ?? ''}`}
      >
        <span className="truncate">{current?.label ?? ''}</span>
        <span className="text-ink-muted">▼</span>
      </button>
      {list && createPortal(list, document.body)}
    </>
  );
};

export const PixelDatePicker = (
  props: PixelDatePickerProps
): React.JSX.Element => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Popover position is computed in viewport coordinates (`position:
  // fixed`) and rendered through a portal directly under <body>. Why:
  // the wizard wraps every step in `<div class="overflow-hidden">`
  // for framer-motion's slide transitions, which clips any absolutely-
  // positioned popover at the step boundary — the calendar would
  // open invisibly under the SIGUIENTE button. The portal escapes
  // every ancestor's overflow/transform stacking context.
  //
  // Two placements:
  //   - below: anchored by `top` so the popover slides downwards from
  //     just under the trigger (the natural reading flow).
  //   - above: anchored by `bottom` (= viewport bottom to popover's
  //     bottom edge) so the popover always hugs the trigger from
  //     above, regardless of how tall it actually renders. Anchoring
  //     by `top` instead reserved a full PREFERRED-height slab and
  //     left a visible gap when the calendar's real content was
  //     shorter than the cap.
  //
  // `maxHeight` is the second half of the viewport-fit story: when
  // the trigger sits low in the viewport (small laptop, mobile
  // landscape) we flip the popover ABOVE the trigger instead of
  // letting it run off the bottom of the screen. The chosen height
  // is then capped to whatever space we actually have, with internal
  // scroll on the day grid as the last-resort fallback.
  type PopoverPos =
    | {
        placement: 'below';
        top: number;
        left: number;
        width: number;
        maxHeight: number;
      }
    | {
        placement: 'above';
        bottom: number;
        left: number;
        width: number;
        maxHeight: number;
      };
  const [pos, setPos] = useState<PopoverPos>({
    placement: 'below',
    top: 0,
    left: 0,
    width: 0,
    maxHeight: 0,
  });

  const today = useMemo(() => {
    const t = new Date();
    return { year: t.getFullYear(), month: t.getMonth(), day: t.getDate() };
  }, []);

  const parsed = parseISO(props.value);
  // Anchor the calendar at the user's saved date when there is one.
  // Otherwise fall back to `initialYear` (defaults to today's year).
  // The birth-date step in onboarding overrides this with
  // `today.year - 25` so birth-year entry doesn't start two decades
  // away from where the typical user is going to land.
  const [viewYear, setViewYear] = useState(
    parsed?.year ?? props.initialYear ?? today.year
  );
  const [viewMonth, setViewMonth] = useState(parsed?.month ?? today.month);

  const minP = props.min ? parseISO(props.min) : null;
  const maxP = props.max ? parseISO(props.max) : null;

  // Year dropdown — descending so the most recent year (typically the
  // upper bound) sits at the top, where the cursor lands when the
  // select opens. Birth-date entry skews towards recent years.
  const yearOptions = useMemo(() => {
    const start = minP?.year ?? 1900;
    const end = maxP?.year ?? today.year;
    const list: number[] = [];
    for (let y = end; y >= start; y--) list.push(y);
    return list;
  }, [minP?.year, maxP?.year, today.year]);

  // Recompute the popover position whenever it opens, scrolls, or the
  // viewport resizes. `useLayoutEffect` so the first paint after open
  // already lands at the right coordinates instead of flashing at
  // 0,0. `true` on the scroll listener so we catch scrolls inside any
  // ancestor (the wizard frame is its own scroll container on
  // mobile).
  useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      if (!triggerRef.current) return;
      const r = triggerRef.current.getBoundingClientRect();
      const GAP = 8;
      const PREFERRED = 380; // header + 7 weekday labels + 6 day rows + padding
      const VIEWPORT_PAD = 12;
      // Width policy, in priority order:
      //   1) Never exceed the viewport (minus 2× VIEWPORT_PAD). The
      //      previous version used Math.max instead of Math.min on
      //      this constraint, so phones narrower than ~324px ended up
      //      with a 300px popover that overflowed the right edge.
      //   2) Aim for at least PREFERRED_WIDTH (300) so the 7-column
      //      day grid has room for square-ish cells — but step 1 wins
      //      if the screen is smaller than that.
      //   3) If the trigger is wider than PREFERRED_WIDTH, match it.
      //
      // On a 320px-wide viewport this yields 296px (the screen wins
      // over the 300px preference); on a 1280px viewport it stays at
      // 300px (preference wins over the narrow trigger).
      const PREFERRED_WIDTH = 300;
      const viewportWidth = window.innerWidth;
      const viewportCap = Math.max(0, viewportWidth - 2 * VIEWPORT_PAD);
      const desiredWidth = Math.max(r.width, PREFERRED_WIDTH);
      const width = Math.min(desiredWidth, viewportCap);
      // Centre the popover on the trigger's midpoint, then clamp so
      // it never overflows the viewport. The previous version
      // anchored on the trigger's left edge — fine when the trigger
      // was wide, but inside the register-weight form (the date
      // input is the middle 1fr column, ~120px) the 300px popover
      // shot off entirely to the right of its anchor, covering the
      // GUARDAR button without any visible relationship to the
      // trigger. Centring keeps the calendar visually tethered to
      // the field that opened it, on both mobile and desktop.
      const triggerCenter = r.left + r.width / 2;
      const idealLeft = triggerCenter - width / 2;
      const left = Math.min(
        Math.max(VIEWPORT_PAD, idealLeft),
        viewportWidth - width - VIEWPORT_PAD
      );
      const spaceBelow = window.innerHeight - r.bottom - GAP - VIEWPORT_PAD;
      const spaceAbove = r.top - GAP - VIEWPORT_PAD;

      // Prefer below when it fits OR when there's at least as much
      // room below as above (avoids ping-pong when the trigger sits
      // exactly mid-viewport). Flip above only when below is the
      // genuinely worse choice.
      const placeBelow = spaceBelow >= PREFERRED || spaceBelow >= spaceAbove;
      const available = Math.max(120, placeBelow ? spaceBelow : spaceAbove);
      const maxHeight = Math.min(PREFERRED, available);

      if (placeBelow) {
        setPos({
          placement: 'below',
          top: r.bottom + GAP,
          left,
          width,
          maxHeight,
        });
      } else {
        // Anchor by `bottom` so the popover always sits flush above
        // the trigger no matter how tall it actually renders. Using
        // `top = r.top - GAP - maxHeight` reserved a full slab of
        // pixels and left a gap when the calendar's content was
        // shorter than the cap.
        setPos({
          placement: 'above',
          bottom: window.innerHeight - r.top + GAP,
          left,
          width,
          maxHeight,
        });
      }
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open]);

  // Close on outside click or Escape — same dismiss semantics as
  // ConfirmDialog so keyboard users get a consistent escape hatch.
  // Both the trigger AND the portalled popover count as "inside" so
  // clicks on the calendar don't dismiss it.
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        popoverRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  // Sync the view to the controlled value: if a parent resets the
  // form (or the user types a date elsewhere), opening the calendar
  // should land on that month, not on whatever was last viewed.
  useEffect(() => {
    const p = parseISO(props.value);
    if (p) {
      setViewYear(p.year);
      setViewMonth(p.month);
    }
  }, [props.value]);

  const isDayDisabled = (year: number, month: number, day: number): boolean => {
    const candidate = { year, month, day };
    if (minP && compareYmd(candidate, minP) < 0) return true;
    if (maxP && compareYmd(candidate, maxP) > 0) return true;
    return false;
  };

  const goPrev = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goNext = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const selectDay = (day: number) => {
    if (isDayDisabled(viewYear, viewMonth, day)) return;
    props.onChange(formatISO(viewYear, viewMonth, day));
    setOpen(false);
  };

  // Build a 7-column grid: leading empty cells for the first-weekday
  // offset, then 1..N for the month, then trailing empties so the row
  // count is always whole (avoids the grid jumping height between
  // months that span 5 vs 6 visual rows).
  const cells: Array<number | null> = useMemo(() => {
    const total = daysInMonth(viewYear, viewMonth);
    const offset = firstWeekdayMon0(viewYear, viewMonth);
    const out: Array<number | null> = [];
    for (let i = 0; i < offset; i++) out.push(null);
    for (let d = 1; d <= total; d++) out.push(d);
    while (out.length % 7 !== 0) out.push(null);
    return out;
  }, [viewYear, viewMonth]);

  const display = formatDisplay(props.value);

  const triggerBase =
    'w-full bg-subtle border-2 px-4 py-4 font-pixel-mono text-base sm:text-lg text-left transition-colors';
  const borderColor = props.error
    ? 'border-red-500/70'
    : open
      ? 'border-green-500/70'
      : 'border-border';

  const popover = open ? (
    <div
      ref={popoverRef}
      role="dialog"
      aria-label="Selector de fecha"
      style={{
        position: 'fixed',
        ...(pos.placement === 'below'
          ? { top: pos.top }
          : { bottom: pos.bottom }),
        left: pos.left,
        width: pos.width,
        maxHeight: pos.maxHeight,
        // The popover stacks above the wizard backdrop (z-10) and any
        // sticky chrome. 1000 is the project's "above-everything"
        // tier — same level used by TierUpModal/ConfirmDialog.
        zIndex: 1000,
      }}
      className="bg-card border-2 border-green-500/40 p-3 shadow-[0_0_24px_rgba(34,197,94,0.25)] overflow-y-auto"
    >
      <div className="flex items-center gap-2 mb-3">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Mes anterior"
          className="font-pixel text-[10px] border-2 border-border-muted bg-subtle text-ink-muted hover:border-green-500/50 hover:text-green-400 px-3 py-2 transition-colors"
        >
          ◀
        </button>
        <PixelSelect
          ariaLabel="Mes"
          value={viewMonth}
          options={MONTHS_ES.map((m, i) => ({ value: i, label: m }))}
          onChange={setViewMonth}
          className="flex-1 min-w-0"
        />
        <PixelSelect
          ariaLabel="Año"
          value={viewYear}
          options={yearOptions.map((y) => ({ value: y, label: String(y) }))}
          onChange={setViewYear}
        />
        <button
          type="button"
          onClick={goNext}
          aria-label="Mes siguiente"
          className="font-pixel text-[10px] border-2 border-border-muted bg-subtle text-ink-muted hover:border-green-500/50 hover:text-green-400 px-3 py-2 transition-colors"
        >
          ▶
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS_ES.map((d) => (
          <div
            key={d}
            className="text-center font-pixel text-[8px] text-ink-faint py-1"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={idx} className="h-9" />;
          }
          const disabled = isDayDisabled(viewYear, viewMonth, day);
          const isSelected =
            parsed !== null &&
            parsed.year === viewYear &&
            parsed.month === viewMonth &&
            parsed.day === day;
          const isToday =
            viewYear === today.year &&
            viewMonth === today.month &&
            day === today.day;
          const cellClass = [
            'h-9 font-pixel-mono text-base border-2 transition-colors',
            disabled
              ? 'border-transparent text-ink-disabled cursor-not-allowed'
              : isSelected
                ? 'border-green-500 bg-green-500/15 text-green-300 shadow-[0_0_10px_rgba(34,197,94,0.35)]'
                : isToday
                  ? 'border-border-muted text-ink hover:border-green-500/50 hover:text-green-400'
                  : 'border-transparent text-ink-muted hover:border-green-500/50 hover:text-green-400',
          ].join(' ');
          return (
            <button
              key={idx}
              type="button"
              onClick={() => selectDay(day)}
              disabled={disabled}
              aria-label={`${day} de ${MONTHS_ES[viewMonth].toLowerCase()} de ${viewYear}`}
              aria-pressed={isSelected}
              className={cellClass}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        id={props.id}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`${triggerBase} ${borderColor} ${display ? 'text-ink' : 'text-ink-disabled'} flex items-center justify-between gap-3 hover:border-green-500/50`}
      >
        <span>{display || (props.placeholder ?? 'dd/mm/aaaa')}</span>
        <span className="font-pixel text-[10px] text-ink-muted">▼</span>
      </button>
      {popover && createPortal(popover, document.body)}
    </>
  );
};
