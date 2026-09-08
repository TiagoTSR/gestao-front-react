import { api } from './api';
import {
  Lancamento,
  CriarLancamentoRequest,
  AtualizarLancamentoRequest,
  LancamentoFilter,
  PageRequest,
  PageResult,
} from '@/models';

export const LancamentoService = {
  listar: async (
    filtro?: LancamentoFilter,
    paginacao?: PageRequest
  ): Promise<PageResult<Lancamento>> => {
    const params: Record<string, any> = {};

    if (filtro?.descricao) {
      params.descricao = filtro.descricao;
    }
    if (filtro?.data_vencimento_de) {
      params.data_vencimento_de = filtro.data_vencimento_de;
    }
    if (filtro?.data_vencimento_ate) {
      params.data_vencimento_ate = filtro.data_vencimento_ate;
    }
    if (filtro?.categoria_id !== undefined) {
      params.categoria_id = filtro.categoria_id;
    }
    if (filtro?.pessoa_id !== undefined) {
      params.pessoa_id = filtro.pessoa_id;
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

    const { data } = await api.get<PageResult<Lancamento>>('/lancamentos', { params });
    return data;
  },

  buscarPorId: async (id: number): Promise<Lancamento> => {
    const { data } = await api.get<Lancamento>(`/lancamentos/${id}`);
    return data;
  },

  criar: async (lancamento: CriarLancamentoRequest): Promise<Lancamento> => {
    const { data } = await api.post<Lancamento>('/lancamentos', lancamento);
    return data;
  },

  atualizar: async (
    id: number,
    lancamento: AtualizarLancamentoRequest
  ): Promise<Lancamento> => {
    const { data } = await api.put<Lancamento>(`/lancamentos/${id}`, lancamento);
    return data;
  },

  remover: async (id: number): Promise<void> => {
    await api.delete(`/lancamentos/${id}`);
  },
};
