export interface Pessoa {
  nome: string;
  cidade: string;
  estado: string;
  ativo: boolean;
}

export interface PessoaFiltro {
  nome?: string;
}
