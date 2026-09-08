export interface Categoria {
  id?: number;
  nome: string;
}

export interface CriarCategoriaRequest {
  nome: string;
}

export interface AtualizarCategoriaRequest {
  nome: string;
}
