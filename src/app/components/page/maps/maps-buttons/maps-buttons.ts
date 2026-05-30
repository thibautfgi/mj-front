import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-maps-buttons',
  imports: [CommonModule],
  templateUrl: './maps-buttons.html',
  styleUrl: './maps-buttons.scss',
  standalone: true,
})
export class MapsButtons {
  @Input() map: mapboxgl.Map | null = null;

  snowVisible = true;

  toggleSnow(): void {
    if (!this.map) return;
    this.snowVisible = !this.snowVisible;
    this.map.setLayoutProperty(
      'sentinel-snow-layer',
      'visibility',
      this.snowVisible ? 'visible' : 'none'
    );
  }
}
