import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(identifier, password);
    
    if (result.success) {
      void navigate('/dashboard');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-sawtak-gray dark:bg-[#0B1310]">
      
      {/* Dégradé vert en haut */}
      <div className="absolute top-0 left-0 right-0 h-[40vh] bg-sawtak-gradient rounded-b-[40px] shadow-lg z-0">
        <div className="absolute -top-16 -right-10 w-48 h-48 bg-white opacity-5 rounded-full"></div>
        <div className="absolute -bottom-12 -left-8 w-36 h-36 bg-white opacity-5 rounded-full"></div>
      </div>

      {/* Contenu centré */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 mt-12">
        <div className="w-full max-w-md mx-auto">
          
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h1 className="font-logo text-5xl font-bold text-white tracking-wide drop-shadow-lg">
              Sawtak
            </h1>
            <div className="w-11 h-[2px] bg-sawtak-gold mx-auto mt-3 mb-3 rounded-full"></div>
            <p className="text-white/90 text-xl font-medium font-sans">صوتك</p>
          </motion.div>

          {/* Carte blanche */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-[26px] shadow-2xl shadow-sawtak-green/20 p-6 sm:p-8 border border-white/50 dark:border-slate-700"
          >
            
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Espace Administration
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Connectez-vous pour continuer
              </p>
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 p-3 rounded-xl mb-6 text-sm font-medium text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Champ Email / Téléphone */}
              <div>
                <label htmlFor="identifier" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Email, Téléphone ou Nom d'utilisateur
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
                  <input
                    id="identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-sawtak-green focus:border-transparent outline-none transition-all"
                    placeholder="ex: agent@snde.mr"
                    required
                  />
                </div>
              </div>

              {/* Champ Mot de passe */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-sawtak-green focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Lien mot de passe oublié */}
              <div className="flex justify-end">
                <a href="#" className="text-sm font-semibold text-sawtak-green hover:text-sawtak-green-light transition-colors">
                  Mot de passe oublié ?
                </a>
              </div>

              {/* Bouton Se Connecter */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-sawtak-gradient text-white font-bold text-base rounded-xl transition-all shadow-lg shadow-sawtak-green/30 flex justify-center items-center mt-2 btn-bounce"
              >
                {loading ? <Loader2 className="animate-spin" size={22} /> : 'Se connecter'}
              </button>
            </form>

            {/* ✅ Message d'information pour les agents */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl flex gap-3 items-start text-blue-700 dark:text-blue-300 text-xs text-center justify-center">
                <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                <p>
                  Les comptes Agents sont créés par le Super Administrateur. 
                  Si vous n'avez pas d'accès, veuillez contacter l'administration.
                </p>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}