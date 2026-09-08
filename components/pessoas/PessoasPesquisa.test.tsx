import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PessoasPesquisa } from './PessoasPesquisa';
import { PrimeProvider } from '../providers/PrimeProvider';

describe('PessoasPesquisa', () => {
  const renderComponente = () =>
    render(
      <PrimeProvider>
        <PessoasPesquisa />
      </PrimeProvider>
    );

  it('deve criar o componente e renderizar o título da página', () => {
    renderComponente();
    const titulo = screen.getByRole('heading', { level: 1, name: /pessoas/i });
    expect(titulo).toBeInTheDocument();
  });

  it('deve renderizar os cabeçalhos da tabela corretamente', () => {
    renderComponente();
    const headersEsperados = ['Nome', 'Cidade', 'Estado', 'Status', 'Ações'];

    headersEsperados.forEach((header) => {
      expect(screen.getByRole('columnheader', { name: header })).toBeInTheDocument();
    });
  });

  it('deve renderizar 5 linhas na tabela respeitando a paginação inicial', () => {
    renderComponente();
    const tbody = document.querySelector('.p-datatable-tbody');
    expect(tbody).not.toBeNull();
    const rows = tbody?.querySelectorAll('tr');
    expect(rows?.length).toBe(5);
  });

  it('deve aplicar classe status-ativo para pessoas ativas e status-inativo para inativas', () => {
    renderComponente();

    // Primeira pessoa é Ativo ('Manoel Pinheiro')
    const statusAtivo = screen.getByText('Manoel Pinheiro')
      .closest('tr')
      ?.querySelector('.status-ativo');
    expect(statusAtivo).toBeInTheDocument();
    expect(statusAtivo?.textContent?.trim()).toBe('Ativo');

    // Segunda pessoa é Inativo ('Sebastião da Silva')
    const statusInativo = screen.getByText('Sebastião da Silva')
      .closest('tr')
      ?.querySelector('.status-inativo');
    expect(statusInativo).toBeInTheDocument();
    expect(statusInativo?.textContent?.trim()).toBe('Inativo');
  });

  it('deve alternar status ao clicar no link de status da tabela', () => {
    renderComponente();

    const linkStatus = screen.getByText('Manoel Pinheiro')
      .closest('tr')
      ?.querySelector('a') as HTMLElement;

    expect(linkStatus).toHaveClass('status-ativo');
    expect(linkStatus.textContent?.trim()).toBe('Ativo');

    // Clica para desativar
    fireEvent.click(linkStatus);
    expect(linkStatus).toHaveClass('status-inativo');
    expect(linkStatus.textContent?.trim()).toBe('Inativo');

    // Clica para ativar novamente
    fireEvent.click(linkStatus);
    expect(linkStatus).toHaveClass('status-ativo');
    expect(linkStatus.textContent?.trim()).toBe('Ativo');
  });

  it('deve atualizar o filtro de nome e pesquisar corretamente', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    renderComponente();

    const input = screen.getByPlaceholderText(/digite o nome da pessoa/i);
    const botaoPesquisar = screen.getByRole('button', { name: /pesquisar/i });

    fireEvent.change(input, { target: { value: 'Carla' } });
    fireEvent.click(botaoPesquisar);

    expect(screen.getByText('Carla Souza')).toBeInTheDocument();
    expect(screen.queryByText('Manoel Pinheiro')).not.toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalledWith('Pesquisando pessoas por nome:', 'Carla');
    consoleSpy.mockRestore();
  });

  it('deve limpar os filtros e restaurar a lista ao clicar no botão Limpar', () => {
    renderComponente();

    const input = screen.getByPlaceholderText(/digite o nome da pessoa/i) as HTMLInputElement;
    const botaoPesquisar = screen.getByRole('button', { name: /pesquisar/i });
    const botaoLimpar = screen.getByRole('button', { name: /limpar/i });

    // Filtra para trazer apenas 1
    fireEvent.change(input, { target: { value: 'Carla' } });
    fireEvent.click(botaoPesquisar);
    expect(screen.queryByText('Manoel Pinheiro')).not.toBeInTheDocument();

    // Limpa o filtro
    fireEvent.click(botaoLimpar);
    expect(input.value).toBe('');
    expect(screen.getByText('Manoel Pinheiro')).toBeInTheDocument();
  });

  it('deve renderizar os botões de ação (editar e excluir) nas linhas', () => {
    renderComponente();

    const editButtons = screen.getAllByRole('button', { name: /editar/i });
    const deleteButtons = screen.getAllByRole('button', { name: /excluir/i });

    expect(editButtons.length).toBeGreaterThan(0);
    expect(deleteButtons.length).toBeGreaterThan(0);
  });
});
