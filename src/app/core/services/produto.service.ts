import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Produto, ProdutoFiltro, ProdutoPayload } from '../models';
import { comImagemUrl, desembrulhar } from '../http/api-resposta';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private readonly base = `${environment.apiUrl}/produtos`;

  constructor(private http: HttpClient) {}

  listar(filtro?: ProdutoFiltro): Observable<Produto[]> {
    let params = new HttpParams();
    if (filtro?.categoria_id) {
      params = params.set('categoria_id', filtro.categoria_id);
    }
    if (filtro?.pesquisa) {
      params = params.set('pesquisa', filtro.pesquisa);
    }
    if (filtro?.page) {
      params = params.set('page', filtro.page);
    }
    return this.http
      .get<unknown>(this.base, { params })
      .pipe(
        desembrulhar<Produto[]>(),
        map((lista) => (lista ?? []).map(comImagemUrl))
      );
  }

  obter(id: number): Observable<Produto> {
    return this.http
      .get<unknown>(`${this.base}/${id}`)
      .pipe(desembrulhar<Produto>(), map((p) => comImagemUrl(p)));
  }

  criar(payload: ProdutoPayload): Observable<Produto> {
    return this.http
      .post<unknown>(this.base, payload)
      .pipe(desembrulhar<Produto>(), map((p) => comImagemUrl(p)));
  }

  atualizar(id: number, payload: Partial<ProdutoPayload>): Observable<Produto> {
    return this.http
      .put<unknown>(`${this.base}/${id}`, payload)
      .pipe(desembrulhar<Produto>(), map((p) => comImagemUrl(p)));
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
