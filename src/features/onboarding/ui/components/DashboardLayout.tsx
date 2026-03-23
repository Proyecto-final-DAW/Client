import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

export const DashboardLayout = (): React.JSX.Element => {
  const navigate = useNavigate();
  useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem('token')));
  }, [location.pathname]);

  const clickAuth = () => {
    if (isLoggedIn) {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      navigate('/Login');
      return;
    }

    navigate('/Login');
  };

  const menuItems = [
    { to: '/', label: 'Inicio' },
    { to: '/onboarding', label: 'Prueba' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full h-16 bg-slate-900 shadow-sm flex items-center px-6">
        <h1 className="text-lg font-semibold text-white text-slate-800">
          Gimnasio
        </h1>
        <button
          onClick={clickAuth}
          className="ml-auto rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-400 transition"
        >
          {isLoggedIn ? 'Logout' : 'Login'}
        </button>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 bg-slate-900 text-white p-4">
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to == '/dashboard'}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-3 transition ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-200 hover:bg-slate-800'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-6 bg-slate-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
