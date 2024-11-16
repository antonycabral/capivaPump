import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `https://${environment.apiUrl}/auth`; //

  constructor(private http: HttpClient) {}

  cadastrar(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cadastrar`, usuario);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

}
