import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Shield, Search, Loader2, Mail, Crown, UserX, ShieldAlert, CheckCircle, Info } from 'lucide-react';

export default function Agents() {
  const { user } = useAuth();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialite, setFilterSpecialite] = useState('Toutes');
  
  const [emailToPromote, setEmailToPromote] = useState('');
  const [specialite, setSpecialite] = useState('Général');
  const [promoting, setPromoting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // ✅ LISTE COMPLÈTE DES SPÉCIALITÉS
  const SPECIALITES = [
    'Général', 
    'SOMELEC', 
    'SNDE', 
    'Assainissement',
    'Mairie', 
    'Police',
    'Santé',
    'Éducation',
    'Transport',
    'Mauritel',
    'Chinguitel',
    'Mattel',
    'Urbanisme',
    'Environnement'
  ];

  const getSpecialiteColor = (spec) => {
    switch(spec) {
      case 'SOMELEC': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'SNDE': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Police': return 'bg-red-100 text-red-700 border-red-200';
      case 'Mairie': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Santé': return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'Éducation': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Transport': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Assainissement': return 'bg-green-100 text-green-700 border-green-200';
      case 'Mauritel': return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      case 'Chinguitel': return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'Mattel': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await api.get('/auth/agents/');
      const sorted = res.data.sort((a, b) => {
        if (a.is_superuser && !b.is_superuser) return -1;
        if (!a.is_superuser && b.is_superuser) return 1;
        return a.username.localeCompare(b.username);
      });
      setAgents(sorted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handlePromote = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!emailToPromote) {
      setErrorMsg("Veuillez entrer un email.");
      return;
    }
    
    setPromoting(true);
    try {
      const response = await api.post('/auth/promote-agent/', {
        identifier: emailToPromote,
        specialite: specialite
      });
      setSuccessMsg(response.data.message || 'Citoyen promu avec succès !');
      setEmailToPromote('');
      fetchAgents();
    } catch (error) {
      setErrorMsg(error.response?.data?.error || "Erreur : Citoyen introuvable.");
    } finally {
      setPromoting(false);
    }
  };

  const handleRevoke = async (agentId, username) => {
    if (window.confirm(`Voulez-vous vraiment révoquer les droits de ${username} ?`)) {
      try {
        await api.post('/auth/revoke-agent/', { user_id: agentId });
        fetchAgents();
      } catch (error) {
        alert(error.response?.data?.error || "Erreur lors de la révocation.");
      }
    }
  };

  const filteredAgents = agents.filter(agent => {
    const matchName = agent.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSpecialite = filterSpecialite === 'Toutes' || agent.specialite === filterSpecialite;
    return matchName && matchSpecialite;
  });

  return (
    <div className="space-y-6 max-w-6xl animate-fade-in-up p-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
          <Shield className="text-sawtak-green" size={32} /> Gestion de l'Équipe
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Gérez les accès, les rôles et les spécialités de vos agents.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {user?.is_superuser && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 h-fit">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <UserPlus size={20} className="text-sawtak-green" /> Ajouter un Agent
            </h2>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl mb-6 flex gap-2 items-start text-blue-700 dark:text-blue-300 text-xs">
              <Info size={16} className="shrink-0 mt-0.5" />
              <p>Le citoyen doit d'abord s'inscrire sur l'application mobile (Flutter). Entrez ensuite son email ici pour le promouvoir.</p>
            </div>

            <form onSubmit={handlePromote} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Email du citoyen</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <input 
                    type="email" 
                    value={emailToPromote}
                    onChange={(e) => setEmailToPromote(e.target.value)}
                    placeholder="exemple@email.com"
                    className="w-full pl-10 p-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-sawtak-green outline-none transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Spécialité / Service</label>
                <select 
                  value={specialite}
                  onChange={(e) => setSpecialite(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-sawtak-green outline-none transition-all"
                >
                  {SPECIALITES.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              {errorMsg && <p className="text-red-500 text-sm font-medium">{errorMsg}</p>}
              {successMsg && <p className="text-green-600 text-sm font-medium flex items-center gap-1"><CheckCircle size={14}/> {successMsg}</p>}

              <button 
                type="submit" 
                disabled={promoting}
                className="w-full py-3.5 bg-sawtak-green text-white font-bold rounded-xl hover:bg-sawtak-green/90 transition-all shadow-md shadow-sawtak-green/20 flex justify-center items-center"
              >
                {promoting ? <Loader2 className="animate-spin" size={20} /> : 'Promouvoir en Agent'}
              </button>
            </form>
          </div>
        )}

        <div className={`bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 ${user?.is_superuser ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              Équipe <span className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 py-0.5 px-2.5 rounded-full text-sm">{filteredAgents.length}</span>
            </h2>
            
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Rechercher un agent..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-sawtak-green w-full md:w-64"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center p-12"><Loader2 className="animate-spin text-sawtak-green" size={32} /></div>
          ) : filteredAgents.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-slate-700/30 rounded-2xl border border-dashed border-gray-200 dark:border-slate-600">
              <ShieldAlert className="mx-auto text-gray-400 mb-3" size={32} />
              <p className="text-gray-500 font-medium">Aucun agent dans cette équipe.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAgents.map((agent) => (
                <div key={agent.id} className="group flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-600 hover:border-sawtak-green/30 hover:shadow-md transition-all">
                  
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl text-white shadow-sm ${agent.is_superuser ? 'bg-gradient-to-br from-sawtak-gold to-yellow-600' : 'bg-gradient-to-br from-sawtak-green to-emerald-600'}`}>
                      {agent.is_superuser ? <Crown size={24} className="text-white" /> : agent.username.charAt(0).toUpperCase()}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-gray-900 dark:text-white text-lg">{agent.username}</p>
                        {agent.is_superuser && (
                          <span className="flex items-center gap-1 px-2.5 py-0.5 bg-sawtak-gold/20 text-yellow-700 dark:text-yellow-500 text-[10px] font-extrabold rounded-md uppercase tracking-wider">
                            Super Admin
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                        <span className="flex items-center gap-1"><Mail size={12} /> {agent.email || 'Pas d\'email'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1.5 border text-xs font-bold rounded-lg hidden md:block ${getSpecialiteColor(agent.specialite)}`}>
                      {agent.specialite || 'Général'}
                    </span>
                    
                    {!agent.is_superuser && user?.is_superuser && (
                      <button 
                        onClick={() => handleRevoke(agent.id, agent.username)}
                        title="Révoquer les droits d'agent"
                        className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      >
                        <UserX size={20} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}