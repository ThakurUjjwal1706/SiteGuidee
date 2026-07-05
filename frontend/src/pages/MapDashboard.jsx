import { useState, useCallback } from 'react';
import MapView from './map/MapView';
import InfoPanel from './map/InfoPanel';

const OW_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY || '';

// ── Mock dataset ──────────────────────────────────────────────
export const PROJECTS = [
  { id: 'p1', name: 'DLF Horizon Tower',       lat: 28.6139, lng: 77.2090, city: 'Delhi',      status: 'ongoing',   cost: '₹4.2 Cr', type: 'Residential' },
  { id: 'p2', name: 'Noida Expressway HQ',      lat: 28.5355, lng: 77.3910, city: 'Noida',      status: 'completed', cost: '₹7.8 Cr', type: 'Commercial' },
  { id: 'p3', name: 'Ghaziabad Metro Hub',      lat: 28.6692, lng: 77.4538, city: 'Ghaziabad',  status: 'delayed',   cost: '₹2.9 Cr', type: 'Infrastructure' },
  { id: 'p4', name: 'Gurugram Skyline Apts',    lat: 28.4595, lng: 77.0266, city: 'Gurugram',   status: 'ongoing',   cost: '₹11.5 Cr', type: 'Residential' },
  { id: 'p5', name: 'Faridabad Industrial Zone',lat: 28.4089, lng: 77.3178, city: 'Faridabad',  status: 'completed', cost: '₹5.1 Cr', type: 'Industrial' },
];

export const SUPPLIERS = [
  // Cement (₹320 - ₹450)
  { id: 's1', name: 'UltraTech Cement – Okhla',        lat: 28.5420, lng: 77.2800, type: 'cement', price: '₹380/bag', delivery: '1–2 days', rating: 4.5 },
  { id: 's2', name: 'ACC Smart Cement – Shahdara',      lat: 28.6700, lng: 77.2850, type: 'cement', price: '₹360/bag', delivery: '2–3 days', rating: 4.1 },
  { id: 's3', name: 'Ambuja Cements – Faridabad',    lat: 28.3800, lng: 77.3000, type: 'cement', price: '₹410/bag', delivery: '1 day',    rating: 4.7 },
  { id: 's10', name: 'Shree Cement – Gurugram Sec 5', lat: 28.4800, lng: 77.0100, type: 'cement', price: '₹370/bag', delivery: '1–2 days', rating: 4.3 },
  { id: 's11', name: 'JK Lakshmi – Noida Sec 16',     lat: 28.5800, lng: 77.3100, type: 'cement', price: '₹350/bag', delivery: '1–2 days', rating: 4.0 },

  // Steel (₹55 - ₹80)
  { id: 's4', name: 'TATA Steel Depot – Wazirpur',      lat: 28.7040, lng: 77.1600, type: 'steel',  price: '₹68/kg',  delivery: '2–4 days', rating: 4.8 },
  { id: 's5', name: 'JSW Steel – Mundka Hub',           lat: 28.6900, lng: 77.0500, type: 'steel',  price: '₹62/kg',  delivery: '3–5 days', rating: 3.9 },
  { id: 's6', name: 'Shyam Steel – Noida Sector 63',    lat: 28.6200, lng: 77.3800, type: 'steel',  price: '₹71/kg',  delivery: '1–2 days', rating: 4.3 },
  { id: 's12', name: 'Jindal Panther – Ghaziabad Ind.', lat: 28.6700, lng: 77.4200, type: 'steel',  price: '₹65/kg',  delivery: '1–3 days', rating: 4.6 },
  { id: 's13', name: 'Sail Steel Yard – Faridabad Sec 24', lat: 28.3900, lng: 77.2900, type: 'steel', price: '₹58/kg', delivery: '2–3 days', rating: 4.1 },

  // Bricks (₹6 - ₹12)
  { id: 's7', name: 'Sharma Brick Works – Modinagar',   lat: 28.8300, lng: 77.5700, type: 'bricks', price: '₹9/unit', delivery: '2–3 days', rating: 4.0 },
  { id: 's8', name: 'Rajput Bricks – Loni Ghaziabad',   lat: 28.7500, lng: 77.3900, type: 'bricks', price: '₹7/unit', delivery: '1–2 days', rating: 4.2 },
  { id: 's9', name: 'Aggarwal Clay Bricks – Meerut Rd', lat: 28.7800, lng: 77.4200, type: 'bricks', price: '₹11/unit', delivery: '4–5 days', rating: 3.7 },
  { id: 's14', name: 'Mittal Premium Bricks – Greater Noida', lat: 28.4700, lng: 77.4900, type: 'bricks', price: '₹12/unit', delivery: '1–2 days', rating: 4.9 },
  { id: 's15', name: 'Choudhary Bricks – Palwal Rd',    lat: 28.2000, lng: 77.3500, type: 'bricks', price: '₹6/unit', delivery: '1-2 days', rating: 4.3 },
];

// Haversine distance in km
export function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// India construction cost heuristic
export function estimateCost(lat, lng) {
  const zones = [
    { lat: 28.6139, lng: 77.2090, name: 'Delhi',    rate: 2400 },
    { lat: 28.4595, lng: 77.0266, name: 'Gurugram', rate: 2600 },
    { lat: 28.5355, lng: 77.3910, name: 'Noida',    rate: 2200 },
    { lat: 28.6692, lng: 77.4538, name: 'Ghaziabad',rate: 2000 },
    { lat: 28.4089, lng: 77.3178, name: 'Faridabad', rate: 1900 },
  ];
  let best = { rate: 1600, zone: 'Rural' };
  let minDist = Infinity;
  for (const z of zones) {
    const d = haversine(lat, lng, z.lat, z.lng);
    if (d < minDist) {
      minDist = d;
      best = {
        rate: d < 20 ? z.rate : d < 60 ? z.rate - 300 : 1600,
        zone: d < 20 ? z.name : d < 60 ? 'Tier-2' : 'Rural',
      };
    }
  }
  return best;
}

export function getRiskLevel(lat, lng) {
  const d = haversine(lat, lng, 28.6139, 77.2090);
  if (d < 20) return { level: 'Low',    color: '#34C759', reason: 'Well-connected metro zone with strong infrastructure' };
  if (d < 60) return { level: 'Medium', color: '#FF9500', reason: 'Moderate infrastructure — mid-tier logistics access' };
  return       { level: 'High',   color: '#FF3B30', reason: 'Remote location — supply chain & transport risk' };
}

// Reverse geocode using Google Geocoding REST API
async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
    );
    const data = await res.json();
    if (data.results?.length) {
      const comp = data.results[0].address_components;
      const locality = comp.find(c => c.types.includes('locality'))?.long_name;
      const sublocality = comp.find(c => c.types.includes('sublocality'))?.long_name;
      const area = comp.find(c => c.types.includes('administrative_area_level_2'))?.long_name;
      return locality || sublocality || area || 'Unknown Area';
    }
  } catch (_) {}
  return 'Selected Area';
}

// Fetch weather from OpenWeatherMap
async function fetchWeather(lat, lng) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${OW_KEY}&units=metric`
    );
    const d = await res.json();
    return {
      temp: Math.round(d.main?.temp ?? 0),
      desc: d.weather?.[0]?.description ?? '',
      icon: d.weather?.[0]?.icon ?? '',
      humidity: d.main?.humidity ?? 0,
      wind: Math.round(d.wind?.speed ?? 0),
      rain: d.weather?.[0]?.main === 'Rain',
    };
  } catch (_) {
    return null;
  }
}

export default function MapDashboard() {
  const [selectedSite, setSelectedSite]       = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [supplierFilter, setSupplierFilter]   = useState('all');
  const [panelTab, setPanelTab]               = useState('site');
  const [loading, setLoading]                 = useState(false);

  const handleMapClick = useCallback(async (lat, lng) => {
    setLoading(true);
    setSelectedProject(null);
    setPanelTab('site');

    const { rate, zone }   = estimateCost(lat, lng);
    const risk              = getRiskLevel(lat, lng);
    const [locationName, weather] = await Promise.all([
      reverseGeocode(lat, lng),
      fetchWeather(lat, lng),
    ]);

    setSelectedSite({ lat, lng, locationName, rate, zone, risk, area: 1000, weather });
    setLoading(false);
  }, []);

  const handleProjectClick = useCallback((project) => {
    setSelectedProject(project);
    setSelectedSite(null);
    setPanelTab('project');
  }, []);

  return (
    <div className="flex h-[calc(100vh-80px)] -m-8 overflow-hidden relative">

      {/* Full-screen map */}
      <div className="flex-1 relative">
        <MapView
          projects={PROJECTS}
          suppliers={SUPPLIERS}
          supplierFilter={supplierFilter}
          selectedSite={selectedSite}
          selectedProject={selectedProject}
          onMapClick={handleMapClick}
          onProjectClick={handleProjectClick}
        />

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <div className="bg-[#0B1221]/90 backdrop-blur-xl text-white px-6 py-4 rounded-2xl flex items-center gap-3 border border-white/10 shadow-2xl">
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-semibold">Analysing location…</span>
            </div>
          </div>
        )}

        {/* Floating filter pills */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-[#0B1221]/40 backdrop-blur-3xl rounded-[24px] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10">
          {['all', 'cement', 'steel', 'bricks'].map(f => (
            <button
              key={f}
              onClick={() => setSupplierFilter(f)}
              className={`px-6 py-2.5 rounded-[20px] text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-500 ${
                supplierFilter === f
                  ? 'bg-blue-600 text-white shadow-[0_10px_20px_rgba(59,130,246,0.3)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {f === 'all' ? '📦 All Sources' : f === 'cement' ? '🏭 Cement' : f === 'steel' ? '⚙️ Steel' : '🧱 Bricks'}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="absolute bottom-6 left-6 z-20 bg-[#0B1221]/80 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-xl border border-white/10 text-xs font-semibold space-y-1.5">
          <p className="text-gray-500 uppercase tracking-widest text-[9px] mb-2 font-black">Legend</p>
          <div className="flex items-center gap-2 text-gray-300"><span className="w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-400" /> Selected Site</div>
          <div className="flex items-center gap-2 text-gray-300"><span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-400" /> Projects</div>
          <div className="flex items-center gap-2 text-gray-300"><span className="w-3 h-3 rounded-full bg-orange-500 shadow-sm shadow-orange-400" /> Suppliers</div>
        </div>

        {/* Click instruction */}
        {!selectedSite && !selectedProject && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-[#0B1221]/80 backdrop-blur-xl text-gray-300 text-xs font-semibold px-5 py-2.5 rounded-full border border-white/10 shadow-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Click anywhere on the map to analyse a construction site
          </div>
        )}
      </div>

      {/* Side Info Panel */}
      <InfoPanel
        selectedSite={selectedSite}
        selectedProject={selectedProject}
        suppliers={SUPPLIERS}
        supplierFilter={supplierFilter}
        setSupplierFilter={setSupplierFilter}
        panelTab={panelTab}
        setPanelTab={setPanelTab}
        projects={PROJECTS}
        onProjectClick={handleProjectClick}
      />
    </div>
  );
}
