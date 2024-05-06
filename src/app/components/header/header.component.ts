import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  router = inject(Router);
  activeColor = '#007bff';
  textColor = '#4b5563';
  doLogOut() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('loggedUser');
    this.router.navigateByUrl('/');
  }

  get isLogin(): boolean {
    return localStorage.getItem('authToken') !== null;
  }
}
