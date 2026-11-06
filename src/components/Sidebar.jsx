import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, FileText, LogOut, MapPin, Users, Settings } from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
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
    <div className="w-64 bg-sawtak-gradient text-white flex flex-col h-screen fixed left-0 top-0 rtl:right-0 rtl:left-auto shadow-2xl z-20 border-r border-white/10 rtl:border-l rtl:border-r-0">
      
      {/* Logo */}
      <div className="p-8 flex flex-col items-center justify-center border-b border-white/10">
        <h1 className="font-logo text-3xl font-bold tracking-wide text-white">Sawtak</h1>
        <div className="w-10 h-1 bg-sawtak-gold rounded-full mt-2 mb-1"></div>
        <p className="text-xs text-white/70 uppercase tracking-widest font-semibold mt-1">Admin</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 btn-bounce ${
                isActive 
                  ? 'bg-white/20 text-white font-bold shadow-lg' 
                  : 'text-white/70 hover:bg-white/10 hover:text-white font-medium'
              }`
            }
          >
            <item.icon size={22} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* ✅ NOUVEAU : Info Utilisateur (Agent ou Super Admin) */}
      <div className="px-4 py-3 mx-4 mb-2 bg-black/20 rounded-2xl flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-sawtak-green flex items-center justify-center text-white font-bold text-lg">
          {user?.username?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-bold text-white truncate">{user?.username}</p>
          <p className="text-[10px] text-sawtak-gold font-bold uppercase tracking-wider truncate">
            {user?.is_superuser ? 'Super Admin' : `Agent ${user?.specialite || ''}`}
          </p>
        </div>
      </div>

      {/* Déconnexion */}
      <div className="p-4 border-t border-white/10 mb-2">
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-4 px-5 py-3.5 w-full rounded-2xl text-red-200 bg-red-500/20 hover:bg-red-500/40 transition-all font-medium btn-bounce"
        >
          <LogOut size={22} />
          <span>{t('logout')}</span>
        </button>
      </div>
    </div>
  );
}