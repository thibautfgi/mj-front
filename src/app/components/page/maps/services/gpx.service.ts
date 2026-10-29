import { Injectable } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface GltfLayerOptions {
  id: string;
  url: string;
  lngLat: [number, number];
  altitude?: number;   // en mètres
  scale?: number;      // 1 = taille réelle en mètres
  rotationX?: number;  // en radians, par défaut PI/2 (modèles Y-up)
}

const GPX_SOURCE_ID = 'gr20-test';
const GPX_LINE_LAYER_ID = 'gr20-line';
const SKY_LAYER_ID = 'sky';
const MODEL_LAYER_ID = 'refuge-model';

@Injectable({ providedIn: 'root' })
export class GpxService {

  private markers: mapboxgl.Marker[] = [];

  /**
   * Supprime le tracé, le ciel, le modèle 3D et les markers ajoutés précédemment.
   */
  clearGpx(map: mapboxgl.Map): void {
    this.markers.forEach(m => m.remove());
    this.markers = [];

    if (map.getLayer(MODEL_LAYER_ID)) map.removeLayer(MODEL_LAYER_ID);
    if (map.getLayer(GPX_LINE_LAYER_ID)) map.removeLayer(GPX_LINE_LAYER_ID);
    if (map.getLayer(SKY_LAYER_ID)) map.removeLayer(SKY_LAYER_ID);
    if (map.getSource(GPX_SOURCE_ID)) map.removeSource(GPX_SOURCE_ID);
  }

  /**
   * Charge un GPX, le trace sur la carte et renvoie le point de départ [lng, lat].
   * Renvoie null si le fichier ne contient aucun point.
   */
  async loadGpx(map: mapboxgl.Map, gpxText: string): Promise<[number, number] | null> {
    this.clearGpx(map);

    const geojson = this.gpxToGeoJSON(gpxText);
    const coords = geojson.features[0]?.geometry.coordinates || [];

    map.addSource(GPX_SOURCE_ID, { type: 'geojson', data: geojson as any });

    map.addLayer({
      id: GPX_LINE_LAYER_ID,
      type: 'line',
      source: GPX_SOURCE_ID,
      paint: { 'line-color': '#ff0000', 'line-width': 4, 'line-opacity': 1 }
    });

    map.addLayer({
      id: SKY_LAYER_ID,
      type: 'sky',
      paint: {
        'sky-type': 'atmosphere',
        'sky-atmosphere-sun': [0.0, 90.0],
        'sky-atmosphere-sun-intensity': 15
      }
    });

    if (coords.length === 0) return null;

    const start = coords[0] as [number, number];
    const end = coords[coords.length - 1] as [number, number];

    this.markers.push(
      new mapboxgl.Marker({ color: '#00ff00' })
        .setLngLat(start)
        .setPopup(new mapboxgl.Popup().setText('Départ'))
        .addTo(map),
      new mapboxgl.Marker({ color: '#ff0000' })
        .setLngLat(end)
        .setPopup(new mapboxgl.Popup().setText('Arrivée'))
        .addTo(map)
    );

    const bounds = coords.reduce(
      (b, c) => b.extend(c as [number, number]),
      new mapboxgl.LngLatBounds(start, start)
    );
    map.fitBounds(bounds, { padding: 50, duration: 1000 });

    return start;
  }

  addGltfLayer(map: mapboxgl.Map, opts: GltfLayerOptions): void {
    const origin = mapboxgl.MercatorCoordinate.fromLngLat(opts.lngLat, opts.altitude ?? 0);
    const s = origin.meterInMercatorCoordinateUnits() * (opts.scale ?? 1);
    const rotX = opts.rotationX ?? Math.PI / 2;

    let camera: THREE.Camera;
    let scene: THREE.Scene;
    let renderer: THREE.WebGLRenderer;

    const layer: mapboxgl.CustomLayerInterface = {
      id: opts.id,
      type: 'custom',
      renderingMode: '3d',

      onAdd(m, gl) {
        camera = new THREE.Camera();
        scene = new THREE.Scene();

        const light1 = new THREE.DirectionalLight(0xffffff, 1);
        light1.position.set(0, -70, 100).normalize();
        scene.add(light1);

        const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
        light2.position.set(0, 70, 100).normalize();
        scene.add(light2);

        new GLTFLoader().load(opts.url, (gltf) => {
          scene.add(gltf.scene);
          m.triggerRepaint();
        }, undefined, (err) => console.error('[GLTF] erreur de chargement', err));

        renderer = new THREE.WebGLRenderer({
          canvas: m.getCanvas(),
          context: gl,
          antialias: true
        });
        renderer.autoClear = false;
      },

      render(gl, matrix) {
        const model = new THREE.Matrix4()
          .makeTranslation(origin.x, origin.y, origin.z)
          .scale(new THREE.Vector3(s, -s, s))
          .multiply(new THREE.Matrix4().makeRotationX(rotX));

        camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix).multiply(model);

        renderer.resetState();
        renderer.render(scene, camera);
        map.triggerRepaint();
      }
    };

    map.addLayer(layer);
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
