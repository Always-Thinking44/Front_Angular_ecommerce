export interface Avaliacao {
  id: number;
  produto_id: number;
  user_id: number;
  user_name?: string;
  classificacao: number; // 1 a 5
  comentario?: string;
  created_at?: string;
}

export interface AvaliacaoPayload {
  produto_id: number;
  classificacao: number;
  comentario?: string;
}
