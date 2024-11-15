import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  getUserById(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
  }

  getUserByEmail(email: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.get<any>(`${this.apiUrl}/email/${email}`, { headers });
  }

  atualizarUsuario(userId: string, userData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.put(`${this.apiUrl}/${userId}`, userData, { headers });
  }

}
