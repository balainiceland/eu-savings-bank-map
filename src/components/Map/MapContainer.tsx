import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { useStore } from '../../hooks/useStore';
import { getScoreColor, getScoreTierLabel, formatAssets, formatCustomers } from '../../types';
import type { Bank } from '../../types';

declare module 'leaflet' {
  export function markerClusterGroup(options?: unknown): MarkerClusterGroup;
  export interface MarkerClusterGroup extends L.FeatureGroup {
    addLayer(layer: L.Layer): this;
    clearLayers(): this;
  }
  export interface MarkerCluster {
    getChildCount(): number;
  }
}

// Fix default marker icons
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const createMarkerIcon = (score: number, featured: boolean = false) => {
  const color = getScoreColor(score);
  const size = featured ? 16 : 12;

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        position: relative;
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: 2px solid #000;
        border-radius: 50%;
        box-shadow: 4px 4px 0 #000;
        ${featured ? 'animation: pulse 2s infinite;' : ''}
      "></div>
    `,
    iconSize: [size + 10, size + 10],
    iconAnchor: [(size + 4) / 2, (size + 4) / 2],
  });
};

export default function MapContainer() {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.MarkerClusterGroup | null>(null);

  const filteredBanks = useStore(state => state.filteredBanks);
  const setSelectedBank = useStore(state => state.setSelectedBank);
  const isLoading = useStore(state => state.isLoading);
  const error = useStore(state => state.error);
  const dataSource = useStore(state => state.dataSource);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    const map = L.map(mapRef.current, {
      center: [50, 10],
      zoom: 4,
      minZoom: 3,
      maxZoom: 18,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const markers = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: (cluster: L.MarkerCluster) => {
        const childCount = cluster.getChildCount();
        let size = 'small';
        if (childCount > 50) size = 'large';
        else if (childCount > 10) size = 'medium';

        return L.divIcon({
          html: `<div>${childCount}</div>`,
          className: `marker-cluster marker-cluster-${size}`,
          iconSize: L.point(40, 40),
        });
      },
    });

    map.addLayer(markers);
    leafletMapRef.current = map;
    markersRef.current = markers;

    return () => {
      map.remove();
      leafletMapRef.current = null;
      markersRef.current = null;
    };
  }, []);

  // Update markers
  useEffect(() => {
    if (!markersRef.current) return;
    markersRef.current.clearLayers();

    filteredBanks
      .filter((b: Bank) => b.latitude != null && b.longitude != null)
      .forEach((bank: Bank) => {
        const marker = L.marker([bank.latitude, bank.longitude], {
          icon: createMarkerIcon(bank.digitalScore, bank.featured),
        });

        const popupContent = `
          <div style="width: 260px; padding: 16px; font-family: 'Space Grotesk', system-ui, sans-serif; box-sizing: border-box;">
            <h3 style="margin: 0 0 4px 0; font-size: 14px; color: #000; font-weight: 800; word-wrap: break-word; line-height: 1.3;">${bank.name}</h3>
            <p style="margin: 0 0 12px 0; font-size: 12px; color: #666;">
              ${bank.city ? bank.city + ', ' : ''}${bank.country}
            </p>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
              <div style="
                width: 40px; height: 40px; min-width: 40px; border-radius: 50%;
                background-color: ${getScoreColor(bank.digitalScore)};
                border: 2px solid #000;
                display: flex; align-items: center; justify-content: center;
                color: #000; font-weight: 800; font-size: 12px;
              ">${bank.digitalScore}</div>
              <div>
                <div style="font-size: 11px; font-weight: 800; color: #000;">${getScoreTierLabel(bank.digitalScore)}</div>
                <div style="font-size: 10px; color: #999;">Digital Score</div>
              </div>
            </div>
            <div style="display: flex; gap: 12px; font-size: 11px; color: #666; margin-bottom: 12px;">
              <div><strong>AUM:</strong> ${formatAssets(bank.totalAssets)}</div>
              <div><strong>Customers:</strong> ${formatCustomers(bank.customerCount)}</div>
            </div>
            <button
              onclick="window.dispatchEvent(new CustomEvent('selectBank', { detail: '${bank.id}' }))"
              style="
                width: 100%; padding: 8px;
                background-color: #21e9c5; color: #000;
                border: 2px solid #000; border-radius: 24px;
                cursor: pointer; font-size: 12px; font-weight: 800;
                box-shadow: 4px 4px 0 #000;
              "
            >View Details</button>
          </div>
        `;

        marker.bindPopup(popupContent, { maxWidth: 300, minWidth: 260 });
        markersRef.current?.addLayer(marker);
      });
  }, [filteredBanks]);

  // Listen for bank selection from popup
  useEffect(() => {
    const handleSelectBank = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      const bank = filteredBanks.find(b => b.id === customEvent.detail);
      if (bank) setSelectedBank(bank);
    };

    window.addEventListener('selectBank', handleSelectBank);
    return () => window.removeEventListener('selectBank', handleSelectBank);
  }, [filteredBanks, setSelectedBank]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />

      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-[1000]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-esb-royal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-black font-bold">Loading banks...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-esb-red text-black border-2 border-black px-4 py-2 rounded-indo shadow-indo z-[1000] font-bold">
          {error}
        </div>
      )}

      {!isLoading && (
        <div className="absolute bottom-4 right-4 bg-white text-xs px-3 py-1.5 rounded-full border-2 border-black shadow-indo z-[1000] font-bold">
          {dataSource === 'supabase' ? (
            <span className="text-esb-green">● Live + Demo data</span>
          ) : (
            <span className="text-esb-royal">● Demo data</span>
          )}
        </div>
      )}
    </div>
  );
}
