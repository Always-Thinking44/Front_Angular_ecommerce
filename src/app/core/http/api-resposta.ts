import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';

export function desembrulhar<T>(): (origem: Observable<unknown>) => Observable<T> {
  return (origem) =>
    origem.pipe(
      map((resposta) => {
        if (resposta && typeof resposta === 'object' && 'data' in resposta) {
          return (resposta as { data: T }).data;
        }
        return resposta as T;
      })
    );
}

const API_BASE = environment.apiUrl.replace(/\/api\/?$/, '');

export function comImagemUrl<T extends { imagem_url?: string }>(objeto: T): T {
  const alternativa = (objeto as T & { imagem?: string | null }).imagem;
  const url = objeto.imagem_url || alternativa;
  if (!url) return objeto;

  const urlCompleta = url.startsWith('http') ? url : `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
  return { ...objeto, imagem_url: urlCompleta };
}
