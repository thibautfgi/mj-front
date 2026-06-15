import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMoon, faSnowflake, faLayerGroup, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { CustomButtonsRond } from '../../../communs/ui/custom-buttons-rond/custom-buttons-rond';

@Component({
  selector: 'app-maps-buttons',
  imports: [CommonModule, CustomButtonsRond, FontAwesomeModule],
  templateUrl: './maps-buttons.html',
  styleUrl: './maps-buttons.scss',
  standalone: true,
})
export class MapsButtons {
  snowVisible = false;
  isSatellite = false;

  faSnowflake = faSnowflake;
  faMoon = faMoon;
  faLayerGroup = faLayerGroup;
  faFileImport = faFileImport;

  @Output() toggleSnowEvent = new EventEmitter<boolean>();
  @Output() toggleStyleEvent = new EventEmitter<boolean>();
  @Output() gpxFileEvent = new EventEmitter<File>();

  toggleSnow(): void {
    this.snowVisible = !this.snowVisible;
    this.toggleSnowEvent.emit(this.snowVisible);
  }

  toggleStyle(): void {
    this.isSatellite = !this.isSatellite;
    this.toggleStyleEvent.emit(this.isSatellite);
  }

  onGpxSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.gpxFileEvent.emit(file);
    input.value = '';
  }
}
