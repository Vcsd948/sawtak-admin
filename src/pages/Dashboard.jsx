import { useEffect, useState } from 'react';
import { FileText, CheckCircle, Clock, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { getClaims } from '../api/claims';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchClaims = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    
    try {
      const data = await getClaims();
      setClaims(data);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void fetchClaims();
  }, []);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-sawtak-green" size={40} /></div>;

  const total = claims.length;
  const enAttente = claims.filter(c => c.status === 'en_attente').length;
  const resolues = claims.filter(c => c.status === 'résolue').length;
  const urgentes = claims.filter(c => c.priority === 'Urgente').length;

  const stats = [
    { id: 'total', title: 'Total Réclamations', value: total, icon: FileText, color: 'text-sawtak-green', bg: 'bg-sawtak-green/10' },
    { id: 'attente', title: 'En attente', value: enAttente, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
    { id: 'resolues', title: 'Résolues', value: resolues, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
    { id: 'urgentes', title: 'Urgentes', value: urgentes, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' },
  ];

  const pieData = [
    { name: 'En attente', value: enAttente, color: '#F59E0B' },
    { name: 'Résolues', value: resolues, color: '#006B3F' },
    { name: 'Autres', value: total - enAttente - resolues, color: '#6B7280' },
  ].filter(d => d.value > 0);

  const categoryCounts = claims.reduce((acc, claim) => {
    const cat = claim.category_label || 'Autre';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  
  const barData = Object.keys(categoryCounts).map(key => ({
    name: key,
    count: categoryCounts[key]
  })).sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-logo">
            Vue d'ensemble
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Bonjour <strong className="text-sawtak-green dark:text-sawtak-gold">{user?.username}</strong>
            {user?.is_superuser ? " (Super Admin)" : user?.is_staff ? ` (Agent ${user?.specialite || ''})` : " (Citoyen)"}.
          </p>
        </div>
        <button 
          onClick={() => void fetchClaims(true)} 
          disabled={refreshing}
          className="flex items-center gap-2 glass-card text-gray-700 dark:text-gray-200 px-4 py-2 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm btn-bounce"
        >
          <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? 'Actualisation...' : 'Actualiser'}
        </button>
      </div>

      {/* Cartes Statistiques Glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div 
            key={stat.id} 
            className="glass-card p-6 rounded-3xl shadow-sm flex items-center gap-4 hover:shadow-md transition-all border border-white/20"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}><stat.icon size={28} /></div>
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{stat.title}</p>
              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-3xl shadow-sm border border-white/20">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Répartition par Statut</h2>
          <div className="h-72">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
               <p className="text-center text-gray-400 mt-20">Pas assez de données</p>
            )}
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl shadow-sm border border-white/20">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Top Secteurs</h2>
          <div className="h-72">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#006B3F" radius={[0, 8, 8, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
               <p className="text-center text-gray-400 mt-20">Pas assez de données</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}