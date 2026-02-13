import {Component, ElementRef, OnDestroy, OnInit, signal, viewChild} from '@angular/core';
import mapboxgl from 'mapbox-gl';
import {environment} from '../../../../../environment';

@Component({
  selector: 'app-test',
  imports: [],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
  standalone: true
})
export class TestComponent implements OnInit, OnDestroy {
  private map = signal<mapboxgl.Map | null>(null);
  private mapContainer = viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');

  ngOnInit(): void {
    (mapboxgl as any).accessToken = environment.MAPBOX_TOKEN_PUBLIC

    const mapInstance = new mapboxgl.Map({
      container: this.mapContainer().nativeElement,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [9.0, 42.0],
      zoom: 9,
      pitch: 0,
      bearing: 0,
    });

    this.map.set(mapInstance);

    mapInstance.on('load', () => {
      console.log('Map chargée - Ajout du GPX de test...');

      // Source d'élévation (DEM)
      mapInstance.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14
      });

      // Activer le terrain 3D
      mapInstance.setTerrain({
        source: 'mapbox-dem',
        exaggeration: 1.8
      });

      // Chargement du GPX
      fetch('/assets/gpx/etape1_Calenzana_Au_refuge_Ortu.gpx')
        .then((response) => response.text())
        .then((gpxText) => {
          const geojson = this.gpxToGeoJSON(gpxText);

          mapInstance.addSource('gr20-test', {
            type: 'geojson',
            data: geojson as any,
          });

          mapInstance.addLayer({
            id: 'gr20-line',
            type: 'line',
            source: 'gr20-test',
            paint: {
              'line-color': '#ff0000',
              'line-width': 4,
              'line-opacity': 1,
            },
          });

          // Ciel réaliste
          mapInstance.addLayer({
            id: 'sky',
            type: 'sky',
            paint: {
              'sky-type': 'atmosphere',
              'sky-atmosphere-sun': [0.0, 90.0],
              'sky-atmosphere-sun-intensity': 15
            }
          });

          // Marqueurs départ / arrivée
          const coords = geojson.features[0]?.geometry.coordinates || [];
          if (coords.length > 0) {
            new mapboxgl.Marker({color: '#00ff00'})
              .setLngLat(coords[0] as [number, number])
              .setPopup(new mapboxgl.Popup().setText('Départ GR20'))
              .addTo(mapInstance);

            new mapboxgl.Marker({color: '#ff0000'})
              .setLngLat(coords[coords.length - 1] as [number, number])
              .setPopup(new mapboxgl.Popup().setText('Arrivée Étape 1'))
              .addTo(mapInstance);

            const bounds = coords.reduce(
              (b, c) => b.extend(c as [number, number]),
              new mapboxgl.LngLatBounds(coords[0] as [number, number], coords[0] as [number, number])
            );
            mapInstance.fitBounds(bounds, {padding: 50, duration: 1000});
          }

          console.log('GPX chargé avec succès !');
        })
        .catch((err) => console.error('Erreur GPX:', err));
    });
  }

  ngOnDestroy(): void {
    this.map()?.remove();
  }

  private gpxToGeoJSON(gpx: string) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(gpx, 'text/xml');
    const coordinates: number[][] = [];

    xml.querySelectorAll('trkpt').forEach((pt) => {
      const lat = parseFloat(pt.getAttribute('lat') || '');
      const lon = parseFloat(pt.getAttribute('lon') || '');
      if (!isNaN(lat) && !isNaN(lon)) {
        coordinates.push([lon, lat]);
      }
    });

    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates,
          },
        },
      ],
    };
  }
}
