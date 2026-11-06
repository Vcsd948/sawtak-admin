import './i18n'; // ✅ CORRECTION : Plus d'espace avant le point
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/LoginPage'; // ✅ Import mis à jour
import Dashboard from './pages/Dashboard';
import Claims from './pages/Claims';
import ClaimDetail from './pages/ClaimDetail';
import MapView from './pages/MapView';
import Agents from './pages/Agents';
import Settings from './pages/Settings';

// ✅ Composant pour protéger les routes
const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sawtak-gray dark:bg-[#0B1310]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-sawtak-green"></div>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/login" replace />;
  
  return <Outlet />;
};

// ✅ La redirection intelligente depuis la racine "/"
const RootRedirect = () => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  
  // Si l'utilisateur est connecté, on l'envoie sur le dashboard
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Page de connexion */}
            <Route path="/login" element={<LoginPage />} />

            {/* Redirection si on tape juste l'URL de base */}
            <Route path="/" element={<RootRedirect />} />

            {/* Toutes les routes protégées : Seuls les agents connectés y ont accès */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/claims" element={<Claims />} />
                <Route path="/claims/:id" element={<ClaimDetail />} />
                <Route path="/map" element={<MapView />} />
                <Route path="/agents" element={<Agents />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Si l'utilisateur tape une URL qui n'existe pas, on le renvoie à l'accueil */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;