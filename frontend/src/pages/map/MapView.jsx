import { useEffect, useRef } from 'react';

// Key from project config — also reads from VITE env if set
const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_KEY || '';

const STATUS_COLORS = {
  ongoing:   '#34C759',
  completed: '#007AFF',
  delayed:   '#FF3B30',
};

const SUPPLIER_COLORS = {
  cement: '#FF9500',
  steel:  '#007AFF', // Blue
  bricks: '#8B4513', // Brown
};

let mapsPromise = null;
function loadGoogleMaps(apiKey) {
  if (window.google?.maps) return Promise.resolve(window.google.maps);
  if (mapsPromise) return mapsPromise;

  mapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return mapsPromise;
}

export default function MapView({
  projects, suppliers, supplierFilter,
  selectedSite, selectedProject,
  onMapClick, onProjectClick,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({ site: null, projects: [], suppliers: [] });
  const infoWindowRef = useRef(null);

  // Initialise map
  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps(GOOGLE_MAPS_API_KEY).then((maps) => {
      if (cancelled || mapInstanceRef.current) return;
      const map = new maps.Map(mapRef.current, {
        center: { lat: 28.6139, lng: 77.2090 },
        zoom: 11,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: DARK_MAP_STYLE,
      });
      mapInstanceRef.current = map;
      infoWindowRef.current = new maps.InfoWindow();

      map.addListener('click', (e) => {
        onMapClick(e.latLng.lat(), e.latLng.lng());
      });

      // Plot projects
      projects.forEach((p) => {
        const marker = new maps.Marker({
          position: { lat: p.lat, lng: p.lng },
          map,
          title: p.name,
          icon: {
            path: maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: STATUS_COLORS[p.status],
            fillOpacity: 0.95,
            strokeColor: '#fff',
            strokeWeight: 2,
          },
        });
        marker.addListener('click', () => onProjectClick(p));
        markersRef.current.projects.push(marker);
      });
    }).catch(console.error);

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update supplier markers when filter changes
  useEffect(() => {
    const maps = window.google?.maps;
    const map = mapInstanceRef.current;
    if (!maps || !map) return;

    // Clear old supplier markers
    markersRef.current.suppliers.forEach(m => m.setMap(null));
    markersRef.current.suppliers = [];

    const filtered = supplierFilter === 'all' ? suppliers : suppliers.filter(s => s.type === supplierFilter);
    filtered.forEach((s) => {
      const marker = new maps.Marker({
        position: { lat: s.lat, lng: s.lng },
        map,
        title: s.name,
        icon: {
          path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z',
          fillColor: SUPPLIER_COLORS[s.type],
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 1.5,
          scale: 1.4,
          anchor: new maps.Point(12, 24),
        },
      });
      marker.addListener('click', () => {
        infoWindowRef.current.setContent(`
          <div style="font-family:sans-serif;padding:4px 6px;min-width:160px;">
            <b style="color:#1c1c1e;font-size:13px;">${s.name}</b>
            <div style="color:#555;font-size:11px;margin-top:4px;">${s.type.toUpperCase()} · ${s.price}</div>
            <div style="color:#888;font-size:11px;">⏱ Delivery: ${s.delivery}</div>
          </div>
        `);
        infoWindowRef.current.open(map, marker);
      });
      markersRef.current.suppliers.push(marker);
    });
  }, [suppliers, supplierFilter]);

  // Update selected site marker
  useEffect(() => {
    const maps = window.google?.maps;
    const map = mapInstanceRef.current;
    if (!maps || !map) return;
    if (markersRef.current.site) markersRef.current.site.setMap(null);
    if (!selectedSite) return;

    const marker = new maps.Marker({
      position: { lat: selectedSite.lat, lng: selectedSite.lng },
      map,
      icon: {
        path: maps.SymbolPath.CIRCLE,
        scale: 14,
        fillColor: '#007AFF',
        fillOpacity: 0.3,
        strokeColor: '#007AFF',
        strokeWeight: 3,
      },
      animation: maps.Animation.DROP,
    });
    markersRef.current.site = marker;
    map.panTo({ lat: selectedSite.lat, lng: selectedSite.lng });
  }, [selectedSite]);

  // Pan to selected project
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedProject) return;
    map.panTo({ lat: selectedProject.lat, lng: selectedProject.lng });
    map.setZoom(13);
  }, [selectedProject]);

  return (
    <div className="absolute inset-0">
      <div ref={mapRef} className="w-full h-full z-0" />
      {!GOOGLE_MAPS_API_KEY && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <div className="bg-[#1C1C1E] text-white p-6 rounded-2xl max-w-sm text-center shadow-2xl border border-white/10">
            <p className="text-2xl mb-2">🗺️</p>
            <p className="font-bold text-lg mb-1">Google Maps API Key Required</p>
            <p className="text-sm text-gray-400">Add <code className="text-blue-400">VITE_GOOGLE_MAPS_KEY=your_key</code> to <code className="text-blue-400">frontend/.env</code> and restart.</p>
          </div>
        </div>
      )}
    </div>
  );
}

// A premium dark style Map
const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
  { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#4b6878' }] },
  { featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{ color: '#a0aec0' }] },
  { featureType: 'landscape.man_made', elementType: 'geometry.stroke', stylers: [{ color: '#334e68' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#023e58' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#283d6a' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#6f9ba5' }] },
  { featureType: 'poi', elementType: 'labels.text.stroke', stylers: [{ color: '#1d2c4d' }] },
  { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#023e58' }] },
  { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#3C7680' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#304a7d' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#98a5be' }] },
  { featureType: 'road', elementType: 'labels.text.stroke', stylers: [{ color: '#1d2c4d' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2c6675' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#255763' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#b0d5ce' }] },
  { featureType: 'road.highway', elementType: 'labels.text.stroke', stylers: [{ color: '#023747' }] },
  { featureType: 'transit', elementType: 'labels.text.fill', stylers: [{ color: '#98a5be' }] },
  { featureType: 'transit', elementType: 'labels.text.stroke', stylers: [{ color: '#1d2c4d' }] },
  { featureType: 'transit.line', elementType: 'geometry.fill', stylers: [{ color: '#283d6a' }] },
  { featureType: 'transit.station', elementType: 'geometry', stylers: [{ color: '#3a4762' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#4e6d70' }] },
];
