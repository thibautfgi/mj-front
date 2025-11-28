import {Component} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {CustomButtons} from '../custom-buttons/custom-buttons';

@Component({
  selector: 'app-header',
  imports: [
    NgOptimizedImage,
    CustomButtons
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true
})
export class HeaderComponent {

}
