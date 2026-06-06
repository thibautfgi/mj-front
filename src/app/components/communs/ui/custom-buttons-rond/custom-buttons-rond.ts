import { Component, Input } from '@angular/core';
import { NgStyle } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-custom-buttons-rond',
  templateUrl: './custom-buttons-rond.html',
  standalone: true,
  styleUrls: ['./custom-buttons-rond.scss'],
  imports: [NgStyle, FontAwesomeModule],
})
export class CustomButtonsRond {
  @Input() icon!: IconDefinition;
  @Input() customColor?: string;
  @Input() ariaLabel: string = 'bouton';
  @Input() tooltip: string = '';   // ← nouveau
}
