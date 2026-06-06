import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import mapboxgl from 'mapbox-gl';
import { faMoon, faSnowflake, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { CustomButtonsRond } from '../../../communs/ui/custom-buttons-rond/custom-buttons-rond';

@Component({
  selector: 'app-maps-buttons',
  imports: [CommonModule, CustomButtonsRond],
  templateUrl: './maps-buttons.html',
  styleUrl: './maps-buttons.scss',
  standalone: true,
})
export class MapsButtons {
  @Input() map: mapboxgl.Map | null = null;

  snowVisible = false;

  // icônes exposées au template
  faSnowflake = faSnowflake;
  faMoon = faMoon;
  faLayerGroup = faLayerGroup;

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
