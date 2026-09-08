import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PessoaCadastro } from './PessoaCadastro';
import { PrimeProvider } from '../providers/PrimeProvider';

describe('PessoaCadastro', () => {
  const renderComponente = (props = {}) =>
    render(
      <PrimeProvider>
        <PessoaCadastro {...props} />
      </PrimeProvider>
    );

  it('deve criar o componente e renderizar o título da página', () => {
    renderComponente();
    const titulo = screen.getByRole('heading', { level: 1, name: /nova pessoa/i });
    expect(titulo).toBeInTheDocument();
  });

  it('deve renderizar os botões Salvar, Novo e Voltar', () => {
    renderComponente();
    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /novo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /voltar/i })).toBeInTheDocument();
  });

  it('deve exibir mensagens de validação ao tentar submeter o formulário vazio', () => {
    renderComponente();

    const btnSalvar = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(btnSalvar);

    expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
    expect(screen.getByText('Informe o logradouro')).toBeInTheDocument();
    expect(screen.getByText('Número é obrigatório')).toBeInTheDocument();
    expect(screen.getByText('Informe o bairro')).toBeInTheDocument();
    expect(screen.getByText('Informe a cidade')).toBeInTheDocument();
    expect(screen.getByText('Informe o estado')).toBeInTheDocument();
  });

  it('deve chamar onSalvar quando o formulário for preenchido corretamente', () => {
    const onSalvarMock = vi.fn();
    const consoleSpy = vi.spyOn(console, 'log');
    renderComponente({ onSalvar: onSalvarMock });

    // Preenche campos obrigatórios
    fireEvent.change(screen.getByPlaceholderText(/digite o nome completo/i), {
      target: { value: 'Carlos Silva' },
    });
    fireEvent.change(screen.getByPlaceholderText(/ex: rua das flores/i), {
      target: { value: 'Rua das Flores' },
    });
    fireEvent.change(screen.getByPlaceholderText(/ex: 123/i), {
      target: { value: '100' },
    });
    fireEvent.change(screen.getByPlaceholderText(/ex: centro/i), {
      target: { value: 'Centro' },
    });
    fireEvent.change(screen.getByPlaceholderText(/ex: são paulo/i), {
      target: { value: 'São Paulo' },
    });
    fireEvent.change(screen.getByPlaceholderText(/ex: sp/i), {
      target: { value: 'SP' },
    });

    const btnSalvar = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(btnSalvar);

    expect(onSalvarMock).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Salvando pessoa:',
      expect.objectContaining({ nome: 'Carlos Silva', estado: 'SP' })
    );
    consoleSpy.mockRestore();
  });

  it('deve resetar o formulário ao clicar no botão Novo', () => {
    renderComponente();

    const inputNome = screen.getByPlaceholderText(/digite o nome completo/i) as HTMLInputElement;
    fireEvent.change(inputNome, { target: { value: 'Mariana Costa' } });
    expect(inputNome.value).toBe('Mariana Costa');

    const btnNovo = screen.getByRole('button', { name: /novo/i });
    fireEvent.click(btnNovo);

    expect(inputNome.value).toBe('');
  });

  it('deve chamar o callback onVoltar ao clicar no botão Voltar', () => {
    const onVoltarMock = vi.fn();
    const consoleSpy = vi.spyOn(console, 'log');
    renderComponente({ onVoltar: onVoltarMock });

    const btnVoltar = screen.getByRole('button', { name: /voltar/i });
    fireEvent.click(btnVoltar);

    expect(onVoltarMock).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Voltando para listagem de pessoas...');
    consoleSpy.mockRestore();
  });
});
