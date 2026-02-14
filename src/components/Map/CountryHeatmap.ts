import L from 'leaflet';
import type { Bank } from '../../types';
import { getScoreColor } from '../../types';
import type { CountryFeatureCollection, CountryFeatureProperties } from '../../data/europeGeoJSON';

export function createHeatmapLayer(
  map: L.Map,
  geojson: CountryFeatureCollection,
  banks: Bank[],
  pane: string
): L.GeoJSON {
  // Build country → avg score map
  const countryScores = new Map<string, { total: number; count: number }>();
  banks.forEach(b => {
    const entry = countryScores.get(b.countryCode) || { total: 0, count: 0 };
    entry.total += b.digitalScore;
    entry.count += 1;
    countryScores.set(b.countryCode, entry);
  });

  const layer = L.geoJSON(geojson, {
    pane,
    style: (feature) => {
      const props = feature?.properties as CountryFeatureProperties;
      const entry = countryScores.get(props.ISO_A2);
      if (entry) {
        const avg = Math.round(entry.total / entry.count);
        return {
          fillColor: getScoreColor(avg),
          fillOpacity: 0.45,
          weight: 2,
          color: '#000',
          opacity: 0.6,
        };
      }
      return {
        fillColor: '#999',
        fillOpacity: 0.1,
        weight: 1,
        color: '#666',
        opacity: 0.3,
      };
    },
    onEachFeature: (feature, featureLayer) => {
      const props = feature.properties as CountryFeatureProperties;
      const entry = countryScores.get(props.ISO_A2);
      if (entry) {
        const avg = Math.round(entry.total / entry.count);
        featureLayer.bindTooltip(
          `<strong>${props.NAME}</strong><br/>Avg Score: ${avg}<br/>Banks: ${entry.count}`,
          { sticky: true, className: 'heatmap-tooltip' }
        );
      } else {
        featureLayer.bindTooltip(
          `<strong>${props.NAME}</strong><br/>No bank data`,
          { sticky: true, className: 'heatmap-tooltip' }
        );
      }
    },
  });

  layer.addTo(map);
  return layer;
}
