import { Produto } from './produto.model';

export type EncomendaEstado =
  | 'pendente'
  | 'paga'
  | 'em_preparacao'
  | 'enviada'
  | 'entregue'
  | 'cancelada';

export interface EncomendaItem {
  id: number;
  produto_id: number;
  produto?: Produto;
  quantidade: number;
  preco_unitario: number;
}

export interface Encomenda {
  id: number;
  user_id: number;
  estado: EncomendaEstado;
  total: number;
  morada_entrega?: string;
  itens?: EncomendaItem[];
  created_at?: string;
  updated_at?: string;
}

export interface EncomendaPayload {
  morada_entrega: string;
}
