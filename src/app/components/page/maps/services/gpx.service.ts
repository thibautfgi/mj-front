import { Injectable } from '@angular/core';
import mapboxgl from 'mapbox-gl';

@Injectable({ providedIn: 'root' })
export class GpxService {

  loadGpx(map: mapboxgl.Map, gpxText: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const geojson = this.gpxToGeoJSON(gpxText);

        map.addSource('gr20-test', { type: 'geojson', data: geojson as any });
        map.addLayer({
          id: 'gr20-line',
          type: 'line',
          source: 'gr20-test',
          paint: { 'line-color': '#ff0000', 'line-width': 4, 'line-opacity': 1 }
        });

        map.addLayer({
          id: 'sky',
          type: 'sky',
          paint: {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 90.0],
            'sky-atmosphere-sun-intensity': 15
          }
        });

        const coords = geojson.features[0]?.geometry.coordinates || [];
        if (coords.length > 0) {
          new mapboxgl.Marker({ color: '#00ff00' })
            .setLngLat(coords[0] as [number, number])
            .setPopup(new mapboxgl.Popup().setText('Départ'))
            .addTo(map);
          new mapboxgl.Marker({ color: '#ff0000' })
            .setLngLat(coords[coords.length - 1] as [number, number])
            .setPopup(new mapboxgl.Popup().setText('Arrivée'))
            .addTo(map);

          const bounds = coords.reduce(
            (b, c) => b.extend(c as [number, number]),
            new mapboxgl.LngLatBounds(coords[0] as [number, number], coords[0] as [number, number])
          );
          map.fitBounds(bounds, { padding: 50, duration: 1000 });
        }

        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  private gpxToGeoJSON(gpx: string) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(gpx, 'text/xml');
    const coordinates: number[][] = [];
    xml.querySelectorAll('trkpt').forEach(pt => {
      const lat = parseFloat(pt.getAttribute('lat') || '');
      const lon = parseFloat(pt.getAttribute('lon') || '');
      if (!isNaN(lat) && !isNaN(lon)) coordinates.push([lon, lat]);
    });
    return {
      type: 'FeatureCollection',
      features: [{ type: 'Feature', geometry: { type: 'LineString', coordinates } }]
    };
  }
}
