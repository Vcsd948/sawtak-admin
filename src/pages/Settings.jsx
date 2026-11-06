import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { User, Mail, Shield, LogOut, Server, Database, Key, Bell, Palette, Sun, Moon, Monitor, Languages, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleLogout = () => {
    if(window.confirm(t('disconnectConfirm'))) {
      logout();
      void navigate('/login');
    }
  };

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className={`space-y-8 max-w-6xl mx-auto animate-fade-in-up p-6 ${i18n.language === 'ar' ? 'rtl' : 'ltr'}`}>
      
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-logo">{t('settings')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Gérez votre compte, vos préférences et l'état de la plateforme.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* =========================================
            COLONNE GAUCHE : PROFIL (4/12)
            ========================================= */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
            
            {/* Bannière décorative */}
            <div className="h-24 bg-gradient-to-r from-sawtak-green to-sawtak-green-light relative">
               <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                 <div className="w-20 h-20 rounded-full border-4 border-white dark:border-slate-800 bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-2xl font-bold text-gray-600 dark:text-gray-300 shadow-md">
                   {user?.username?.charAt(0).toUpperCase()}
                 </div>
               </div>
            </div>

            <div className="pt-12 pb-6 px-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.username}</h2>
                <div className="mt-2 flex justify-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sawtak-green/10 text-sawtak-green">
                    {user?.is_superuser ? <><Shield size={14}/> {t('superAdmin')}</> : <><User size={14}/> {t('agent')}</>}
                  </span>
                </div>
              </div>

              <div className="space-y-3 bg-gray-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-600">
                <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <Mail size={16} className="text-gray-400" />
                  <span className="truncate">{user?.email || 'Aucun email configuré'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <Shield size={16} className="text-gray-400" />
                  <span>{t('access')} : <strong className="text-sawtak-green dark:text-sawtak-gold">{user?.is_superuser ? t('total') : t('restricted')}</strong></span>
                </div>
              </div>

              <button 
                onClick={handleLogout} 
                className="w-full mt-6 flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold py-3 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors border border-red-100 dark:border-red-900/30"
              >
                <LogOut size={18} /> {t('logout')}
              </button>
            </div>
          </div>
        </div>

        {/* =========================================
            COLONNE DROITE : PRÉFÉRENCES & SYSTÈME (8/12)
            ========================================= */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* --- CARTE PRÉFÉRENCES --- */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-slate-700 pb-3">
              <Palette size={20} className="text-sawtak-green" /> {t('prefs')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Langue & Thème (Alignés) */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Languages size={16} className="text-gray-400"/> {t('language')}
                  </label>
                  <select 
                    value={i18n.language} 
                    onChange={changeLanguage}
                    className="w-full bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-sawtak-green cursor-pointer"
                  >
                    <option value="fr">{t('french')}</option>
                    <option value="en">{t('english')}</option>
                    <option value="ar">{t('arabic')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    {theme === 'dark' ? <Moon size={16} className="text-gray-400" /> : theme === 'light' ? <Sun size={16} className="text-gray-400" /> : <Monitor size={16} className="text-gray-400" />}
                    {t('theme')}
                  </label>
                  <select 
                    value={theme} 
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-sawtak-green cursor-pointer"
                  >
                    <option value="light">☀️ {t('light')}</option>
                    <option value="dark">🌙 {t('dark')}</option>
                    <option value="system">💻 {t('system')}</option>
                  </select>
                </div>
              </div>

              {/* Notifications & Sécurité (Alignés) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-2xl border border-gray-100 dark:border-slate-600">
                  <div className="flex items-center gap-3">
                    <Bell size={20} className="text-sawtak-green" />
                    <div>
                      <p className="font-bold text-sm text-gray-800 dark:text-white">{t('notifications')}</p>
                      <p className="text-[11px] text-gray-500">{t('receiveAlerts')}</p>
                    </div>
                  </div>
                  <button className="w-11 h-6 bg-sawtak-green rounded-full relative cursor-pointer shadow-inner flex-shrink-0">
                    <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full shadow-sm"></div>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-2xl border border-gray-100 dark:border-slate-600">
                  <div className="flex items-center gap-3">
                    <Key size={20} className="text-sawtak-green" />
                    <div>
                      <p className="font-bold text-sm text-gray-800 dark:text-white">{t('security')}</p>
                      <p className="text-[11px] text-gray-500">{t('changePassword')}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowPasswordModal(true)}
                    className="px-4 py-2 bg-sawtak-green text-white text-xs font-bold rounded-lg hover:bg-sawtak-green/90 transition-colors flex-shrink-0"
                  >
                    {t('modify')}
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* --- CARTE ÉTAT DU SYSTÈME --- */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-slate-700 pb-3">
              <Server size={20} className="text-sawtak-green" /> {t('systemStatus')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status DB */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-2xl border border-gray-100 dark:border-slate-600">
                <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Database size={22} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 dark:text-white text-sm">{t('db')}</p>
                  <p className="text-[11px] text-gray-500 font-medium">PostgreSQL</p>
                </div>
                <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> {t('online')}
                </span>
              </div>

              {/* Status API */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-2xl border border-gray-100 dark:border-slate-600">
                <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <Server size={22} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 dark:text-white text-sm">{t('api')}</p>
                  <p className="text-[11px] text-gray-500 font-medium">Django REST</p>
                </div>
                <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> {t('connected')}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* --- MODALE DE MOT DE PASSE --- */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up border border-gray-100 dark:border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Key className="text-sawtak-green" /> {t('changePassword')}
              </h2>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Mot de passe actuel</label>
                <input type="password" placeholder="••••••••" className="w-full p-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-sawtak-green" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Nouveau mot de passe</label>
                <input type="password" placeholder="••••••••" className="w-full p-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-sawtak-green" />
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowPasswordModal(false)} className="flex-1 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">Annuler</button>
                <button onClick={() => { alert("Fonctionnalité en cours de développement"); setShowPasswordModal(false); }} className="flex-1 py-3 bg-sawtak-green text-white font-bold rounded-xl hover:bg-sawtak-green/90 transition-colors">Enregistrer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}