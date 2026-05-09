import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { useEffect, useRef, useState } from 'react';

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
 * Pixel-styled dropdown built from a button + absolute list. Used wherever
 * the native `<select>` popup would clash with the dark RPG palette
 * (Chrome/Edge render the option list with a white system background that
 * `appearance-none` and `[color-scheme:dark]` don't fully override).
 *
 * Behaviour:
 *  - Click button → toggle open/closed.
 *  - Click outside or ESC → closes.
 *  - Selecting an item → fires onChange and closes.
 *  - Long lists scroll inside the popup (max-h + overflow-y-auto).
 */
export const PixelSelect = (props: PixelSelectProps): React.JSX.Element => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click — native <select> handles this for free; here
  // we own it.
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent): void => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
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

  return (
    <div
      ref={containerRef}
      className={`relative ${props.className ?? ''}`.trim()}
    >
      <button
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

      {open && (
        // Solid `bg-page` so the popover reads as a separate floating
        // layer rather than continuing the card surface, plus a strong
        // shadow to reinforce the elevation. `max-h-72` is sized to
        // fit the cardio catalog (8 entries) without scroll on typical
        // devices — the previous `max-h-56` cut the list mid-row and
        // forced a default browser scrollbar that clashed with the
        // pixel theme. The custom-scrollbar styles only kick in for
        // option lists that genuinely overflow.
        <ul
          role="listbox"
          aria-label={props.ariaLabel}
          className="pixel-select-scroll absolute z-30 left-0 right-0 mt-1 max-h-72 overflow-y-auto border-2 border-green-500/60 bg-page shadow-[0_12px_32px_rgba(0,0,0,0.85),0_0_22px_rgba(34,197,94,0.3)]"
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
      )}
    </div>
  );
};
