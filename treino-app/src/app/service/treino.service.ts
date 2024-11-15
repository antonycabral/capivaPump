import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TreinoService {
  private apiUrl = 'http://localhost:8080/api/treinos';

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  criarTreino(treino: any): Observable<any> {
    const userId = localStorage.getItem('userId');
    const treinoData = {
      ...treino,
      usuario: {
        id: userId
      }
    };
    return this.http.post(this.apiUrl, treinoData, this.getHeaders());
  }

  listarTreinosPorUsuario(usuarioId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${usuarioId}`, this.getHeaders()).pipe(
      map(response => response || []),
      catchError(error => {
        console.log('Error:', error);
        return of([]);
      })
    );
  }

  deletarTreino(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getHeaders());
  }

  atualizarTreino(id: string, treino: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, treino, this.getHeaders());
  }

  getTreino(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, this.getHeaders()).pipe(
      catchError(error => {
        console.error('Error fetching treino:', error);
        return of(null);
      })
    );
}
}