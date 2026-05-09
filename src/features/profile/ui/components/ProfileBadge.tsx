import type { BadgeConfig } from '../badges';

interface ProfileBadgeProps {
  config: BadgeConfig | undefined;
  label: string;
}

/**
 * Single chip rendering an icon + label. The chip frame uses the green
 * theme palette (consistent with the rest of the app) — the per-value
 * accent colour from `config` is reserved for the icon glow only, so a
 * row of chips reads as "one family" instead of a multicoloured rainbow
 * that fights the app's identity.
 */
export const ProfileBadge = ({
  config,
  label,
}: ProfileBadgeProps): React.JSX.Element => {
  const iconAccent = config?.color ?? '#22c55e';
  const icon = config?.icon ?? '◆';
  return (
    <span className="inline-flex items-center gap-2 border-2 border-border bg-page px-3 py-1.5 hover:border-green-500/40 transition-colors">
      <span
        aria-hidden="true"
        className="text-base leading-none"
        style={{
          color: iconAccent,
          textShadow: `0 0 6px ${iconAccent}80`,
        }}
      >
        {icon}
      </span>
      <span className="font-pixel text-[9px] sm:text-[10px] tracking-widest uppercase text-ink">
        {label}
      </span>
    </span>
  );
};
