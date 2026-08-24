import { Observable } from 'rxjs';
import { map } from 'rxjs';

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

export function comImagemUrl<T extends { imagem_url?: string }>(objeto: T): T {
  const alternativa = (objeto as T & { imagem?: string | null }).imagem;
  return objeto.imagem_url || !alternativa
    ? objeto
    : { ...objeto, imagem_url: alternativa };
}
