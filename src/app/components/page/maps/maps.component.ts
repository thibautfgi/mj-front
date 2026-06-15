import { Component, ElementRef, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../../../environments/environment';
import { MapsTabs } from './maps-tabs/maps-tabs';
import { MapsButtons } from './maps-buttons/maps-buttons';
import { GpxService } from './services/gpx.service';


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
  private gpxService = inject(GpxService);

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

    map.on('load', () => {
      this.addBaseLayers(map);
    });
  }

  onToggleSnow(visible: boolean): void {
    this.map()?.setLayoutProperty(
      'sentinel-snow-layer',
      'visibility',
      visible ? 'visible' : 'none'
    );
  }

  onToggleStyle(isSatellite: boolean): void {
    const map = this.map();
    if (!map) return;

    const style = isSatellite
      ? 'mapbox://styles/mapbox/standard-satellite'
      : 'mapbox://styles/mapbox/outdoors-v12';

    map.setStyle(style);
    map.once('style.load', () => {
      this.addBaseLayers(map);
    });
  }

  onGpxFile(file: File): void {
    const map = this.map();
    if (!map) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const gpxText = e.target?.result as string;
      if (!gpxText) return;

      // Retire l'ancien tracé s'il existe
      if (map.getLayer('gr20-line')) map.removeLayer('gr20-line');
      if (map.getLayer('sky')) map.removeLayer('sky');
      if (map.getSource('gr20-test')) map.removeSource('gr20-test');

      this.gpxService.loadGpx(map, gpxText)
        .catch(err => console.error('Erreur GPX:', err));
    };
    reader.readAsText(file);
  }

  ngOnDestroy(): void {
    this.map()?.remove();
  }

  private addBaseLayers(map: mapboxgl.Map): void {
    map.addSource('mapbox-dem', {
      type: 'raster-dem',
      url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
      tileSize: 512,
      maxzoom: 14
    });
    map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.8 });

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
      layout: { visibility: 'none' },
      paint: { 'raster-opacity': 0.85 }
    });
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
}
