import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PessoaService } from './pessoa.service';
import { api } from './api';
import { PageResult, Pessoa } from '@/models';

describe('PessoaService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('deve ser criado', () => {
    expect(PessoaService).toBeTruthy();
  });

  it('deve listar pessoas com paginação e filtros (GET /pessoas)', async () => {
    const mockResult: PageResult<Pessoa> = {
      conteudo: [{ id: 1, nome: 'João Silva', ativo: true }],
      pagina: 0,
      tamanho: 10,
      total_elementos: 1,
      total_paginas: 1,
    };

    vi.spyOn(api, 'get').mockResolvedValueOnce({ data: mockResult });

    const resultado = await PessoaService.listar(
      { nome: 'Silva', ativo: true },
      { pagina: 0, tamanho: 10 }
    );

    expect(api.get).toHaveBeenCalledWith('/pessoas', {
      params: {
        nome: 'Silva',
        ativo: true,
        pagina: 0,
        tamanho: 10,
      },
    });
    expect(resultado).toEqual(mockResult);
    expect(resultado.conteudo.length).toBe(1);
    expect(resultado.conteudo[0].nome).toBe('João Silva');
  });

  it('deve buscar pessoa por ID (GET /pessoas/1)', async () => {
    const mockPessoa: Pessoa = { id: 1, nome: 'João Silva', ativo: true };

    vi.spyOn(api, 'get').mockResolvedValueOnce({ data: mockPessoa });

    const resultado = await PessoaService.buscarPorId(1);

    expect(api.get).toHaveBeenCalledWith('/pessoas/1');
    expect(resultado).toEqual(mockPessoa);
  });

  it('deve alternar status ativo (PUT /pessoas/1/ativo)', async () => {
    vi.spyOn(api, 'put').mockResolvedValueOnce({ data: null });

    await PessoaService.atualizarAtivo(1, false);

    expect(api.put).toHaveBeenCalledWith('/pessoas/1/ativo', { ativo: false });
  });

  it('deve remover pessoa (DELETE /pessoas/1)', async () => {
    vi.spyOn(api, 'delete').mockResolvedValueOnce({ data: null });

    await PessoaService.remover(1);

    expect(api.delete).toHaveBeenCalledWith('/pessoas/1');
  });
});
