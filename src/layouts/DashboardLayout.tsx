import {
  Bars3Icon,
  BookOpenIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  HeartIcon,
  HomeIcon,
  TrophyIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { useAuth } from '../context/hooks/useAuth';
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
const HEADER_H = 'h-16 lg:h-24';
const HEADER_OFFSET = 'top-16 lg:top-24';
const HEADER_HEIGHT_PX = 'h-[calc(100vh-4rem)] lg:h-[calc(100vh-6rem)]';

const MENU_GROUPS: MenuGroup[] = [
  {
    label: 'NAVEGACION',
    items: [
      { to: '/dashboard', label: 'INICIO', icon: HomeIcon },
      { to: '/templates', label: 'RUTINAS', icon: BookOpenIcon },
      { to: '/routines', label: 'SESIONES', icon: ClipboardDocumentListIcon },
      { to: '/progress', label: 'PROGRESO', icon: ChartBarIcon },
    ],
  },
  {
    label: 'PERSONAJE',
    items: [
      { to: '/diet', label: 'DIETA', icon: HeartIcon },
      { to: '/achievements', label: 'LOGROS', icon: TrophyIcon },
      { to: '/profile', label: 'PERFIL', icon: UserCircleIcon },
    ],
  },
];

type SidebarContentProps = {
  isLoggedIn: boolean;
  user: ReturnType<typeof useAuth>['user'];
  onNavigate?: () => void;
};

const SidebarContent = ({
  isLoggedIn,
  user,
  onNavigate,
}: SidebarContentProps): React.JSX.Element => {
  const userName = user?.name ?? 'Usuario';

  return (
    <div className="flex flex-col gap-6">
      {isLoggedIn && (
        <div className="relative border-2 border-green-500/50 bg-[#0d0d14] p-3 flex items-center gap-3">
          <PixelCorners size="sm" className="border-green-500/50" />
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={`Foto de perfil de ${userName}`}
              className="h-12 w-12 rounded-sm border-2 border-[#1e1e2e] object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-sm border-2 border-[#1e1e2e] bg-green-500/10">
              <UserCircleIcon className="h-7 w-7 text-green-400" />
            </div>
          )}

          <div className="min-w-0">
            <p className="font-['Press_Start_2P'] text-[8px] text-[#a1a1aa] tracking-widest mb-1">
              HEROE
            </p>
            <p className="font-['Press_Start_2P'] text-[10px] text-green-400 truncate [text-shadow:0_0_12px_rgba(34,197,94,0.6)]">
              {userName.toUpperCase()}
            </p>
          </div>
        </div>
      )}

      <nav className="flex flex-col gap-6">
        {MENU_GROUPS.map((group) => (
          <div key={group.label} className="flex flex-col gap-2">
            <p className="px-1 font-['Press_Start_2P'] text-[8px] tracking-widest text-[#52525b]">
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
                    `flex items-center gap-3 border-2 px-3 py-3 font-['Press_Start_2P'] text-[10px] tracking-widest transition-colors ${
                      isActive
                        ? 'border-green-500 bg-green-500/10 text-green-400 shadow-[0_0_14px_rgba(34,197,94,0.3)]'
                        : 'border-[#1e1e2e] text-[#a1a1aa] hover:border-green-500/50 hover:text-green-400'
                    }`
                  }
                >
                  <Icon className="h-5 w-5 shrink-0" />
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
  const isLoggedIn = Boolean(user);
  const prefersReducedMotion = useReducedMotion();

  const [drawerOpen, setDrawerOpen] = useState(false);

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
      logout();
      navigate('/');
      return;
    }

    navigate('/login');
  };

  return (
    <div className="relative min-h-screen flex flex-col text-[#e4e4e7]">
      <DashboardBackground />
      <header
        className={`sticky top-0 z-30 ${HEADER_H} flex items-center justify-between gap-2 border-b-2 border-[#1e1e2e] bg-[#0a0a0f]/95 backdrop-blur-md px-3 sm:px-6 lg:px-14`}
      >
        <div className="flex items-center gap-2">
          {/* Hamburger only on screens narrower than the lg sidebar break. */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={drawerOpen}
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center border-2 border-[#1e1e2e] bg-[#0d0d14] text-[#a1a1aa] hover:border-green-500/50 hover:text-green-400 transition-colors"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
          <Link to="/dashboard" className="flex items-center gap-3">
            <img
              src="/images/Logo.webp"
              alt="GymQuest"
              className="h-16 w-auto -my-2 lg:h-28 lg:-my-6 drop-shadow-lg object-contain"
            />
          </Link>
        </div>
        <button
          onClick={clickAuth}
          className="font-['Press_Start_2P'] text-[8px] sm:text-[9px] lg:text-[10px] bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(34,197,94,0.35)] whitespace-nowrap"
        >
          {isLoggedIn ? '▶ LOGOUT' : '▶ LOGIN'}
        </button>
      </header>

      <div className="relative z-10 flex flex-1">
        {/* Desktop: fixed sidebar. */}
        <aside
          className={`hidden lg:flex sticky ${HEADER_OFFSET} ${HEADER_HEIGHT_PX} w-56 shrink-0 self-start overflow-y-auto border-r-2 border-[#1e1e2e] bg-[#0a0a0f] p-4 flex-col gap-6`}
        >
          <SidebarContent isLoggedIn={isLoggedIn} user={user} />
        </aside>

        {/* Mobile/tablet: slide-in drawer. */}
        <AnimatePresence>
          {drawerOpen && (
            <>
              <motion.div
                key="drawer-backdrop"
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setDrawerOpen(false)}
                className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
                aria-hidden="true"
              />
              <motion.aside
                key="drawer-panel"
                initial={prefersReducedMotion ? false : { x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] overflow-y-auto border-r-2 border-[#1e1e2e] bg-[#0a0a0f] p-4 shadow-[0_0_60px_rgba(0,0,0,0.8)]"
                role="dialog"
                aria-modal="true"
                aria-label="Menu de navegacion"
              >
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-['Press_Start_2P'] text-[10px] tracking-widest text-green-500">
                    ◆ MENU
                  </p>
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    aria-label="Cerrar menu"
                    className="inline-flex h-9 w-9 items-center justify-center border-2 border-[#1e1e2e] bg-[#0d0d14] text-[#a1a1aa] hover:border-green-500/50 hover:text-green-400 transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
                <SidebarContent
                  isLoggedIn={isLoggedIn}
                  user={user}
                  onNavigate={() => setDrawerOpen(false)}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <main className="relative flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
