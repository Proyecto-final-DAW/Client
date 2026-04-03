import {
  ChartBarIcon,
  ClipboardDocumentListIcon,
  HeartIcon,
  HomeIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/hooks/useAuth';

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
    { to: '/dashboard', label: 'Inicio', icon: HomeIcon },
    { to: '/rutinas', label: 'Rutinas', icon: ClipboardDocumentListIcon },
    { to: '/progreso', label: 'Progreso', icon: ChartBarIcon },
    { to: '/dieta', label: 'Dieta', icon: HeartIcon },
    { to: '/perfil', label: 'Perfil', icon: UserCircleIcon },
  ];

  const userName = user?.name ?? 'Usuario';

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full h-16 bg-zinc-950 shadow-sm flex items-center px-6">
        <h1 className="text-lg font-semibold text-zinc-100">Gimnasio</h1>
        <button
          onClick={clickAuth}
          className="ml-auto rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-emerald-400 transition"
        >
          {isLoggedIn ? 'Logout' : 'Login'}
        </button>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 bg-zinc-950 text-zinc-100 p-4 flex flex-col">
          {isLoggedIn && (
            <div className="mb-6 flex items-center gap-3 rounded-xl bg-zinc-900 p-3">
              {user?.profileImage ? (
                <img
                  src="{user.profileImage}"
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900">
                  <UserCircleIcon className="h-8 w-8 text-zinc-400" />
                </div>
              )}

              <div className="min-w-0">
                <p className="text-xs text-zinc-100">Bienvenido</p>
                <p className="truncate text-sm font-semibold text-zinc-100">
                  {userName}
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
                  end={item.to == '/'}
                  className={({ isActive }) =>
                    ` flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                      isActive
                        ? 'bg-emerald-500 text-zinc-950'
                        : 'text-zinc-100 hover:bg-zinc-800'
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
        <main className="flex-1 p-6 bg-zinc-800">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
