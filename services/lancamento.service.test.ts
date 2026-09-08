import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LancamentoService } from './lancamento.service';
import { api } from './api';
import { Lancamento, PageResult } from '@/models';

describe('LancamentoService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('deve ser criado', () => {
    expect(LancamentoService).toBeTruthy();
  });

  it('deve listar lançamentos com filtros e paginação (GET /lancamentos)', async () => {
    const mockResult: PageResult<Lancamento> = {
      conteudo: [
        {
          id: 1,
          descricao: 'Supermercado',
          data_vencimento: '2026-09-20',
          valor: 350.75,
          tipo: 'DESPESA',
          categoria: { id: 1, nome: 'Alimentação' },
          pessoa: { id: 1, nome: 'João Silva', ativo: true },
        },
      ],
      pagina: 0,
      tamanho: 5,
      total_elementos: 1,
      total_paginas: 1,
    };

    vi.spyOn(api, 'get').mockResolvedValueOnce({ data: mockResult });

    const resultado = await LancamentoService.listar(
      { descricao: 'Supermercado' },
      { pagina: 0, tamanho: 5 }
    );

    expect(api.get).toHaveBeenCalledWith('/lancamentos', {
      params: {
        descricao: 'Supermercado',
        pagina: 0,
        tamanho: 5,
      },
    });
    expect(resultado).toEqual(mockResult);
    expect(resultado.conteudo.length).toBe(1);
    expect(resultado.conteudo[0].descricao).toBe('Supermercado');
    expect(resultado.conteudo[0].valor).toBe(350.75);
  });

  it('deve buscar lançamento por ID (GET /lancamentos/1)', async () => {
    const mockLancamento: Lancamento = {
      id: 1,
      descricao: 'Supermercado',
      data_vencimento: '2026-09-20',
      valor: 350.75,
      tipo: 'DESPESA',
      categoria: { id: 1, nome: 'Alimentação' },
      pessoa: { id: 1, nome: 'João Silva', ativo: true },
    };

    vi.spyOn(api, 'get').mockResolvedValueOnce({ data: mockLancamento });

    const resultado = await LancamentoService.buscarPorId(1);

    expect(api.get).toHaveBeenCalledWith('/lancamentos/1');
    expect(resultado).toEqual(mockLancamento);
  });

  it('deve criar lançamento (POST /lancamentos)', async () => {
    const novoLancamento = {
      descricao: 'Padaria',
      data_vencimento: '2026-09-21',
      valor: 25.5,
      tipo: 'DESPESA' as const,
      categoria_id: 1,
      pessoa_id: 1,
    };
    const mockCriado: Lancamento = {
      id: 2,
      ...novoLancamento,
      categoria: { id: 1, nome: 'Alimentação' },
      pessoa: { id: 1, nome: 'João Silva', ativo: true },
    };

    vi.spyOn(api, 'post').mockResolvedValueOnce({ data: mockCriado });

    const resultado = await LancamentoService.criar(novoLancamento);

    expect(api.post).toHaveBeenCalledWith('/lancamentos', novoLancamento);
    expect(resultado).toEqual(mockCriado);
  });

  it('deve remover lançamento (DELETE /lancamentos/1)', async () => {
    vi.spyOn(api, 'delete').mockResolvedValueOnce({ data: null });

    await LancamentoService.remover(1);

    expect(api.delete).toHaveBeenCalledWith('/lancamentos/1');
  });
});
