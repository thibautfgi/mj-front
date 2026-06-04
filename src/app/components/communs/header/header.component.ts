import { Component, inject, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { CustomButtons } from '../custom-buttons/custom-buttons';
import { AuthService } from '../services/auth.services';

@Component({
  selector: 'app-header',
  imports: [NgOptimizedImage, CustomButtons],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true
})
export class HeaderComponent implements OnInit {
  protected authService = inject(AuthService);

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.whoiam().subscribe(); // ← le tap() du service remplit le signal
    }
  }
}
