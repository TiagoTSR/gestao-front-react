import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LancamentosPesquisa } from './LancamentosPesquisa';
import { PrimeProvider } from '../providers/PrimeProvider';

describe('LancamentosPesquisa', () => {
  const renderComponente = () =>
    render(
      <PrimeProvider>
        <LancamentosPesquisa />
      </PrimeProvider>
    );

  it('deve renderizar o título da página no documento', () => {
    renderComponente();
    const titulo = screen.getByRole('heading', { level: 1, name: /lançamentos/i });
    expect(titulo).toBeInTheDocument();
  });

  it('deve renderizar os cabeçalhos da tabela corretamente', () => {
    renderComponente();
    const headersEsperados = ['Pessoa', 'Descrição', 'Vencimento', 'Pagamento', 'Valor', 'Ações'];
    
    headersEsperados.forEach((header) => {
      expect(screen.getByRole('columnheader', { name: header })).toBeInTheDocument();
    });
  });

  it('deve renderizar as primeiras 5 linhas da tabela respeitando a paginação inicial', () => {
    renderComponente();
    const tbody = document.querySelector('.p-datatable-tbody');
    expect(tbody).not.toBeNull();
    const rows = tbody?.querySelectorAll('tr');
    expect(rows?.length).toBe(5);
  });

  it('deve aplicar classe text-danger para despesa e text-success para receita', () => {
    renderComponente();
    const firstRowValue = screen.getByText('R$ 4,55');
    expect(firstRowValue).toHaveClass('text-danger');

    const secondRowValue = screen.getByText('R$ 80.000,00');
    expect(secondRowValue).toHaveClass('text-success');
  });

  it('deve atualizar o filtro de descrição e pesquisar corretamente', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    renderComponente();

    const input = screen.getByPlaceholderText(/digite a descrição para pesquisar/i);
    const botaoPesquisar = screen.getByRole('button', { name: /pesquisar/i });

    fireEvent.change(input, { target: { value: 'Compra de pão' } });
    fireEvent.click(botaoPesquisar);

    expect(screen.getByText('Padaria do José')).toBeInTheDocument();
    expect(screen.queryByText('Venda de software')).not.toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('deve limpar os filtros e restaurar a lista ao clicar no botão Limpar', () => {
    renderComponente();

    const input = screen.getByPlaceholderText(/digite a descrição para pesquisar/i) as HTMLInputElement;
    const botaoPesquisar = screen.getByRole('button', { name: /pesquisar/i });
    const botaoLimpar = screen.getByRole('button', { name: /limpar/i });

    // Filtra para trazer apenas 1 item
    fireEvent.change(input, { target: { value: 'Compra de pão' } });
    fireEvent.click(botaoPesquisar);
    expect(screen.queryByText('Venda de software')).not.toBeInTheDocument();

    // Clica em limpar
    fireEvent.click(botaoLimpar);

    // O input deve estar vazio e a lista restaurada
    expect(input.value).toBe('');
    expect(screen.getByText('Venda de software')).toBeInTheDocument();
  });

  it('deve exibir mensagem de nenhum lançamento quando a busca não encontrar resultados', () => {
    renderComponente();

    const input = screen.getByPlaceholderText(/digite a descrição para pesquisar/i);
    const botaoPesquisar = screen.getByRole('button', { name: /pesquisar/i });

    fireEvent.change(input, { target: { value: 'Item Inexistente 999' } });
    fireEvent.click(botaoPesquisar);

    expect(screen.getByText('Nenhum lançamento encontrado.')).toBeInTheDocument();
  });
});
