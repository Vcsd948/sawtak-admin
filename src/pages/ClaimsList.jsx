import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClaims } from '../api/claims';
import { Download, Filter, MoreVertical, Search, Loader2, Eye } from 'lucide-react';

export default function ClaimsList() {
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const data = await getClaims();
        setClaims(data);
      } catch (error) {
        console.error("Erreur de chargement", error);
      } finally {
        setLoading(false);
      }
    };
    void fetchClaims();
  }, []);

  // ✅ Fonction pour naviguer vers les détails
  const handleRowClick = (claimId) => {
    navigate(`/claims/${claimId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'résolue': return 'bg-green-100 text-green-700';
      case 'en_cours': return 'bg-orange-100 text-orange-700';
      case 'rejetée': return 'bg-red-100 text-red-700';
      case 'affectée': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-sawtak-green" size={40} /></div>;

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in-up">
      
      {/* En-tête de la page */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Toutes les réclamations</h1>
          <p className="text-gray-500">Gérez et suivez l'état des demandes citoyennes.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-700 transition-colors shadow-sm">
          <Download size={18} /> Exporter ({claims.length})
        </button>
      </div>

      {/* Barre de filtres */}
      <div className="flex gap-4 mb-6">
        <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50">
          <Filter size={16} className="text-gray-400" /> Toutes
        </button>
        <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50">
          <Filter size={16} className="text-gray-400" /> Tous statuts
        </button>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
              <th className="p-5">Référence</th>
              <th className="p-5">Titre</th>
              <th className="p-5">Assigné à</th>
              <th className="p-5">Statut</th>
              <th className="p-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim) => (
              <tr 
                key={claim.id} 
                onClick={() => handleRowClick(claim.id)} // ✅ Clic sur toute la ligne
                className="border-b border-gray-50 hover:bg-gray-50/80 cursor-pointer transition-colors group"
              >
                <td className="p-5 font-mono text-sm font-bold text-gray-700">
                  {claim.reference}
                </td>
                <td className="p-5 text-sm text-gray-700 font-medium max-w-xs truncate">
                  {claim.title}
                </td>
                <td className="p-5 text-sm text-gray-500">
                  {claim.assigned_to?.full_name || 'Non assigné'}
                </td>
                <td className="p-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(claim.status)}`}>
                    {claim.status}
                  </span>
                </td>
                <td className="p-5 text-center">
                  {/* ✅ Bouton d'action (les 3 petits points ou l'œil) */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Évite le conflit avec le clic de la ligne
                      handleRowClick(claim.id);
                    }}
                    className="p-2 text-gray-400 hover:text-sawtak-green hover:bg-sawtak-green/10 rounded-full transition-colors"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {claims.length === 0 && (
              <tr>
                <td colSpan="5" className="p-10 text-center text-gray-400">
                  Aucune réclamation trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}