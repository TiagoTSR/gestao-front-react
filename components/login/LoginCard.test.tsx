import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginCard } from './LoginCard';
import { AuthProvider } from '../../context/AuthContext';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/login',
}));

describe('LoginCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderComponent = () =>
    render(
      <AuthProvider>
        <LoginCard />
      </AuthProvider>
    );

  it('deve renderizar o formulário de login com campos usuário e senha', () => {
    renderComponent();

    expect(screen.getByRole('heading', { name: /gestão financeira/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/usuário/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('deve exibir mensagens de validação ao submeter formulário vazio', async () => {
    renderComponent();

    const btnEntrar = screen.getByRole('button', { name: /entrar/i });
    fireEvent.click(btnEntrar);

    expect(await screen.findByText('Informe o nome de usuário.')).toBeInTheDocument();
    expect(await screen.findByText('Informe a senha.')).toBeInTheDocument();
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it('deve autenticar com sucesso e redirecionar para /lancamentos', async () => {
    mockedAxios.get.mockResolvedValueOnce({ status: 200, data: {} });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/usuário/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'admin' } });

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/categorias'),
        expect.objectContaining({
          headers: {
            Authorization: `Basic ${btoa('admin:admin')}`,
          },
        })
      );
      expect(mockPush).toHaveBeenCalledWith('/lancamentos');
      expect(localStorage.getItem('usuario_logado')).toBe('admin');
      expect(localStorage.getItem('basic_auth')).toBe(btoa('admin:admin'));
    });
  });

  it('deve exibir mensagem de erro quando o backend rejeitar com 401', async () => {
    mockedAxios.get.mockRejectedValueOnce({
      response: { status: 401, data: { mensagem: 'Credenciais inválidas' } },
    });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/usuário/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'senha_incorreta' } });

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    expect(
      await screen.findByText(/usuário ou senha inválidos/i)
    ).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });
});