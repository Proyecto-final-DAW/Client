import {
  Bars3Icon,
  BookOpenIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  HeartIcon,
  HomeIcon,
  Squares2X2Icon,
  TrophyIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { useAuth } from '../context/hooks/useAuth';
import { useCharacterState } from '../context/hooks/useCharacterState';
import {
  rankLetterFromTier,
  tierIndexFromState,
} from '../features/character/core/domain/models/RankLabels';
import { ConfirmDialog } from '../shared/components/ConfirmDialog';
import { DashboardBackground } from '../shared/components/DashboardBackground';
import { PixelCorners } from '../shared/components/PixelCorners';

type MenuItem = {
  to: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

type MenuGroup = {
  label: string;
  items: MenuItem[];
};

// Header height — kept in one place because the sidebar `top` and the
// `h-[calc(100vh-…)]` of the scroll containers all depend on it. Two
// breakpoints because mobile gets a slimmer header to claw back vertical
// space (no logo white-space halo, smaller padding).
const HEADER_H = 'h-[4.5rem] lg:h-24';
const HEADER_OFFSET = 'top-[4.5rem] lg:top-24';
const HEADER_HEIGHT_PX = 'h-[calc(100vh-4.5rem)] lg:h-[calc(100vh-6rem)]';

const MENU_GROUPS: MenuGroup[] = [
  {
    label: 'ENTRENAMIENTO',
    items: [
      { to: '/dashboard', label: 'INICIO', icon: HomeIcon },
      { to: '/templates', label: 'RUTINAS', icon: BookOpenIcon },
      { to: '/routines', label: 'COMBATE', icon: ClipboardDocumentListIcon },
      { to: '/progress', label: 'PROGRESO', icon: ChartBarIcon },
    ],
  },
  {
    label: 'PERSONAJE',
    items: [
      { to: '/clases', label: 'CLASES', icon: Squares2X2Icon },
      { to: '/diet', label: 'DIETA', icon: HeartIcon },
      { to: '/achievements', label: 'LOGROS', icon: TrophyIcon },
      { to: '/profile', label: 'PERSONAJE', icon: UserCircleIcon },
    ],
  },
];

type SidebarContentProps = {
  isLoggedIn: boolean;
  user: ReturnType<typeof useAuth>['user'];
  rankLetter: string;
  onNavigate?: () => void;
  /**
   * `sidebar` is the slim fixed desktop rail; `overlay` is the
   * near-full-screen mobile menu, which gets larger type, taller
   * tap targets and a bigger identity card so it reads as a proper
   * full-screen game menu rather than a shrunk-down rail.
   */
  variant?: 'sidebar' | 'overlay';
};

const SidebarContent = ({
  isLoggedIn,
  user,
  rankLetter,
  onNavigate,
  variant = 'sidebar',
}: SidebarContentProps): React.JSX.Element => {
  const isOverlay = variant === 'overlay';

  // Render the name in title-case ("Blue" / "Carlo Magno") instead
  // of forcing toUpperCase. The earlier `.toUpperCase()` painted
  // every name as "BLUE" / "CARLO MAGNO" — read as a code label,
  // not the user's actual name. Title-case also normalises stored
  // values like "BLUE" or "blue" into a consistent display.
  const rawName = user?.name ?? 'Usuario';
  const userName = rawName
    .toLowerCase()
    .replace(/\b\p{L}/gu, (c) => c.toUpperCase());

  // Length-based font size so names always fit without wrapping
  // ugly. Tried letting long names grow the card vertically — read
  // worse than shrinking the type, so we step the font down with
  // length: short names stay at the design size, long handles
  // shrink to fit on one or two lines instead of stretching the
  // identity card to a huge stack. The overlay starts one step
  // larger because it has the full viewport width to play with.
  const userNameSizeClass = isOverlay
    ? userName.length <= 12
      ? 'text-sm'
      : userName.length <= 18
        ? 'text-xs'
        : 'text-[10px]'
    : userName.length <= 9
      ? 'text-[10px]'
      : userName.length <= 13
        ? 'text-[9px]'
        : userName.length <= 18
          ? 'text-[8px]'
          : 'text-[7px]';

  return (
    <div className={`flex flex-col ${isOverlay ? 'gap-7' : 'gap-6'}`}>
      {isLoggedIn && (
        <div
          className={`relative border-2 border-green-500/50 bg-card flex items-center ${
            isOverlay ? 'p-4 gap-4' : 'p-3 gap-3'
          }`}
        >
          <PixelCorners size="sm" className="border-green-500/50" />
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={`Foto de perfil de ${userName}`}
              className={`rounded-sm border-2 border-border object-cover ${
                isOverlay ? 'h-16 w-16' : 'h-12 w-12'
              }`}
            />
          ) : (
            <div
              className={`flex items-center justify-center rounded-sm border-2 border-border bg-green-500/10 ${
                isOverlay ? 'h-16 w-16' : 'h-12 w-12'
              }`}
            >
              <UserCircleIcon
                className={`text-green-400 ${isOverlay ? 'h-9 w-9' : 'h-7 w-7'}`}
              />
            </div>
          )}

          <div className="min-w-0">
            {/* Name on top (the user is the protagonist — their own
                name should read first), rank as a smaller label below.
                Replaced the previous "HEROE" placeholder eyebrow with
                "RANGO F" so the line carries actual progression info
                instead of a generic gendered noun. */}
            {/* `userNameSizeClass` steps the font down for longer
                names so the card never has to truncate or grow into
                an ugly multi-line stack. break-words is the
                last-resort guard for a single 30+ letter no-space
                handle that even the smallest step doesn't fit. */}
            <p
              className={`font-pixel ${userNameSizeClass} text-green-400 break-words leading-snug [text-shadow:0_0_12px_rgba(34,197,94,0.6)]`}
            >
              {userName}
            </p>
            <p
              className={`font-pixel text-ink-muted tracking-widest mt-1 ${
                isOverlay ? 'text-[10px]' : 'text-[9px]'
              }`}
            >
              RANGO {rankLetter}
            </p>
          </div>
        </div>
      )}

      <nav className={`flex flex-col ${isOverlay ? 'gap-7' : 'gap-6'}`}>
        {MENU_GROUPS.map((group) => (
          <div key={group.label} className="flex flex-col gap-2">
            <p
              className={`px-1 font-pixel tracking-widest text-ink-disabled ${
                isOverlay ? 'text-[10px]' : 'text-[8px]'
              }`}
            >
              ▸ {group.label}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex items-center border-2 font-pixel tracking-widest transition-colors ${
                      isOverlay
                        ? 'gap-4 px-4 py-4 text-xs sm:text-sm'
                        : 'gap-3 px-3 py-3 text-[10px]'
                    } ${
                      isActive
                        ? 'border-green-500 bg-green-500/10 text-green-400 shadow-[0_0_14px_rgba(34,197,94,0.3)]'
                        : 'border-border text-ink-muted hover:border-green-500/50 hover:text-green-400'
                    }`
                  }
                >
                  <Icon
                    className={`shrink-0 ${isOverlay ? 'h-6 w-6' : 'h-5 w-5'}`}
                  />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>
    </div>
  );
};

export const DashboardLayout = (): React.JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { state: characterState } = useCharacterState();
  const isLoggedIn = Boolean(user);
  const prefersReducedMotion = useReducedMotion();

  // Default to F when we don't yet have the character state — matches
  // the starting rank, so a brand-new user (or a momentarily slow
  // character fetch) still sees a sensible label instead of an empty
  // "RANGO " or a flash of placeholder text.
  const rankLetter = characterState
    ? rankLetterFromTier(tierIndexFromState(characterState))
    : 'F';

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  // Close the drawer on navigation so the user always lands on the new page,
  // not on the still-open menu.
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Lock body scroll while the drawer is open so the page underneath doesn't
  // scroll-bleed when the user swipes inside the menu.
  useEffect(() => {
    if (!drawerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [drawerOpen]);

  // ESC closes the drawer for keyboard users.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  const clickAuth = () => {
    if (isLoggedIn) {
      // Logout is destructive (closes the session, drops in-flight
      // workouts saved to local storage). A single mis-clicked button
      // at the top of every page used to be enough to nuke a session
      // in progress. Confirm first.
      setLogoutDialogOpen(true);
      return;
    }

    navigate('/login');
  };

  const confirmLogout = () => {
    setLogoutDialogOpen(false);
    logout();
    navigate('/');
  };

  return (
    <div className="relative min-h-screen flex flex-col text-ink">
      <DashboardBackground />
      <header
        className={`sticky top-0 z-30 ${HEADER_H} flex items-center justify-between gap-2 border-b-2 border-border bg-page/95 backdrop-blur-md px-3 sm:px-6 lg:px-14`}
      >
        <div className="flex items-center gap-2">
          {/* Hamburger only on screens narrower than the lg sidebar break. */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={drawerOpen}
            className="lg:hidden inline-flex h-11 w-11 items-center justify-center border-2 border-green-500/70 bg-green-500/10 text-green-400 shadow-[0_0_14px_rgba(34,197,94,0.35)] hover:border-green-400 hover:bg-green-500/20 hover:shadow-[0_0_18px_rgba(34,197,94,0.55)] transition-colors [text-shadow:0_0_8px_rgba(34,197,94,0.6)]"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <Link to="/dashboard" className="flex items-center gap-3">
            <img
              src="/images/Logo.webp"
              alt="GymQuest"
              className="h-[4.25rem] w-auto -my-2 lg:h-28 lg:-my-6 drop-shadow-lg object-contain"
            />
          </Link>
        </div>
        <button
          onClick={clickAuth}
          className="font-pixel text-[10px] sm:text-[11px] lg:text-[10px] bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-4 sm:px-5 lg:px-5 py-2.5 sm:py-3 lg:py-2.5 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(34,197,94,0.35)] whitespace-nowrap"
        >
          {isLoggedIn ? '▶ SALIR' : '▶ ENTRAR'}
        </button>
      </header>

      <div className="relative z-10 flex flex-1">
        {/* Desktop: fixed sidebar. */}
        <aside
          className={`hidden lg:flex sticky ${HEADER_OFFSET} ${HEADER_HEIGHT_PX} w-56 shrink-0 self-start overflow-y-auto border-r-2 border-border bg-page p-4 flex-col gap-6`}
        >
          <SidebarContent
            isLoggedIn={isLoggedIn}
            user={user}
            rankLetter={rankLetter}
          />
        </aside>

        {/* Mobile/tablet: near-full-screen menu overlay.
            Portaled to <body> so its z-index isn't trapped under the
            sticky header — the header sits in a `z-10` stacking-context
            sibling, so an in-tree `fixed` panel rendered *below* it
            (the old slide-in drawer was visibly clipped by the header).
            `inset-3` keeps a thin frame so it still reads as a panel,
            not a brand-new page. */}
        {createPortal(
          <AnimatePresence>
            {drawerOpen && (
              <div className="lg:hidden fixed inset-0 z-[70]">
                <motion.div
                  key="drawer-backdrop"
                  initial={prefersReducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setDrawerOpen(false)}
                  className="absolute inset-0 bg-page/95 backdrop-blur-md"
                  aria-hidden="true"
                />
                <motion.div
                  key="drawer-panel"
                  initial={
                    prefersReducedMotion ? false : { opacity: 0, scale: 0.97 }
                  }
                  animate={{ opacity: 1, scale: 1 }}
                  exit={
                    prefersReducedMotion
                      ? undefined
                      : { opacity: 0, scale: 0.97 }
                  }
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-3 sm:inset-6 flex flex-col overflow-y-auto border-2 border-green-500/60 bg-page p-5 shadow-[0_0_0_4px_rgba(10,10,15,0.85),0_0_60px_rgba(34,197,94,0.3)]"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Menu de navegacion"
                >
                  <PixelCorners size="md" className="border-green-500/60" />
                  <div className="mb-6 flex items-center justify-between">
                    <p className="font-pixel text-xs tracking-widest text-green-400 [text-shadow:0_0_12px_rgba(34,197,94,0.55)]">
                      MENU
                    </p>
                    <button
                      type="button"
                      onClick={() => setDrawerOpen(false)}
                      aria-label="Cerrar menu"
                      className="inline-flex h-11 w-11 items-center justify-center border-2 border-border bg-card text-ink-muted hover:border-green-500/50 hover:text-green-400 transition-colors"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  <SidebarContent
                    isLoggedIn={isLoggedIn}
                    user={user}
                    rankLetter={rankLetter}
                    onNavigate={() => setDrawerOpen(false)}
                    variant="overlay"
                  />
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}

        <main id="main" className="relative flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      <ConfirmDialog
        open={logoutDialogOpen}
        title="¿SALIR?"
        confirmLabel="SALIR"
        cancelLabel="VOLVER"
        variant="danger"
        onConfirm={confirmLogout}
        onCancel={() => setLogoutDialogOpen(false)}
      />
    </div>
  );
};
