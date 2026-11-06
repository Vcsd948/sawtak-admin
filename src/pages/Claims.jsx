import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClaims } from '../api/claims';
import { useAuth } from '../context/AuthContext';
import { Download, Filter, Eye, Loader2, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

export default function Claims() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ✅ On met 'to_resolve' par défaut si c'est un agent
  const [activeTab, setActiveTab] = useState(user?.is_superuser ? 'all' : 'to_resolve'); 
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchClaimsData = async () => {
    setLoading(true);
    try {
      const data = await getClaims();
      setClaims(data);
    } catch (error) {
      console.error("Erreur de chargement", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchClaimsData();
  }, []);

  const handleRowClick = (claimId) => {
    navigate(`/claims/${claimId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'résolue': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'en_cours': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'rejetée': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'affectée': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300';
    }
  };

  // ✅ SÉCURITÉ ABSOLUE CÔTÉ FRONTEND
  const filteredClaims = claims.filter(claim => {
    // Si c'est un agent normal (pas super admin)
    if (user?.is_staff && !user?.is_superuser) {
      // Il ne peut voir QUE ce qui lui est assigné OU ce qu'il a lui-même créé
      const isMine = claim.citizen?.id === user?.id;
      const isAssignedToMe = claim.assigned_to?.id === user?.id;
      
      if (!isMine && !isAssignedToMe) return false;
    }

    // Filtre par onglet
    if (activeTab === 'my_claims') {
      if (claim.citizen?.id !== user?.id) return false;
    } else if (activeTab === 'to_resolve') {
      if (claim.assigned_to?.id !== user?.id) return false;
      if (claim.status === 'résolue' || claim.status === 'rejetée') return false;
    } else if (activeTab === 'unassigned') {
      if (claim.assigned_to) return false;
    }

    // Filtre par statut
    if (statusFilter !== 'all' && claim.status !== statusFilter) return false;
    
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-20">
        <Loader2 className="animate-spin text-sawtak-green" size={40} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {/* En-tête */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
            Gestion des réclamations
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Consultez et traitez vos dossiers.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-slate-800 dark:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-700 transition-colors shadow-sm">
          <Download size={18} /> Exporter ({filteredClaims.length})
        </button>
      </div>

      {/* Onglets */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {/* L'onglet "Toutes" n'apparaît QUE pour le Super Admin */}
        {user?.is_superuser && (
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'all' ? 'bg-sawtak-green text-white shadow-md shadow-sawtak-green/20' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
          >
            Toutes les réclamations
          </button>
        )}
        
        {/* Onglets Agents */}
        {(user?.is_staff || user?.is_superuser) && (
          <>
            <button 
              onClick={() => setActiveTab('to_resolve')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'to_resolve' ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
            >
              <AlertCircle size={16} /> Mes dossiers assignés
            </button>
            
            {user?.is_superuser && (
              <button 
                onClick={() => setActiveTab('unassigned')}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'unassigned' ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
              >
                En attente d'assignation
              </button>
            )}
          </>
        )}

        <button 
          onClick={() => setActiveTab('my_claims')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'my_claims' ? 'bg-sawtak-gold text-white shadow-md shadow-sawtak-gold/20' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
        >
          <FileText size={16} /> Mes signalements (Citoyen)
        </button>
      </div>

      {/* Filtre par statut */}
      <div className="flex items-center gap-3 mb-6 bg-white dark:bg-slate-800 p-2 rounded-xl border border-gray-200 dark:border-slate-700 w-fit">
        <Filter size={16} className="text-gray-400 ml-2" />
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-transparent text-sm font-semibold text-gray-700 dark:text-gray-200 outline-none cursor-pointer pr-4"
        >
          <option value="all">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="affectée">Affectée</option>
          <option value="en_cours">En cours</option>
          <option value="résolue">Résolue</option>
          <option value="rejetée">Rejetée</option>
        </select>
      </div>

      {/* Tableau */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 dark:border-slate-700 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold bg-gray-50/50 dark:bg-slate-800/50">
              <th className="p-5">Référence</th>
              <th className="p-5">Titre</th>
              <th className="p-5">Assigné à</th>
              <th className="p-5">Priorité</th>
              <th className="p-5">Statut</th>
              <th className="p-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClaims.map((claim) => (
              <tr 
                key={claim.id} 
                onClick={() => handleRowClick(claim.id)}
                className="border-b border-gray-50 dark:border-slate-700/50 hover:bg-gray-50/80 dark:hover:bg-slate-700/50 cursor-pointer transition-colors group"
              >
                <td className="p-5 font-mono text-sm font-bold text-gray-700 dark:text-gray-300">
                  {claim.reference}
                </td>
                <td className="p-5 text-sm text-gray-700 dark:text-gray-300 font-medium max-w-xs truncate">
                  {claim.title}
                </td>
                <td className="p-5 text-sm text-gray-500 dark:text-gray-400">
                  {claim.assigned_to ? (
                    <span className="flex items-center gap-1 font-semibold text-sawtak-green dark:text-green-400">
                      <CheckCircle2 size={14} /> {claim.assigned_to.username}
                    </span>
                  ) : (
                    <span className="text-gray-400 italic">Non assigné</span>
                  )}
                </td>
                <td className="p-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    claim.priority === 'Urgente' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 animate-pulse' : 
                    claim.priority === 'Haute' ? 'bg-orange-100 text-orange-700' : 
                    'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-300'
                  }`}>
                    {claim.priority}
                  </span>
                </td>
                <td className="p-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(claim.status)}`}>
                    {claim.status}
                  </span>
                </td>
                <td className="p-5 text-center">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowClick(claim.id);
                    }}
                    className="p-2 text-gray-400 hover:text-sawtak-green hover:bg-sawtak-green/10 rounded-full transition-colors"
                    title="Voir les détails"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredClaims.length === 0 && (
              <tr>
                <td colSpan="6" className="p-10 text-center text-gray-400 flex flex-col items-center justify-center">
                  <Filter size={32} className="mb-3 text-gray-300" />
                  <p className="text-lg font-medium">Aucune réclamation trouvée</p>
                  <p className="text-sm">Vous n'avez aucun dossier dans cet onglet.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}