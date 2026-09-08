import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LancamentosPesquisa } from './LancamentosPesquisa';
import { PrimeProvider } from '../providers/PrimeProvider';
import { LancamentoService } from '@/services';
import { Lancamento, PageResult } from '@/models';

const MOCK_LANCAMENTOS: PageResult<Lancamento> = {
  conteudo: [
    {
      id: 1,
      tipo: 'DESPESA',
      descricao: 'Compra de pão',
      data_vencimento: '2026-06-30',
      data_pagamento: null,
      valor: 4.55,
      pessoa: { id: 1, nome: 'Padaria do José', ativo: true },
      categoria: { id: 1, nome: 'Alimentação' },
    },
    {
      id: 2,
      tipo: 'RECEITA',
      descricao: 'Venda de software',
      data_vencimento: '2026-06-10',
      data_pagamento: '2026-06-09',
      valor: 80000,
      pessoa: { id: 2, nome: 'Atacado Brasil', ativo: true },
      categoria: { id: 2, nome: 'Vendas' },
    },
    {
      id: 3,
      tipo: 'DESPESA',
      descricao: 'Impostos',
      data_vencimento: '2026-07-20',
      data_pagamento: null,
      valor: 14312,
      pessoa: { id: 3, nome: 'Ministério da Fazenda', ativo: true },
      categoria: { id: 3, nome: 'Impostos' },
    },
    {
      id: 4,
      tipo: 'DESPESA',
      descricao: 'Mensalidade de escola',
      data_vencimento: '2026-06-05',
      data_pagamento: '2026-05-30',
      valor: 800,
      pessoa: { id: 4, nome: 'Escola Abelha', ativo: true },
      categoria: { id: 4, nome: 'Educação' },
    },
    {
      id: 5,
      tipo: 'RECEITA',
      descricao: 'Venda de carro',
      data_vencimento: '2026-08-18',
      data_pagamento: null,
      valor: 55000,
      pessoa: { id: 5, nome: 'Sebastião Souza', ativo: true },
      categoria: { id: 2, nome: 'Vendas' },
    },
  ],
  pagina: 0,
  tamanho: 5,
  total_elementos: 5,
  total_paginas: 1,
};

describe('LancamentosPesquisa', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(LancamentoService, 'listar').mockResolvedValue(MOCK_LANCAMENTOS);
  });

  const renderComponente = () =>
    render(
      <PrimeProvider>
        <LancamentosPesquisa />
      </PrimeProvider>
    );

  it('deve renderizar o título da página no documento', async () => {
    renderComponente();
    const titulo = screen.getByRole('heading', { level: 1, name: /lançamentos/i });
    expect(titulo).toBeInTheDocument();
  });

  it('deve renderizar os cabeçalhos da tabela corretamente', async () => {
    renderComponente();
    const headersEsperados = ['Pessoa', 'Descrição', 'Vencimento', 'Pagamento', 'Valor', 'Ações'];

    headersEsperados.forEach((header) => {
      expect(screen.getByRole('columnheader', { name: header })).toBeInTheDocument();
    });
  });

  it('deve renderizar as linhas da tabela após carregar do serviço', async () => {
    renderComponente();
    await waitFor(() => {
      expect(screen.getByText('Compra de pão')).toBeInTheDocument();
      expect(screen.getByText('Padaria do José')).toBeInTheDocument();
    });
  });

  it('deve aplicar classe text-danger para despesa e text-success para receita', async () => {
    renderComponente();
    await waitFor(() => {
      const firstRowValue = screen.getByText('R$ 4,55');
      expect(firstRowValue).toHaveClass('text-danger');

      const secondRowValue = screen.getByText('R$ 80.000,00');
      expect(secondRowValue).toHaveClass('text-success');
    });
  });

  it('deve chamar o serviço com o filtro de descrição ao pesquisar', async () => {
    renderComponente();

    const input = screen.getByPlaceholderText(/digite a descrição para pesquisar/i);
    const botaoPesquisar = screen.getByRole('button', { name: /pesquisar/i });

    fireEvent.change(input, { target: { value: 'Compra de pão' } });
    fireEvent.click(botaoPesquisar);

    expect(LancamentoService.listar).toHaveBeenCalledWith(
      expect.objectContaining({ descricao: 'Compra de pão' }),
      expect.anything()
    );
  });
});
