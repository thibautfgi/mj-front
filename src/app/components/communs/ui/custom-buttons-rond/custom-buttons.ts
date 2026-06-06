import {Component, Input} from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-custom-buttons',
  templateUrl: './custom-buttons-rond.html',
  standalone: true,
  styleUrls: ['./custom-buttons.scss'],
  imports: [
    NgStyle,
  ],
})
export class CustomButtons {

  @Input() textButton: string = '';
  @Input() customColor?: string; // Couleur personnalisée

}
