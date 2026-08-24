import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Avaliacao, AvaliacaoPayload } from '../models';
import { desembrulhar } from '../http/api-resposta';

@Injectable({ providedIn: 'root' })
export class AvaliacaoService {
  private readonly base = `${environment.apiUrl}/avaliacoes`;

  constructor(private http: HttpClient) {}

  listarPorProduto(produtoId: number): Observable<Avaliacao[]> {
    return this.http
      .get<unknown>(`${environment.apiUrl}/produtos/${produtoId}/avaliacoes`)
      .pipe(desembrulhar<Avaliacao[]>());
  }

  criar(payload: AvaliacaoPayload): Observable<Avaliacao> {
    return this.http
      .post<unknown>(this.base, payload)
      .pipe(desembrulhar<Avaliacao>());
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
