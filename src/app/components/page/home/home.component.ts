import { Component, HostListener } from '@angular/core';
import { CustomButtons } from '../../communs/custom-buttons/custom-buttons';

@Component({
  selector: 'app-home',
  imports: [CustomButtons],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
})
export class HomeComponent {
  showButton = true;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showButton = window.scrollY === 0;
  }
}
