import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Categoria, CategoriaPayload } from '../models';
import { desembrulhar } from '../http/api-resposta';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private readonly base = `${environment.apiUrl}/categorias`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Categoria[]> {
    return this.http
      .get<unknown>(this.base)
      .pipe(desembrulhar<Categoria[]>());
  }

  obter(id: number): Observable<Categoria> {
    return this.http
      .get<unknown>(`${this.base}/${id}`)
      .pipe(desembrulhar<Categoria>());
  }

  criar(payload: CategoriaPayload): Observable<Categoria> {
    return this.http
      .post<unknown>(this.base, payload)
      .pipe(desembrulhar<Categoria>());
  }

  atualizar(id: number, payload: Partial<CategoriaPayload>): Observable<Categoria> {
    return this.http
      .put<unknown>(`${this.base}/${id}`, payload)
      .pipe(desembrulhar<Categoria>());
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
