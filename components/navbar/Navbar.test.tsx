import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Navbar } from './Navbar';

describe('Navbar', () => {
  it('deve criar o componente navbar e renderizar a marca "Gestão Financeira"', () => {
    render(<Navbar />);
    expect(screen.getByText('Gestão Financeira')).toBeInTheDocument();
  });

  it('deve inicializar com o menu fechado e sem backdrop', () => {
    const { container } = render(<Navbar />);
    const drawer = container.querySelector('.navbar-menu');
    expect(drawer).not.toHaveClass('navbar-menu-aberto');
    expect(screen.queryByTestId('navbar-backdrop')).not.toBeInTheDocument();
  });

  it('deve inicializar com o usuário logado correto', () => {
    render(<Navbar />);
    expect(screen.getAllByText('Tiago Silva').length).toBeGreaterThan(0);
  });

  it('deve alternar o estado do menu ao clicar no botão toggle', () => {
    const { container } = render(<Navbar />);
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
    const { container } = render(<Navbar />);
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
    const { container } = render(<Navbar />);
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
    const { container } = render(<Navbar />);
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
});
