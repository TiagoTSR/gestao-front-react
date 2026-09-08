export type TipoLancamento = 'RECEITA' | 'DESPESA';

export interface Lancamento {
  tipo: TipoLancamento;
  descricao: string;
  dataVencimento: string;
  dataPagamento: string | null;
  valor: number;
  pessoa: string;
}

export interface LancamentoForm {
  tipo: TipoLancamento;
  dataVencimento: Date | null;
  dataPagamento: Date | null;
  descricao: string;
  valor: number | null;
  categoriaId: number | null;
  pessoaId: number | null;
  observacao: string;
}

export interface LancamentoFiltro {
  descricao?: string;
  dataVencimentoDe?: string;
  dataVencimentoAte?: string;
}
