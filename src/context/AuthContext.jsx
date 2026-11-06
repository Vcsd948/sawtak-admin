import { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.clear();
    setUser(null);
  }, []);

  // ✅ Sécurité : Déconnexion automatique après 30 min d'inactivité
  useEffect(() => {
    let timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      if (user) {
        timeout = setTimeout(() => {
          logout();
          window.alert("Session expirée pour inactivité. Veuillez vous reconnecter.");
        }, 30 * 60 * 1000);
      }
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);
    resetTimer();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, [user, logout]);

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login/', { identifier: username, password });
      const { access, user } = response.data;
      
      if (!user.is_staff) {
        return { success: false, message: "Accès refusé. Vous n'êtes pas administrateur." };
      }

      localStorage.setItem('access_token', access);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || "Erreur de connexion" };
    }
  };

  const value = useMemo(() => ({
    user,
    login,
    logout,
    loading
  }), [user, loading, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);