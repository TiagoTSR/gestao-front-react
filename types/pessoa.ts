export interface Pessoa {
  nome: string;
  cidade: string;
  estado: string;
  ativo: boolean;
}

export interface PessoaForm {
  nome: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
  ativo: boolean;
}

export interface PessoaFiltro {
  nome?: string;
}
