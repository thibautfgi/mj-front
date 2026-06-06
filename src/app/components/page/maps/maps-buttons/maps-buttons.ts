import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  snowVisible = false;
  isSatellite = false; // outdoors au démarrage

  faSnowflake = faSnowflake;
  faMoon = faMoon;
  faLayerGroup = faLayerGroup;

  @Output() toggleSnowEvent = new EventEmitter<boolean>();
  @Output() toggleStyleEvent = new EventEmitter<boolean>();

  toggleSnow(): void {
    this.snowVisible = !this.snowVisible;
    this.toggleSnowEvent.emit(this.snowVisible);
  }

  toggleStyle(): void {
    this.isSatellite = !this.isSatellite;
    this.toggleStyleEvent.emit(this.isSatellite);
  }
}
