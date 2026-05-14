import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export interface PixelSelectOption {
  value: string;
  label: string;
}

interface PixelSelectProps {
  /** Currently selected value, or empty string for "no selection". */
  value: string;
  options: PixelSelectOption[];
  /** Shown when `value === ''` and as the empty/clear option label. */
  placeholder: string;
  onChange: (value: string) => void;
  /** ARIA label for screen readers when there's no visible <label>. */
  ariaLabel: string;
  hasError?: boolean;
  className?: string;
}

/**
 * Pixel-styled dropdown built from a button + portal-rendered list.
 * Used wherever the native `<select>` popup would clash with the dark
 * RPG palette (Chrome/Edge render the option list with a white system
 * background that `appearance-none` and `[color-scheme:dark]` don't
 * fully override).
 *
 * The popover renders through a portal at `document.body` with
 * `position: fixed` and viewport-aware coordinates: it flips above the
 * trigger when there isn't enough room below, and caps its height to
 * the available space (with internal scroll). This is the same
 * pattern PixelDatePicker uses, and exists for the same reasons:
 *
 *  1. Several call sites (RoutineCard, the workout view, profile
 *     form) live inside containers with `overflow: hidden` — an
 *     absolutely-positioned popover would get clipped and disappear.
 *  2. On mobile the trigger frequently sits near the bottom of the
 *     viewport. A static "below" placement would push the list off-
 *     screen with no scrollbar to recover it.
 *
 * Behaviour:
 *  - Click button → toggle open/closed.
 *  - Click outside or ESC → closes.
 *  - Selecting an item → fires onChange and closes.
 *  - Long lists scroll inside the popup (max-height + overflow-y-auto).
 */
export const PixelSelect = (props: PixelSelectProps): React.JSX.Element => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLUListElement>(null);
  // Two placements: anchored by `top` when there's room below,
  // anchored by `bottom` when we flip above. Anchoring by bottom
  // keeps the popover flush against the trigger regardless of how
  // tall it ends up rendering — anchoring by top reserved the full
  // PREFERRED slab and left a gap when the option list was short.
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

  // Compute viewport-anchored position whenever the popover opens, the
  // page scrolls, or the viewport resizes. `useLayoutEffect` so the
  // first paint already lands at the right coordinates instead of
  // flashing at 0,0. `true` on the scroll listener so we catch
  // scrolls inside any ancestor (the routine card and live workout
  // view both have their own scroll containers).
  useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      if (!triggerRef.current) return;
      const r = triggerRef.current.getBoundingClientRect();
      const GAP = 4;
      const PREFERRED = 288; // matches the previous max-h-72 (18rem)
      const VIEWPORT_PAD = 12;
      const spaceBelow = window.innerHeight - r.bottom - GAP - VIEWPORT_PAD;
      const spaceAbove = r.top - GAP - VIEWPORT_PAD;

      // Prefer below when there's room OR when below has at least as
      // much space as above (avoids pointless flipping when the
      // trigger sits mid-viewport).
      const placeBelow = spaceBelow >= PREFERRED || spaceBelow >= spaceAbove;
      const available = Math.max(120, placeBelow ? spaceBelow : spaceAbove);
      const maxHeight = Math.min(PREFERRED, available);

      if (placeBelow) {
        setPos({
          placement: 'below',
          top: r.bottom + GAP,
          left: r.left,
          width: r.width,
          maxHeight,
        });
      } else {
        setPos({
          placement: 'above',
          bottom: window.innerHeight - r.top + GAP,
          left: r.left,
          width: r.width,
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

  // Close on outside click. Both the trigger AND the portalled
  // popover count as "inside" so clicks on options don't dismiss
  // before onChange fires.
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent): void => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        popoverRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  // Close on ESC for keyboard users.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const selected = props.options.find((o) => o.value === props.value);
  const display = selected?.label ?? props.placeholder;

  const borderClass = props.hasError
    ? 'border-red-500/70'
    : open
      ? 'border-green-500/70'
      : 'border-border hover:border-green-500/50';

  const popover = open ? (
    <ul
      ref={popoverRef}
      role="listbox"
      aria-label={props.ariaLabel}
      style={{
        position: 'fixed',
        ...(pos.placement === 'below'
          ? { top: pos.top }
          : { bottom: pos.bottom }),
        left: pos.left,
        width: pos.width,
        maxHeight: pos.maxHeight,
        zIndex: 1000,
      }}
      className="pixel-select-scroll overflow-y-auto border-2 border-green-500/60 bg-page shadow-[0_12px_32px_rgba(0,0,0,0.85),0_0_22px_rgba(34,197,94,0.3)]"
    >
      {props.options.map((opt) => {
        const isSelected = opt.value === props.value;
        return (
          <li key={opt.value} role="option" aria-selected={isSelected}>
            <button
              type="button"
              onClick={() => {
                props.onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 font-pixel-mono text-base tracking-wide transition-colors ${
                isSelected
                  ? 'bg-green-500/20 text-green-400'
                  : 'text-ink hover:bg-green-500/10 hover:text-green-400'
              }`}
            >
              {opt.label}
            </button>
          </li>
        );
      })}
    </ul>
  ) : null;

  return (
    <div className={`relative ${props.className ?? ''}`.trim()}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={props.ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`w-full flex items-center justify-between gap-2 border-2 ${borderClass} bg-subtle px-3 py-2.5 font-pixel text-[10px] tracking-widest text-left transition-colors focus:outline-none ${
          selected ? 'text-ink' : 'text-ink-faint'
        }`}
      >
        <span className="truncate">{display}</span>
        <ChevronDownIcon
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 text-green-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {popover && createPortal(popover, document.body)}
    </div>
  );
};
