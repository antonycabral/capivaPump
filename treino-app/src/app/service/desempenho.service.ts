import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { DesempenhoData } from '../../Models/DesenpenhoData';
import { TreinoRegistro } from '../../Models/TreinoRegistro';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DesempenhoService {

  private apiUrl = `https://${environment.apiUrl}/api/desempenho`;
  private desempenhoSubject = new BehaviorSubject<DesempenhoData | null>(null);

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

  getDesempenhoUsuario(userId: string): Observable<DesempenhoData> {
    return this.http.get<DesempenhoData>(`${this.apiUrl}/usuario/${userId}`, this.getHeaders())
      .pipe(
        tap(data => this.desempenhoSubject.next(data))
      );
  }

  registrarTreino(treinoData: TreinoRegistro): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/registrar`, treinoData, this.getHeaders());
  }

  registrarConclusaoTreino(treinoData: TreinoRegistro): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/registrar`, treinoData, this.getHeaders())
      .pipe(
        tap(() => {
          this.getDesempenhoUsuario(treinoData.usuarioId).subscribe();
        })
      );
  }

  obterEstatisticas(usuarioId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/usuario/${usuarioId}`, { headers });
  }

  getCurrentDesempenho(): Observable<DesempenhoData | null> {
    return this.desempenhoSubject.asObservable();
  }
}
