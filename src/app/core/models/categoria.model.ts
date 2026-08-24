export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
  created_at?: string;
  updated_at?: string;
}

export type CategoriaPayload = Omit<Categoria, 'id' | 'created_at' | 'updated_at'>;
