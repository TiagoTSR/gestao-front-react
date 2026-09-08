import { Endereco } from './endereco.model';

export interface Pessoa {
  id?: number;
  nome: string;
  ativo: boolean;
  endereco?: Endereco | null;
}

export interface CriarPessoaRequest {
  nome: string;
  ativo?: boolean;
  endereco?: Endereco | null;
}

export interface AtualizarPessoaRequest {
  nome: string;
  ativo: boolean;
  endereco?: Endereco | null;
}

export interface AtualizarAtivoPessoaRequest {
  ativo: boolean;
}

export interface PessoaFilter {
  nome?: string;
  ativo?: boolean;
}
