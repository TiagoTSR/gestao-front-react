import { api } from './api';
import {
  Pessoa,
  CriarPessoaRequest,
  AtualizarPessoaRequest,
  PessoaFilter,
  PageRequest,
  PageResult,
} from '@/models';

export const PessoaService = {
  listar: async (
    filtro?: PessoaFilter,
    paginacao?: PageRequest
  ): Promise<PageResult<Pessoa>> => {
    const params: Record<string, any> = {};

    if (filtro?.nome) {
      params.nome = filtro.nome;
    }
    if (filtro?.ativo !== undefined) {
      params.ativo = filtro.ativo;
    }
    if (paginacao?.pagina !== undefined) {
      params.pagina = paginacao.pagina;
    }
    if (paginacao?.tamanho !== undefined) {
      params.tamanho = paginacao.tamanho;
    }
    if (paginacao?.ordenar_por) {
      params.ordenar_por = paginacao.ordenar_por;
    }
    if (paginacao?.direcao) {
      params.direcao = paginacao.direcao;
    }

    const { data } = await api.get<PageResult<Pessoa>>('/pessoas', { params });
    return data;
  },

  buscarPorId: async (id: number): Promise<Pessoa> => {
    const { data } = await api.get<Pessoa>(`/pessoas/${id}`);
    return data;
  },

  criar: async (pessoa: CriarPessoaRequest): Promise<Pessoa> => {
    const { data } = await api.post<Pessoa>('/pessoas', pessoa);
    return data;
  },

  atualizar: async (id: number, pessoa: AtualizarPessoaRequest): Promise<Pessoa> => {
    const { data } = await api.put<Pessoa>(`/pessoas/${id}`, pessoa);
    return data;
  },

  atualizarAtivo: async (id: number, ativo: boolean): Promise<void> => {
    await api.put(`/pessoas/${id}/ativo`, { ativo });
  },

  remover: async (id: number): Promise<void> => {
    await api.delete(`/pessoas/${id}`);
  },
};
