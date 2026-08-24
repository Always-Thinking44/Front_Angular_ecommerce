import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Pagamento, PagamentoPayload } from '../models';

@Injectable({ providedIn: 'root' })
export class PagamentoService {
  private readonly base = `${environment.apiUrl}/pagamentos`;

  constructor(private http: HttpClient) {}

  processar(payload: PagamentoPayload): Observable<Pagamento> {
    return this.http.post<Pagamento>(this.base, payload);
  }

  obterPorEncomenda(encomendaId: number): Observable<Pagamento> {
    return this.http.get<Pagamento>(`${this.base}/encomenda/${encomendaId}`);
  }
}
