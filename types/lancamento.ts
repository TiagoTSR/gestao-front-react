export type TipoLancamento = 'RECEITA' | 'DESPESA';

export interface Lancamento {
  tipo: TipoLancamento;
  descricao: string;
  dataVencimento: string;
  dataPagamento: string | null;
  valor: number;
  pessoa: string;
}

export interface LancamentoFiltro {
  descricao?: string;
  dataVencimentoDe?: string;
  dataVencimentoAte?: string;
}
