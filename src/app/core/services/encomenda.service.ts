import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Encomenda, EncomendaEstado, EncomendaPayload } from '../models';
import { desembrulhar } from '../http/api-resposta';

@Injectable({ providedIn: 'root' })
export class EncomendaService {
  private readonly base = `${environment.apiUrl}/encomendas`;

  constructor(private http: HttpClient) {}

  /** Histórico do cliente autenticado (ou todas, se for admin - conforme a tua API decidir) */
  listar(): Observable<Encomenda[]> {
    return this.http
      .get<unknown>(this.base)
      .pipe(desembrulhar<Encomenda[]>());
  }

  obter(id: number): Observable<Encomenda> {
    return this.http
      .get<unknown>(`${this.base}/${id}`)
      .pipe(desembrulhar<Encomenda>());
  }

  /** Cria a encomenda a partir do carrinho atual do cliente */
  criar(payload: EncomendaPayload): Observable<Encomenda> {
    return this.http
      .post<unknown>(this.base, payload)
      .pipe(desembrulhar<Encomenda>());
  }

  /** Uso administrativo: mudar estado da encomenda */
  atualizarEstado(id: number, estado: EncomendaEstado): Observable<Encomenda> {
    return this.http
      .put<unknown>(`${this.base}/${id}`, { estado })
      .pipe(desembrulhar<Encomenda>());
  }

  cancelar(id: number): Observable<Encomenda> {
    return this.atualizarEstado(id, 'cancelada');
  }
}
