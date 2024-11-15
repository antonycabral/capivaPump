import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExercicioHistoricoService {
  private apiUrl = 'http://localhost:8080/api/exercicio-historico';

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

  registrarAlteracao(exercicioId: string, historico: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${exercicioId}`, historico, this.getHeaders());
  }

  getHistorico(exercicioId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/exercicio/${exercicioId}`, this.getHeaders());
  }
}
