import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, FileText, LogOut, MapPin, Users, Settings } from 'lucide-react';

export default function Sidebar() {
  const { logout } = useAuth();
  const { t } = useTranslation(); // ✅
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm(t('logout') + " ?")) {
      logout();
      void navigate('/login');
    }
  };

  const navItems = [
    { name: t('dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { name: t('claims'), path: '/claims', icon: FileText },
    { name: t('map'), path: '/map', icon: MapPin },
    { name: t('agents'), path: '/agents', icon: Users },
    { name: t('settings'), path: '/settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-sawtak-dark text-white flex flex-col h-screen fixed left-0 top-0 rtl:right-0 rtl:left-auto border-r border-slate-700">
      <div className="p-6 flex items-center gap-3 border-b border-white/10">
        <div className="w-10 h-10 bg-sawtak-green rounded-xl flex items-center justify-center font-bold text-xl text-white">S</div>
        <div>
          <h1 className="font-bold text-lg leading-tight">Sawtak</h1>
          <p className="text-xs text-gray-400">Admin</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive ? 'bg-sawtak-green text-white shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-all">
          <LogOut size={20} />
          <span className="font-medium">{t('logout')}</span>
        </button>
      </div>
    </div>
  );
}