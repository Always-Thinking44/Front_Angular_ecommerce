import { Categoria } from './categoria.model';

export interface Produto {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
  stock: number;
  imagem_url?: string;
  categoria_id: number;
  categoria?: Categoria;
  created_at?: string;
  updated_at?: string;
}

export type ProdutoPayload = Omit<Produto, 'id' | 'categoria' | 'created_at' | 'updated_at'>;

export interface ProdutoFiltro {
  categoria_id?: number;
  pesquisa?: string;
  page?: number;
}
