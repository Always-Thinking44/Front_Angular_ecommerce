export type PagamentoMetodo = 'cartao' | 'transferencia' | 'multicaixa' | 'mbway';
export type PagamentoEstado = 'pendente' | 'aprovado' | 'recusado';

export interface Pagamento {
  id: number;
  encomenda_id: number;
  metodo: PagamentoMetodo;
  estado: PagamentoEstado;
  valor: number;
  referencia?: string;
  created_at?: string;
}

export interface PagamentoPayload {
  encomenda_id: number;
  metodo: PagamentoMetodo;
}
