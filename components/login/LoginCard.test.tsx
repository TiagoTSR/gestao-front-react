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

  it('deve renderizar o formulário de login com campos e-mail e senha', () => {
    renderComponent();

    expect(screen.getByRole('heading', { name: /gestão financeira/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('deve exibir mensagens de validação ao submeter formulário vazio', async () => {
    renderComponent();

    const btnEntrar = screen.getByRole('button', { name: /entrar/i });
    fireEvent.click(btnEntrar);

    expect(await screen.findByText('Informe o e-mail.')).toBeInTheDocument();
    expect(await screen.findByText('Informe a senha.')).toBeInTheDocument();
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it('deve autenticar com sucesso e redirecionar para /lancamentos', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      status: 200,
      data: {
        access_token: 'fake.jwt.token',
        token_type: 'Bearer',
        nome: 'Administrador',
        email: 'admin@example.com',
        permissoes: ['ROLE_CADASTRAR_CATEGORIA'],
      },
    });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'admin@example.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'admin' } });

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/login'),
        expect.objectContaining({
          email: 'admin@example.com',
          senha: 'admin',
        })
      );
      expect(mockPush).toHaveBeenCalledWith('/lancamentos');
      expect(localStorage.getItem('access_token')).toBe('fake.jwt.token');
      expect(localStorage.getItem('usuario_logado')).toContain('Administrador');
    });
  });

  it('deve exibir mensagem de erro quando o backend rejeitar com 401', async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: { status: 401, data: { mensagem: 'Credenciais inválidas' } },
    });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'admin@example.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'senha_incorreta' } });

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    expect(
      await screen.findByText(/e-mail ou senha inválidos/i)
    ).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });
});