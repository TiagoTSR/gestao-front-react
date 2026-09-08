import { Categoria } from './categoria.model';
import { Pessoa } from './pessoa.model';

export type TipoLancamento = 'RECEITA' | 'DESPESA';

export interface Lancamento {
  id?: number;
  descricao: string;
  data_vencimento: string;
  data_pagamento?: string | null;
  valor: number;
  observacao?: string | null;
  tipo: TipoLancamento;
  categoria: Categoria;
  pessoa: Pessoa;
}

export interface CriarLancamentoRequest {
  descricao: string;
  data_vencimento: string;
  data_pagamento?: string | null;
  valor: number;
  observacao?: string | null;
  tipo: TipoLancamento;
  categoria_id: number;
  pessoa_id: number;
}

export interface AtualizarLancamentoRequest {
  descricao: string;
  data_vencimento: string;
  data_pagamento?: string | null;
  valor: number;
  observacao?: string | null;
  tipo: TipoLancamento;
  categoria_id: number;
  pessoa_id: number;
}

export interface LancamentoFilter {
  descricao?: string;
  data_vencimento_de?: string;
  data_vencimento_ate?: string;
  categoria_id?: number;
  pessoa_id?: number;
}
