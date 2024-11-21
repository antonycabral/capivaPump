import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  isAuthPage: boolean = false;
  isMenuCollapsed = true;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.isAuthPage = ['/login', '/cadastro'].includes(this.router.url);
    });
  }

  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
    this.isMenuCollapsed = true;
  }
}