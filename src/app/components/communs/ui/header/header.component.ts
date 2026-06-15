import { Component, inject, OnInit, HostListener } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomButtons } from '../custom-buttons/custom-buttons';
import { AuthService } from '../../services/auth.services';

@Component({
  selector: 'app-header',
  imports: [NgOptimizedImage, CustomButtons, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true
})
export class HeaderComponent implements OnInit {
  protected authService = inject(AuthService);
  showUserMenu = false;

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.whoiam().subscribe();
    }
  }

  onLogout(): void {
    this.showUserMenu = false;
    this.authService.logout();
  }

  // ferme le menu si on clique ailleurs
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('app-header')) {
      this.showUserMenu = false;
    }
  }
}
