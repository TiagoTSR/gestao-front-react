import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CategoriaService } from './categoria.service';
import { api } from './api';
import { Categoria } from '@/models';

describe('CategoriaService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('deve ser criado', () => {
    expect(CategoriaService).toBeTruthy();
  });

  it('deve listar categorias (GET /categorias)', async () => {
    const mockCategorias: Categoria[] = [
      { id: 1, nome: 'Alimentação' },
      { id: 2, nome: 'Transporte' },
    ];

    vi.spyOn(api, 'get').mockResolvedValueOnce({ data: mockCategorias });

    const resultado = await CategoriaService.listar();

    expect(api.get).toHaveBeenCalledWith('/categorias');
    expect(resultado).toEqual(mockCategorias);
    expect(resultado.length).toBe(2);
  });

  it('deve buscar categoria por ID (GET /categorias/1)', async () => {
    const mockCategoria: Categoria = { id: 1, nome: 'Alimentação' };

    vi.spyOn(api, 'get').mockResolvedValueOnce({ data: mockCategoria });

    const resultado = await CategoriaService.buscarPorId(1);

    expect(api.get).toHaveBeenCalledWith('/categorias/1');
    expect(resultado).toEqual(mockCategoria);
  });

  it('deve criar categoria (POST /categorias)', async () => {
    const novaCategoria = { nome: 'Saúde' };
    const mockCriada: Categoria = { id: 3, nome: 'Saúde' };

    vi.spyOn(api, 'post').mockResolvedValueOnce({ data: mockCriada });

    const resultado = await CategoriaService.criar(novaCategoria);

    expect(api.post).toHaveBeenCalledWith('/categorias', novaCategoria);
    expect(resultado).toEqual(mockCriada);
  });

  it('deve atualizar categoria (PUT /categorias/1)', async () => {
    const dadosAtualizados = { nome: 'Saúde & Bem Estar' };
    const mockAtualizada: Categoria = { id: 1, nome: 'Saúde & Bem Estar' };

    vi.spyOn(api, 'put').mockResolvedValueOnce({ data: mockAtualizada });

    const resultado = await CategoriaService.atualizar(1, dadosAtualizados);

    expect(api.put).toHaveBeenCalledWith('/categorias/1', dadosAtualizados);
    expect(resultado).toEqual(mockAtualizada);
  });

  it('deve remover categoria (DELETE /categorias/1)', async () => {
    vi.spyOn(api, 'delete').mockResolvedValueOnce({ data: null });

    await CategoriaService.remover(1);

    expect(api.delete).toHaveBeenCalledWith('/categorias/1');
  });
});
