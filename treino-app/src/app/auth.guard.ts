import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private router: Router) {}

  canActivate(): boolean {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        return true;
      }
    }
    
    this.router.navigate(['/login']);
    return false;
  }
}