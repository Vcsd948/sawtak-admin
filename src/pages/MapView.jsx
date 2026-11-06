import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { getClaims } from '../api/claims';
import { Loader2, Flame, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet.heat';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function HeatmapLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!map || points.length === 0) return;

    const heatLayer = L.heatLayer(points, {
      radius: 35,
      blur: 25,
      maxZoom: 17,
      gradient: { 0.2: '#006B3F', 0.4: '#F4D06F', 0.6: '#ED6C02', 0.8: '#D32F2F', 1.0: '#8B0000' }
    });

    heatLayer.addTo(map);
    return () => { map.removeLayer(heatLayer); };
  }, [map, points]);

  return null;
}

export default function MapView() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const data = await getClaims();
        const geoClaims = data.filter(c => c.latitude && c.longitude);
        setClaims(geoClaims);
      } catch (error) {
        console.error("Erreur carte:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClaims();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-96"><Loader2 className="animate-spin text-sawtak-green" size={48} /></div>;

  const heatPoints = claims.map(claim => {
    let intensity = 0.3;
    if (claim.priority === 'Haute') intensity = 0.6;
    if (claim.priority === 'Urgente') intensity = 1.0;
    return [claim.latitude, claim.longitude, intensity];
  });

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white font-logo">Carte des incidents</h1>
          <p className="text-gray-500 mt-1">
            {showHeatmap ? "Visualisez les zones de concentration." : "Visualisez chaque réclamation."}
          </p>
        </div>
        <button onClick={() => setShowHeatmap(!showHeatmap)} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-semibold hover:bg-gray-50 shadow-sm">
          {showHeatmap ? <MapPin size={18} /> : <Flame size={18} />}
          {showHeatmap ? 'Voir les punaises' : 'Voir la heatmap'}
        </button>
      </div>

      <div className="flex-1 bg-white p-2 rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative z-0">
        <MapContainer center={[18.0858, -15.9785]} zoom={12} style={{ height: '100%', width: '100%', borderRadius: '1rem' }}>
          <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {showHeatmap && <HeatmapLayer points={heatPoints} />}
          {!showHeatmap && claims.map((claim) => (
            <Marker key={claim.id} position={[claim.latitude, claim.longitude]}>
              <Popup>
                <div className="p-1 min-w-[200px]">
                  <p className="font-bold text-sawtak-green">{claim.reference}</p>
                  <p className="font-semibold text-gray-800">{claim.title}</p>
                  <p className="text-xs text-gray-500 mb-2">{claim.address}</p>
                  <Link to={`/claims/${claim.id}`} className="text-xs font-bold text-sawtak-green hover:underline">Voir détails →</Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}