import { api } from './api';
import {
  Categoria,
  CriarCategoriaRequest,
  AtualizarCategoriaRequest,
} from '@/models';

export const CategoriaService = {
  listar: async (): Promise<Categoria[]> => {
    const { data } = await api.get<Categoria[]>('/categorias');
    return data;
  },

  buscarPorId: async (id: number): Promise<Categoria> => {
    const { data } = await api.get<Categoria>(`/categorias/${id}`);
    return data;
  },

  criar: async (categoria: CriarCategoriaRequest): Promise<Categoria> => {
    const { data } = await api.post<Categoria>('/categorias', categoria);
    return data;
  },

  atualizar: async (id: number, categoria: AtualizarCategoriaRequest): Promise<Categoria> => {
    const { data } = await api.put<Categoria>(`/categorias/${id}`, categoria);
    return data;
  },

  remover: async (id: number): Promise<void> => {
    await api.delete(`/categorias/${id}`);
  },
};
