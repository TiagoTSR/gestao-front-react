import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PessoasPesquisa } from './PessoasPesquisa';
import { PrimeProvider } from '../providers/PrimeProvider';
import { PessoaService } from '@/services';
import { PageResult, Pessoa } from '@/models';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useParams: () => ({}),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

const MOCK_PESSOAS: PageResult<Pessoa> = {
  conteudo: [
    {
      id: 1,
      nome: 'Manoel Pinheiro',
      ativo: true,
      endereco: {
        logradouro: 'Rua A',
        bairro: 'Centro',
        cep: '38400-000',
        cidade: 'Uberlândia',
        estado: 'MG',
      },
    },
    {
      id: 2,
      nome: 'Sebastião da Silva',
      ativo: false,
      endereco: {
        logradouro: 'Av Paulista',
        bairro: 'Bela Vista',
        cep: '01310-000',
        cidade: 'São Paulo',
        estado: 'SP',
      },
    },
    {
      id: 3,
      nome: 'Carla Souza',
      ativo: true,
      endereco: {
        logradouro: 'Rua das Flores',
        bairro: 'Centro',
        cep: '88000-000',
        cidade: 'Florianópolis',
        estado: 'SC',
      },
    },
  ],
  pagina: 0,
  tamanho: 5,
  total_elementos: 3,
  total_paginas: 1,
};

describe('PessoasPesquisa', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockPush.mockReset();
    vi.spyOn(PessoaService, 'listar').mockResolvedValue(MOCK_PESSOAS);
    vi.spyOn(PessoaService, 'atualizarAtivo').mockResolvedValue();
  });

  const renderComponente = () =>
    render(
      <PrimeProvider>
        <PessoasPesquisa />
      </PrimeProvider>
    );

  it('deve criar o componente e renderizar o título da página', async () => {
    renderComponente();
    const titulo = await screen.findByRole('heading', { level: 1, name: /pessoas/i });
    expect(titulo).toBeInTheDocument();
  });

  it('deve renderizar os cabeçalhos da tabela corretamente', async () => {
    renderComponente();
    const headersEsperados = ['Nome', 'Cidade', 'Estado', 'Status', 'Ações'];

    for (const header of headersEsperados) {
      expect(await screen.findByRole('columnheader', { name: header })).toBeInTheDocument();
    }
  });

  it('deve renderizar as pessoas carregadas do serviço', async () => {
    renderComponente();

    expect(await screen.findByText('Manoel Pinheiro')).toBeInTheDocument();
    expect(await screen.findByText('Sebastião da Silva')).toBeInTheDocument();
    expect(await screen.findByText('Carla Souza')).toBeInTheDocument();
  });

  it('deve alternar status ao clicar no link de status da tabela', async () => {
    renderComponente();

    const nomeManoel = await screen.findByText('Manoel Pinheiro');
    expect(nomeManoel).toBeInTheDocument();

    const linkStatus = nomeManoel
      .closest('tr')
      ?.querySelector('a') as HTMLElement;

    expect(linkStatus).toHaveClass('status-ativo');
    expect(linkStatus.textContent?.trim()).toBe('Ativo');

    // Clica para desativar
    fireEvent.click(linkStatus);

    await waitFor(() => {
      expect(PessoaService.atualizarAtivo).toHaveBeenCalledWith(1, false);
      expect(linkStatus).toHaveClass('status-inativo');
    });
  });

  it('deve atualizar o filtro de nome e chamar o serviço ao pesquisar', async () => {
    renderComponente();

    const input = await screen.findByPlaceholderText(/digite o nome da pessoa/i);
    const botaoPesquisar = await screen.findByRole('button', { name: /pesquisar/i });

    fireEvent.change(input, { target: { value: 'Carla' } });
    fireEvent.click(botaoPesquisar);

    await waitFor(() => {
      expect(PessoaService.listar).toHaveBeenCalledWith(
        expect.objectContaining({ nome: 'Carla' }),
        expect.anything()
      );
    });
  });

  it('deve redirecionar para rota de edição de pessoa ao clicar no botão editar', async () => {
    renderComponente();

    expect(await screen.findByText('Manoel Pinheiro')).toBeInTheDocument();

    const editButtons = screen.getAllByRole('button', { name: /editar/i });
    expect(editButtons.length).toBeGreaterThan(0);

    fireEvent.click(editButtons[0]);

    expect(mockPush).toHaveBeenCalledWith('/pessoas/1');
  });
});
