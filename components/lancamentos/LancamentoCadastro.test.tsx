import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  LancamentoCadastro,
  CATEGORIAS_MOCK,
  PESSOAS_MOCK,
} from './LancamentoCadastro';
import { PrimeProvider } from '../providers/PrimeProvider';

// Mock do useRouter do Next.js
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

describe('LancamentoCadastro', () => {
  const renderComponente = (props = {}) =>
    render(
      <PrimeProvider>
        <LancamentoCadastro {...props} />
      </PrimeProvider>
    );

  it('deve criar o componente e renderizar o título da página', () => {
    renderComponente();
    const titulo = screen.getByRole('heading', { level: 1, name: /novo lançamento/i });
    expect(titulo).toBeInTheDocument();
  });

  it('deve carregar as listas de categorias e pessoas', () => {
    expect(CATEGORIAS_MOCK.length).toBeGreaterThan(0);
    expect(PESSOAS_MOCK.length).toBeGreaterThan(0);
  });

  it('deve renderizar os botões Salvar, Novo e Voltar', () => {
    renderComponente();
    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /novo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /voltar/i })).toBeInTheDocument();
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
