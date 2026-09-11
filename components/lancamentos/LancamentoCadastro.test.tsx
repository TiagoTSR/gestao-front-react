import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LancamentoCadastro } from './LancamentoCadastro';
import { PrimeProvider } from '../providers/PrimeProvider';
import { CategoriaService, PessoaService, LancamentoService } from '@/services';

describe('LancamentoCadastro', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(CategoriaService, 'listar').mockResolvedValue([
      { id: 1, nome: 'Alimentação' },
      { id: 2, nome: 'Transporte' },
    ]);
    vi.spyOn(PessoaService, 'listar').mockResolvedValue({
      conteudo: [{ id: 1, nome: 'João da Silva', ativo: true }],
      pagina: 0,
      tamanho: 100,
      total_elementos: 1,
      total_paginas: 1,
    });
    vi.spyOn(LancamentoService, 'buscarPorId').mockResolvedValue({
      id: 1,
      tipo: 'DESPESA',
      descricao: 'Supermercado Mensal',
      data_vencimento: '2026-09-20',
      data_pagamento: '2026-09-18',
      valor: 450.5,
      observacao: 'Compras do mês',
      categoria: { id: 1, nome: 'Alimentação' },
      pessoa: { id: 1, nome: 'João da Silva', ativo: true },
    });
  });

  const renderComponente = (props = {}) =>
    render(
      <PrimeProvider>
        <LancamentoCadastro {...props} />
      </PrimeProvider>
    );

  it('deve criar o componente e renderizar o título da página no modo de criação', async () => {
    renderComponente();
    const titulo = await screen.findByRole('heading', { level: 1, name: /novo lançamento/i });
    expect(titulo).toBeInTheDocument();
  });

  it('deve carregar dados e exibir título de edição quando idProp for informado', async () => {
    renderComponente({ idProp: 1 });

    await waitFor(() => {
      expect(LancamentoService.buscarPorId).toHaveBeenCalledWith(1);
      expect(screen.getByRole('heading', { level: 1, name: /edição de lançamento/i })).toBeInTheDocument();
      expect(screen.getByDisplayValue('Supermercado Mensal')).toBeInTheDocument();
    });
  });

  it('deve carregar as listas de categorias e pessoas do serviço', async () => {
    renderComponente();
    await waitFor(() => {
      expect(CategoriaService.listar).toHaveBeenCalled();
      expect(PessoaService.listar).toHaveBeenCalled();
    });
  });

  it('deve renderizar os botões Salvar, Novo e Voltar', async () => {
    renderComponente();
    expect(await screen.findByRole('button', { name: /salvar/i })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /novo/i })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /voltar/i })).toBeInTheDocument();
  });

  it('deve chamar a função onSalvar ao submeter o formulário', () => {
    const onSalvarMock = vi.fn();
    const consoleSpy = vi.spyOn(console, 'log');
    renderComponente({ onSalvar: onSalvarMock });

    const btnSalvar = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(btnSalvar);

    expect(onSalvarMock).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Salvando lançamento:',
      expect.objectContaining({ tipo: 'DESPESA' })
    );
    consoleSpy.mockRestore();
  });

  it('deve resetar o formulário ao clicar no botão Novo', () => {
    renderComponente();

    const inputDescricao = screen.getByPlaceholderText(/ex: mensalidade da escola/i) as HTMLInputElement;
    fireEvent.change(inputDescricao, { target: { value: 'Compra de Notebook' } });
    expect(inputDescricao.value).toBe('Compra de Notebook');

    const btnNovo = screen.getByRole('button', { name: /novo/i });
    fireEvent.click(btnNovo);

    expect(inputDescricao.value).toBe('');
  });

  it('deve chamar o callback onVoltar ao clicar no botão Voltar', () => {
    const onVoltarMock = vi.fn();
    const consoleSpy = vi.spyOn(console, 'log');
    renderComponente({ onVoltar: onVoltarMock });

    const btnVoltar = screen.getByRole('button', { name: /voltar/i });
    fireEvent.click(btnVoltar);

    expect(onVoltarMock).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Voltando para listagem...');
    consoleSpy.mockRestore();
  });
});
