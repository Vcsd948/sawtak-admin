import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function AdminLayout() {
  const { user, loading } = useAuth();
  const { i18n } = useTranslation();

  // ✅ S'assurer que le RTL est bien appliqué au chargement
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sawtak-gray dark:bg-sawtak-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-sawtak-green"></div>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-sawtak-gray dark:bg-[#0B1310] flex transition-colors duration-300">
      <Sidebar />
      
      {/* Gestion de la marge pour le contenu principal (RTL et LTR) */}
      <div className="flex-1 ml-64 rtl:ml-0 rtl:mr-64 flex flex-col min-h-screen">
        <Topbar />
        <main className="p-8 flex-1">
          <div className="animate-fade-in-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}