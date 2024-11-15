import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExercicioService {
  private apiUrl = 'http://localhost:8080/api/exercicios';

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }
  
  constructor(private http: HttpClient) { }

  criarExercicio(treinoId: string, exercicio: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/treino/${treinoId}`, exercicio, this.getHeaders());
  }

  getExerciciosByTreino(treinoId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/treino/${treinoId}`, this.getHeaders());
  }

  deletarExercicio(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getHeaders());
  }

  atualizarExercicio(id: string, exercicio: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, exercicio, this.getHeaders());
  }
}
