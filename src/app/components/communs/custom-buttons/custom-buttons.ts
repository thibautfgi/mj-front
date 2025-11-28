import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-custom-buttons',
  imports: [],
  templateUrl: './custom-buttons.html',
  styleUrl: './custom-buttons.scss',
  standalone: true
})
export class CustomButtons {

  @Input() textButton: string = '';

}
