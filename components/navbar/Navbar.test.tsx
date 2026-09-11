import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Navbar } from './Navbar';
import { AuthProvider } from '../../context/AuthContext';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/',
}));

describe('Navbar', () => {
  beforeEach(() => {
    localStorage.setItem('usuario_logado', 'admin');
    localStorage.setItem('basic_auth', btoa('admin:admin'));
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    );

  it('deve criar o componente navbar e renderizar a marca "Gestão Financeira"', () => {
    renderComponent();
    expect(screen.getByText('Gestão Financeira')).toBeInTheDocument();
  });

  it('deve inicializar com o menu fechado e sem backdrop', () => {
    const { container } = renderComponent();
    const drawer = container.querySelector('.navbar-menu');
    expect(drawer).not.toHaveClass('navbar-menu-aberto');
    expect(screen.queryByTestId('navbar-backdrop')).not.toBeInTheDocument();
  });

  it('deve inicializar com o usuário logado correto', () => {
    renderComponent();
    expect(screen.getAllByText('admin').length).toBeGreaterThan(0);
  });

  it('deve alternar o estado do menu ao clicar no botão toggle', () => {
    const { container } = renderComponent();
    const toggleButton = screen.getByRole('button', { name: /alternar menu de navegação/i });
    const drawer = container.querySelector('.navbar-menu');

    // Abre o menu
    fireEvent.click(toggleButton);
    expect(drawer).toHaveClass('navbar-menu-aberto');
    expect(screen.getByTestId('navbar-backdrop')).toBeInTheDocument();

    // Fecha o menu clicando no toggle novamente
    fireEvent.click(toggleButton);
    expect(drawer).not.toHaveClass('navbar-menu-aberto');
    expect(screen.queryByTestId('navbar-backdrop')).not.toBeInTheDocument();
  });

  it('deve fechar o menu ao clicar no backdrop', () => {
    const { container } = renderComponent();
    const toggleButton = screen.getByRole('button', { name: /alternar menu de navegação/i });
    const drawer = container.querySelector('.navbar-menu');

    // Abre o menu
    fireEvent.click(toggleButton);
    expect(drawer).toHaveClass('navbar-menu-aberto');

    // Clica no backdrop
    const backdrop = screen.getByTestId('navbar-backdrop');
    fireEvent.click(backdrop);

    expect(drawer).not.toHaveClass('navbar-menu-aberto');
    expect(screen.queryByTestId('navbar-backdrop')).not.toBeInTheDocument();
  });

  it('deve fechar o menu ao clicar no botão de fechar dentro do menu', () => {
    const { container } = renderComponent();
    const toggleButton = screen.getByRole('button', { name: /alternar menu de navegação/i });
    const drawer = container.querySelector('.navbar-menu');

    // Abre o menu
    fireEvent.click(toggleButton);
    expect(drawer).toHaveClass('navbar-menu-aberto');

    // Clica no botão 'X' de fechar
    const btnFechar = screen.getByRole('button', { name: /fechar menu/i });
    fireEvent.click(btnFechar);

    expect(drawer).not.toHaveClass('navbar-menu-aberto');
  });

  it('deve fechar o menu ao clicar em um link de navegação', () => {
    const { container } = renderComponent();
    const toggleButton = screen.getByRole('button', { name: /alternar menu de navegação/i });
    const drawer = container.querySelector('.navbar-menu');

    // Abre o menu
    fireEvent.click(toggleButton);
    expect(drawer).toHaveClass('navbar-menu-aberto');

    // Clica no link Lançamentos dentro do menu
    const linkLancamentos = screen.getByRole('link', { name: /lançamentos/i });
    fireEvent.click(linkLancamentos);

    expect(drawer).not.toHaveClass('navbar-menu-aberto');
  });

  it('deve realizar logout ao clicar no link de logout', () => {
    renderComponent();
    const toggleButton = screen.getByRole('button', { name: /alternar menu de navegação/i });

    // Abre o menu
    fireEvent.click(toggleButton);

    const linkLogout = screen.getByRole('link', { name: /logout/i });
    fireEvent.click(linkLogout);

    expect(mockPush).toHaveBeenCalledWith('/login');
    expect(localStorage.getItem('usuario_logado')).toBeNull();
  });
});