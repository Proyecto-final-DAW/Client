import {
  ChartBarIcon,
  ClipboardDocumentListIcon,
  HeartIcon,
  HomeIcon,
  TrophyIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/hooks/useAuth';
import { DashboardBackground } from '../shared/components/DashboardBackground';
import { PixelCorners } from '../shared/components/PixelCorners';

type MenuItem = {
  to: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export const DashboardLayout = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isLoggedIn = Boolean(user);

  const clickAuth = () => {
    if (isLoggedIn) {
      logout();
      navigate('/');
      return;
    }

    navigate('/login');
  };

  const menuItems: MenuItem[] = [
    { to: '/dashboard', label: 'INICIO', icon: HomeIcon },
    { to: '/routines', label: 'RUTINAS', icon: ClipboardDocumentListIcon },
    { to: '/progress', label: 'PROGRESO', icon: ChartBarIcon },
    { to: '/diet', label: 'DIETA', icon: HeartIcon },
    { to: '/achievements', label: 'LOGROS', icon: TrophyIcon },
    { to: '/profile', label: 'PERFIL', icon: UserCircleIcon },
  ];

  const userName = user?.name ?? 'Usuario';

  return (
    <div className="relative min-h-screen flex flex-col text-[#e4e4e7]">
      <DashboardBackground />
      <header className="relative z-20 border-b-2 border-[#1e1e2e] bg-[#0a0a0f] h-32 flex items-center justify-between px-8 sm:px-14">
        <Link to="/dashboard" className="flex items-center gap-3">
          <img
            src="/images/Logo.webp"
            alt="GymQuest"
            className="h-32 w-auto drop-shadow-lg object-contain"
          />
        </Link>
        <button
          onClick={clickAuth}
          className="font-['Press_Start_2P'] text-[9px] sm:text-[10px] bg-green-500 hover:bg-green-400 text-[#0a0a0f] px-4 sm:px-6 py-2.5 sm:py-3 border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:mt-1 transition-all duration-150 shadow-[0_0_14px_rgba(34,197,94,0.35)]"
        >
          {isLoggedIn ? '▶ LOGOUT' : '▶ LOGIN'}
        </button>
      </header>

      <div className="relative z-10 flex flex-1">
        <aside className="w-64 shrink-0 border-r-2 border-[#1e1e2e] bg-[#0a0a0f] p-4 flex flex-col gap-4">
          {isLoggedIn && (
            <div className="relative border-2 border-green-500/50 bg-[#0d0d14] p-3 flex items-center gap-3">
              <PixelCorners size="sm" className="border-green-500/50" />
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
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

          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 border-2 px-3 py-5 font-['Press_Start_2P'] text-[10px] tracking-widest transition-colors ${
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
          </nav>
        </aside>

        <main className="relative flex-1 p-6 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
