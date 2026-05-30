import { Component, ElementRef, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../../../environments/environment';
import { MapsTabs } from './maps-tabs/maps-tabs';
import { MapsButtons } from './maps-buttons/maps-buttons';

@Component({
  selector: 'app-test',
  imports: [MapsTabs, MapsButtons],
  templateUrl: './maps.component.html',
  styleUrl: './maps.component.scss',
  standalone: true
})
export class MapsComponent implements OnInit, OnDestroy {
  private map = signal<mapboxgl.Map | null>(null);
  private mapContainer = viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');

  mapInstance: mapboxgl.Map | null = null;

  ngOnInit(): void {
    (mapboxgl as any).accessToken = environment.MAPBOX_TOKEN_PUBLIC;

    const map = new mapboxgl.Map({
      container: this.mapContainer().nativeElement,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [9.0, 42.0],
      zoom: 9,
      pitch: 0,
      bearing: 0,
    });

    this.map.set(map);
    this.mapInstance = map;

    map.on('load', () => {
      console.log('Map chargée');

      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14
      });
      map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.8 });

      // Calque neige
      map.addSource('sentinel-snow', {
        type: 'raster',
        tiles: [this.buildSnowWmsUrl()],
        tileSize: 512,
        bounds: [8.53, 41.33, 9.57, 43.03],
        attribution: '© Copernicus/ESA Sentinel-2'
      });

      map.addLayer({
        id: 'sentinel-snow-layer',
        type: 'raster',
        source: 'sentinel-snow',
        paint: { 'raster-opacity': 0.85 }
      });

      // GPX
      fetch('/assets/gpx/etape1_Calenzana_Au_refuge_Ortu.gpx')
        .then(r => r.text())
        .then(gpxText => {
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
              .setPopup(new mapboxgl.Popup().setText('Départ GR20'))
              .addTo(map);
            new mapboxgl.Marker({ color: '#ff0000' })
              .setLngLat(coords[coords.length - 1] as [number, number])
              .setPopup(new mapboxgl.Popup().setText('Arrivée Étape 1'))
              .addTo(map);

            const bounds = coords.reduce(
              (b, c) => b.extend(c as [number, number]),
              new mapboxgl.LngLatBounds(coords[0] as [number, number], coords[0] as [number, number])
            );
            map.fitBounds(bounds, { padding: 50, duration: 1000 });
          }
        })
        .catch(err => console.error('Erreur GPX:', err));
    });
  }

  ngOnDestroy(): void {
    this.map()?.remove();
  }

  private buildSnowWmsUrl(): string {
    return (
      `https://sh.dataspace.copernicus.eu/ogc/wms/${environment.copernicusInstanceId}` +
      `?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap` +
      `&LAYERS=${environment.snowLayerId}` +
      `&STYLES=&FORMAT=image/png&TRANSPARENT=true` +
      `&CRS=EPSG:3857&WIDTH=512&HEIGHT=512` +
      `&TIME=2026-05-01/2026-05-28` +
      `&MAXCC=40` +
      `&BBOX={bbox-epsg-3857}`
    );
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
