import { Produto } from './produto.model';

export interface CarrinhoItem {
  id: number;
  produto_id: number;
  produto?: Produto;
  quantidade: number;
  created_at?: string;
  updated_at?: string;
}

export interface CarrinhoItemPayload {
  produto_id: number;
  quantidade: number;
}
