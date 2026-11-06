import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getClaimDetails, getClaimAttachments, updateClaimStatus, assignClaim, resolveClaim } from '../api/claims';
import { ArrowLeft, MapPin, Calendar, Clock, FileText, ShieldCheck, Loader2, CheckCircle, X, Image as ImageIcon, CheckSquare, AlertCircle, Landmark } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { getAuthorities } from '../utils/constants';

// ✅ Correction d'un bug connu de Leaflet avec React (icônes disparues)
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function ClaimDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [claim, setClaim] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [allAgents, setAllAgents] = useState([]);
  const [availableAgents, setAvailableAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAttachments, setLoadingAttachments] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [assigning, setAssigning] = useState(false);

  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolveComment, setResolveComment] = useState('');
  const [resolveFiles, setResolveFiles] = useState([]);

  // ✅ LOGIQUE DE CORRESPONDANCE SPÉCIALITÉ / CATÉGORIE
  const getAgentSpecialtiesForCategory = (category) => {
    switch (category) {
      case 'electricite': return ['SOMELEC', 'Général'];
      case 'eau': return ['SNDE', 'Général'];
      case 'assainissement': return ['SNDE', 'Assainissement', 'Général'];
      case 'securite': return ['Police', 'Général'];
      case 'urbanisme': case 'etat_civil': return ['Mairie', 'Urbanisme', 'Général'];
      case 'sante': return ['Santé', 'Général'];
      case 'education': return ['Éducation', 'Général'];
      case 'transport': return ['Transport', 'Général'];
      case 'telecom': return ['Mauritel', 'Chinguitel', 'Mattel', 'Général'];
      default: return ['Général'];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const claimData = await getClaimDetails(id);
        setClaim(claimData);
        
        if (user?.is_superuser) {
          const agentsData = await api.get('/auth/agents/');
          const agents = agentsData.data;
          setAllAgents(agents);

          const allowedSpecialties = getAgentSpecialtiesForCategory(claimData.category);
          
          const filtered = agents.filter(agent => {
            if (agent.is_superuser) return false;
            return allowedSpecialties.includes(agent.specialite || 'Général');
          });

          setAvailableAgents(filtered);
        }

        setLoadingAttachments(true);
        const attachmentsData = await getClaimAttachments(id).catch(() => []);
        setAttachments(attachmentsData || []);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
        setLoadingAttachments(false);
      }
    };
    void fetchData();
  }, [id, user]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === claim.status) return;
    setUpdating(true);
    try {
      const updatedClaim = await updateClaimStatus(id, newStatus);
      setClaim(updatedClaim);
    } catch (error) {
      alert(error.response?.data?.error || 'Erreur lors du changement de statut.');
    } finally {
      setUpdating(false);
    }
  };

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    if (resolveFiles.length === 0) return alert("Veuillez sélectionner au moins une photo de preuve.");
    
    setUpdating(true);
    try {
      const updatedClaim = await resolveClaim(id, resolveComment, resolveFiles);
      setClaim(updatedClaim);
      setShowResolveModal(false);
      setResolveComment('');
      setResolveFiles([]);
      alert("✅ Réclamation résolue avec succès !");
    } catch (error) {
      alert(error.response?.data?.error || "Erreur lors de la résolution.");
    } finally {
      setUpdating(false);
    }
  };

  const handleAssign = async (e) => {
    const agentId = e.target.value ? parseInt(e.target.value, 10) : null;
    
    if (agentId === (claim.assigned_to?.id || null)) return;

    setAssigning(true);
    try {
      const updatedClaim = await assignClaim(id, agentId);
      setClaim(updatedClaim);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Erreur lors de l'assignation");
    } finally {
      setAssigning(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-sawtak-green" size={40} /></div>;
  if (!claim) return <div className="p-8 text-center text-xl text-gray-500">Réclamation introuvable.</div>;

  const isSuperAdmin = user?.is_superuser;
  const isAssignedAgent = claim.assigned_to?.id === user?.id; 
  const isResolved = claim.status === 'résolue' || claim.status === 'rejetée';
  
  const canResolve = !isResolved && (isSuperAdmin || isAssignedAgent);
  const canAssign = isSuperAdmin; 
  const canChangeStatus = isSuperAdmin;

  return (
    <div className="space-y-6 animate-fade-in-up p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/claims')} className="p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 transition-colors">
          <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            {claim.reference}
            <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase border ${isResolved ? 'bg-green-100 text-green-700 border-green-200' : 'bg-orange-100 text-orange-700 border-orange-200'}`}>
              {claim.status}
            </span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">{claim.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <FileText size={20} className="text-sawtak-green" /> Description du citoyen
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{claim.description}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Landmark size={20} className="text-sawtak-green" /> Autorités compétentes
            </h2>
            <div className="flex flex-wrap gap-2">
              {getAuthorities(claim.category).map((authority, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1.5 bg-sawtak-green/10 text-sawtak-green dark:bg-sawtak-green/20 dark:text-green-400 text-sm font-semibold rounded-lg border border-sawtak-green/20"
                >
                  {authority}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 italic">
              * Ces institutions peuvent être contactées pour appuyer le traitement de ce dossier.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <ImageIcon size={20} className="text-sawtak-green" /> Photos jointes
            </h2>
            {loadingAttachments ? (
              <Loader2 className="animate-spin text-gray-400" size={24} />
            ) : attachments.length === 0 ? (
              <p className="text-gray-400 dark:text-gray-500 italic text-sm">Aucune photo jointe.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {attachments.map((att) => (
                  <a key={att.id} href={att.file_url} target="_blank" rel="noreferrer" className="block rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-slate-600 group relative">
                    <img src={att.file_url} alt="Preuve citoyen" className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-300" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {claim.resolution_comment && (
            <div className="p-6 rounded-3xl shadow-sm border-2 border-green-500/30 bg-green-50 dark:bg-green-900/10 dark:border-green-900/30">
              <h2 className="text-lg font-bold text-green-700 dark:text-green-500 mb-4 flex items-center gap-2">
                <CheckCircle size={20} /> Preuve de résolution
              </h2>
              
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-4 whitespace-pre-wrap">{claim.resolution_comment}</p>
              
              {claim.resolution_proofs && claim.resolution_proofs.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {claim.resolution_proofs.map((proof) => (
                    <a key={proof.id} href={proof.image_url} target="_blank" rel="noreferrer" className="block rounded-xl overflow-hidden shadow-md border border-green-200 dark:border-green-800">
                      <img src={proof.image_url} alt="Preuve" className="w-full h-24 object-cover hover:scale-105 transition-transform" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <ShieldCheck size={20} className="text-sawtak-green" /> Historique
            </h2>
            <div className="relative border-l-2 border-sawtak-green/30 ml-3 space-y-8 pb-2">
              {claim.history?.map((step) => (
                <div key={step.id} className="relative pl-6">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white dark:bg-slate-800 border-2 border-sawtak-green flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-sawtak-green"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800 dark:text-gray-200 capitalize">
                      Statut : {step.new_status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                      <Clock size={12} /> {new Date(step.created_at).toLocaleString('fr-FR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          
          <button
            onClick={() => setShowResolveModal(true)}
            disabled={!canResolve}
            className={`w-full py-4 font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all ${
              isResolved 
                ? 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                : canResolve 
                  ? 'bg-green-600 hover:bg-green-700 text-white hover:scale-[1.02]' 
                  : 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            <CheckSquare size={20} />
            {isResolved ? 'Déjà traitée' : canResolve ? 'Résoudre la réclamation' : 'Non assignée à vous'}
          </button>

          {canChangeStatus && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 border-l-4 border-l-sawtak-green">
              <h2 className="text-lg font-bold text-sawtak-green mb-4">Changer le statut</h2>
              <select
                value={claim.status}
                onChange={handleStatusChange}
                disabled={updating || isResolved}
                className="w-full p-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl font-semibold disabled:opacity-50 text-gray-800 dark:text-gray-200"
              >
                <option value="en_attente">En attente</option>
                <option value="reçue">Reçue</option>
                <option value="affectée">Affectée</option>
                <option value="en_cours">En cours</option>
                <option value="résolue">Résolue</option>
                <option value="rejetée">Rejetée</option>
              </select>
            </div>
          )}

          {canAssign && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <ShieldCheck size={18} className="text-sawtak-green"/> Agent Assigné
              </h2>
              
              {isResolved ? (
                <div className="p-3 bg-gray-100 dark:bg-slate-700 rounded-xl text-center text-gray-500 dark:text-gray-400 font-medium text-sm">
                  {claim.assigned_to 
                    ? `Assigné à ${claim.assigned_to.full_name || claim.assigned_to.username}`
                    : "Dossier clôturé (non assigné)"}
                </div>
              ) : (
                <>
                  <select
                    value={claim.assigned_to?.id || ""} 
                    onChange={handleAssign}
                    disabled={assigning}
                    className="w-full p-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl font-semibold disabled:opacity-50 text-gray-800 dark:text-gray-200"
                  >
                    <option value="">-- Non assigné --</option>
                    {availableAgents.length > 0 ? (
                      availableAgents.map(agent => (
                        <option key={agent.id} value={agent.id}>
                          {agent.username} ({agent.specialite})
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>Aucun agent disponible pour cette catégorie</option>
                    )}
                  </select>
                  {availableAgents.length === 0 && (
                    <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                      <AlertCircle size={12} /> Aucun agent avec la spécialité requise n'a été trouvé.
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Détails</h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <Calendar size={18} className="text-sawtak-green" />
                <div>
                  <p className="font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase">Créé le</p>
                  <p className="font-medium">{new Date(claim.created_at).toLocaleString('fr-FR')}</p>
                </div>
              </div>
              
              {claim.latitude && claim.longitude && (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                    <MapPin size={18} className="text-sawtak-green mt-0.5" />
                    <div>
                      <p className="font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase">
                        Position GPS {claim.location_source === 'manuelle' && '(Manuelle)'}
                      </p>
                      {claim.location_accuracy && (
                        <p className="text-xs text-gray-400">Précision : ±{Math.round(claim.location_accuracy)}m</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="h-48 w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-600 shadow-sm z-0">
                    <MapContainer 
                      center={[claim.latitude, claim.longitude]} 
                      zoom={16} 
                      scrollWheelZoom={false}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      />
                      <Marker position={[claim.latitude, claim.longitude]}>
                        <Popup>{claim.address || "Position du problème"}</Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showResolveModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up border border-gray-100 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Résoudre la réclamation</h2>
              <button onClick={() => setShowResolveModal(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleResolveSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Commentaire de résolution *</label>
                <textarea
                  value={resolveComment}
                  onChange={(e) => setResolveComment(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl outline-none text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-green-500"
                  rows="3"
                  placeholder="Ex: Les déchets ont été évacués..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Photos de preuve (Obligatoire) *</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setResolveFiles(Array.from(e.target.files))}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 dark:file:bg-green-900/30 dark:file:text-green-400"
                  required
                />
              </div>

              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setShowResolveModal(false)} className="flex-1 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                  Annuler
                </button>
                <button type="submit" disabled={updating || resolveFiles.length === 0} className="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 flex justify-center items-center transition-colors">
                  {updating ? <Loader2 className="animate-spin" size={20} /> : 'Confirmer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}