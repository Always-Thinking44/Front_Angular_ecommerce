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

  criar(payload: ProdutoPayload, imagem?: File | null): Observable<Produto> {
    const formData = this.montarFormData(payload, imagem);
    return this.http
      .post<unknown>(this.base, formData)
      .pipe(desembrulhar<Produto>(), map((p) => comImagemUrl(p)));
  }

  atualizar(id: number, payload: Partial<ProdutoPayload>, imagem?: File | null): Observable<Produto> {
    const formData = this.montarFormData(payload, imagem);
    return this.http
      .put<unknown>(`${this.base}/${id}`, formData)
      .pipe(desembrulhar<Produto>(), map((p) => comImagemUrl(p)));
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  private montarFormData(payload: Partial<ProdutoPayload>, imagem?: File | null): FormData {
    const formData = new FormData();
    if (payload.nome != null) formData.append('nome', payload.nome);
    if (payload.descricao != null) formData.append('descricao', payload.descricao);
    if (payload.preco != null) formData.append('preco', String(payload.preco));
    if (payload.stock != null) formData.append('stock', String(payload.stock));
    if (payload.categoria_id != null) formData.append('categoria_id', String(payload.categoria_id));
    if (imagem) formData.append('imagem', imagem);
    return formData;
  }
}
