import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CarrinhoItem, CarrinhoItemPayload } from '../models';
import { comImagemUrl, desembrulhar } from '../http/api-resposta';

interface CarrinhoResposta {
  itens: CarrinhoItem[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class CarrinhoService {
  private readonly base = `${environment.apiUrl}/carrinho`;

  constructor(private http: HttpClient) {}

  listar(): Observable<CarrinhoItem[]> {
    return this.http
      .get<CarrinhoResposta>(this.base)
      .pipe(
        map((res) => res.itens ?? []),
        this.normalizarItens(),
      );
  }

  adicionar(payload: CarrinhoItemPayload): Observable<CarrinhoItem> {
    return this.http
      .post<unknown>(this.base, payload)
      .pipe(desembrulhar<CarrinhoItem>(), this.normalizarItem());
  }

  atualizarQuantidade(id: number, quantidade: number): Observable<CarrinhoItem> {
    return this.http
      .patch<unknown>(`${this.base}/${id}`, { quantidade })
      .pipe(desembrulhar<CarrinhoItem>(), this.normalizarItem());
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  private normalizarItens() {
    return map((itens: CarrinhoItem[]) =>
      (itens ?? []).map((item) =>
        item.produto ? { ...item, produto: comImagemUrl(item.produto) } : item
      )
    );
  }

  private normalizarItem() {
    return map((item: CarrinhoItem) =>
      item.produto ? { ...item, produto: comImagemUrl(item.produto) } : item
    );
  }
}
