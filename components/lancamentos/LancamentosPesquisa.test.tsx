import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LancamentosPesquisa } from './LancamentosPesquisa';
import { PrimeProvider } from '../providers/PrimeProvider';
import { LancamentoService } from '@/services';
import { Lancamento, PageResult } from '@/models';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useParams: () => ({}),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

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
    mockPush.mockReset();
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
    const titulo = await screen.findByRole('heading', { level: 1, name: /lançamentos/i });
    expect(titulo).toBeInTheDocument();
  });

  it('deve renderizar os cabeçalhos da tabela corretamente', async () => {
    renderComponente();
    const headersEsperados = ['Pessoa', 'Descrição', 'Vencimento', 'Pagamento', 'Valor', 'Ações'];

    for (const header of headersEsperados) {
      expect(await screen.findByRole('columnheader', { name: header })).toBeInTheDocument();
    }
  });

  it('deve renderizar as linhas da tabela após carregar do serviço', async () => {
    renderComponente();
    expect(await screen.findByText('Compra de pão')).toBeInTheDocument();
    expect(await screen.findByText('Padaria do José')).toBeInTheDocument();
  });

  it('deve aplicar classe text-danger para despesa e text-success para receita', async () => {
    renderComponente();
    const firstRowValue = await screen.findByText('R$ 4,55');
    expect(firstRowValue).toHaveClass('text-danger');

    const secondRowValue = await screen.findByText('R$ 80.000,00');
    expect(secondRowValue).toHaveClass('text-success');
  });

  it('deve chamar o serviço com o filtro de descrição ao pesquisar', async () => {
    renderComponente();

    const input = await screen.findByPlaceholderText(/digite a descrição para pesquisar/i);
    const botaoPesquisar = await screen.findByRole('button', { name: /pesquisar/i });

    fireEvent.change(input, { target: { value: 'Compra de pão' } });
    fireEvent.click(botaoPesquisar);

    await waitFor(() => {
      expect(LancamentoService.listar).toHaveBeenCalledWith(
        expect.objectContaining({ descricao: 'Compra de pão' }),
        expect.anything()
      );
    });
  });

  it('deve redirecionar para rota de edição ao clicar no botão editar', async () => {
    renderComponente();

    expect(await screen.findByText('Compra de pão')).toBeInTheDocument();

    const editButtons = screen.getAllByRole('button', { name: /editar/i });
    expect(editButtons.length).toBeGreaterThan(0);

    fireEvent.click(editButtons[0]);

    expect(mockPush).toHaveBeenCalledWith('/lancamentos/1');
  });
});
