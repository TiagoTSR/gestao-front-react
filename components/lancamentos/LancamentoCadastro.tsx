'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { SelectButton } from 'primereact/selectbutton';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { TipoLancamento, CriarLancamentoRequest, AtualizarLancamentoRequest } from '@/models';
import { CategoriaService, PessoaService, LancamentoService } from '@/services';

export const TIPOS_LANCAMENTO: { label: string; value: TipoLancamento }[] = [
  { label: 'Receita', value: 'RECEITA' },
  { label: 'Despesa', value: 'DESPESA' },
];

export interface LancamentoFormState {
  id?: number;
  tipo: TipoLancamento;
  dataVencimento: Date | null;
  dataPagamento: Date | null;
  descricao: string;
  valor: number | null;
  categoriaId: number | null;
  pessoaId: number | null;
  observacao: string;
}

const FORM_INICIAL: LancamentoFormState = {
  tipo: 'DESPESA',
  dataVencimento: null,
  dataPagamento: null,
  descricao: '',
  valor: null,
  categoriaId: null,
  pessoaId: null,
  observacao: '',
};

interface LancamentoCadastroProps {
  idProp?: number;
  onSalvar?: (lancamento: LancamentoFormState) => void;
  onVoltar?: () => void;
}

export function LancamentoCadastro({ idProp, onSalvar, onVoltar }: LancamentoCadastroProps) {
  const router = useRouter();
  const params = useParams();
  const toast = useRef<Toast>(null);

  const lancamentoId = idProp ?? (params?.id ? Number(params.id) : undefined);
  const editando = Boolean(lancamentoId && !isNaN(lancamentoId));

  const [lancamento, setLancamento] = useState<LancamentoFormState>(FORM_INICIAL);
  const [categorias, setCategorias] = useState<{ label: string; value: number }[]>([]);
  const [pessoas, setPessoas] = useState<{ label: string; value: number }[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(false);

  // Carrega opções de categorias e pessoas
  useEffect(() => {
    async function carregarDropdowns() {
      try {
        const [listaCategorias, resultadoPessoas] = await Promise.all([
          CategoriaService.listar({ tamanho: 100 }),
          PessoaService.listar({}, { tamanho: 100 }),
        ]);

        const cats = Array.isArray(listaCategorias)
          ? listaCategorias
          : (listaCategorias as any)?.conteudo || [];

        setCategorias(
          cats.map((c: any) => ({
            label: c.nome,
            value: Number(c.id),
          }))
        );

        const pess = Array.isArray(resultadoPessoas)
          ? resultadoPessoas
          : (resultadoPessoas as any)?.conteudo || [];

        setPessoas(
          pess.map((p: any) => ({
            label: p.nome,
            value: Number(p.id),
          }))
        );
      } catch (error) {
        console.error('Erro ao carregar categorias ou pessoas:', error);
      }
    }

    carregarDropdowns();
  }, []);

  // Carrega dados do lançamento quando estiver em modo de edição
  useEffect(() => {
    if (!editando || !lancamentoId) {
      setLancamento(FORM_INICIAL);
      return;
    }

    async function carregarDadosLancamento() {
      setCarregando(true);
      try {
        const dados = await LancamentoService.buscarPorId(lancamentoId!);
        setLancamento({
          id: dados.id,
          tipo: dados.tipo || 'DESPESA',
          dataVencimento: dados.data_vencimento
            ? new Date(dados.data_vencimento + 'T00:00:00')
            : null,
          dataPagamento: dados.data_pagamento
            ? new Date(dados.data_pagamento + 'T00:00:00')
            : null,
          descricao: dados.descricao || '',
          valor: typeof dados.valor === 'string' ? parseFloat(dados.valor) : dados.valor,
          categoriaId:
            dados.categoria?.id !== undefined && dados.categoria?.id !== null
              ? Number(dados.categoria.id)
              : (dados as any).categoria_id
              ? Number((dados as any).categoria_id)
              : null,
          pessoaId:
            dados.pessoa?.id !== undefined && dados.pessoa?.id !== null
              ? Number(dados.pessoa.id)
              : (dados as any).pessoa_id
              ? Number((dados as any).pessoa_id)
              : null,
          observacao: dados.observacao || '',
        });
      } catch (error) {
        console.error('Erro ao buscar lançamento por ID:', error);
        toast.current?.show({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar os dados do lançamento para edição.',
          life: 4000,
        });
      } finally {
        setCarregando(false);
      }
    }

    carregarDadosLancamento();
  }, [editando, lancamentoId]);

  const formatarDataParaIso = (data: Date | null): string => {
    if (!data) return '';
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  };

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Salvando lançamento:', lancamento);

    if (onSalvar) {
      onSalvar(lancamento);
      return;
    }

    if (!lancamento.descricao.trim()) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Informe a descrição.',
        life: 3000,
      });
      return;
    }
    if (!lancamento.dataVencimento) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Informe a data de vencimento.',
        life: 3000,
      });
      return;
    }
    if (!lancamento.valor || lancamento.valor <= 0) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Informe um valor válido.',
        life: 3000,
      });
      return;
    }
    if (!lancamento.categoriaId) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione uma categoria.',
        life: 3000,
      });
      return;
    }
    if (!lancamento.pessoaId) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione uma pessoa.',
        life: 3000,
      });
      return;
    }

    setSalvando(true);
    try {
      const payload: CriarLancamentoRequest | AtualizarLancamentoRequest = {
        descricao: lancamento.descricao,
        data_vencimento: formatarDataParaIso(lancamento.dataVencimento),
        data_pagamento: lancamento.dataPagamento
          ? formatarDataParaIso(lancamento.dataPagamento)
          : null,
        valor: lancamento.valor,
        observacao: lancamento.observacao || null,
        tipo: lancamento.tipo,
        categoria_id: lancamento.categoriaId,
        pessoa_id: lancamento.pessoaId,
      };

      if (editando && lancamentoId) {
        await LancamentoService.atualizar(lancamentoId, payload);
        toast.current?.show({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Lançamento atualizado com sucesso!',
          life: 2500,
        });
      } else {
        await LancamentoService.criar(payload);
        toast.current?.show({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Lançamento cadastrado com sucesso!',
          life: 2500,
        });
      }

      setTimeout(() => {
        router.push('/lancamentos');
      }, 800);
    } catch (error) {
      console.error('Erro ao salvar lançamento:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível salvar o lançamento.',
        life: 4000,
      });
    } finally {
      setSalvando(false);
    }
  };

  const novo = () => {
    if (editando) {
      router.push('/lancamentos/novo');
    } else {
      setLancamento(FORM_INICIAL);
    }
  };

  const voltar = () => {
    console.log('Voltando para listagem...');
    if (onVoltar) {
      onVoltar();
    } else {
      router.push('/lancamentos');
    }
  };

  return (
    <div className="container py-4">
      <Toast ref={toast} />
      <div className="surface-card p-4 shadow-1 border-round">
        {/* Cabeçalho */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-900 m-0">
            {editando ? 'Edição de Lançamento' : 'Novo Lançamento'}
          </h1>
          <span className="text-500 text-sm">
            {editando
              ? 'Edite as informações do lançamento financeiro'
              : 'Preencha os dados do lançamento financeiro'}
          </span>
        </div>

        {carregando ? (
          <div className="flex align-items-center justify-content-center p-6 gap-2 text-600">
            <i className="pi pi-spin pi-spinner text-2xl text-blue-600"></i>
            <span>Carregando lançamento...</span>
          </div>
        ) : (
          <form onSubmit={salvar} className="p-fluid">
            <div className="grid formgrid">
              {/* Tipo: Receita ou Despesa */}
              <div className="field col-12 mb-3">
                <SelectButton
                  value={lancamento.tipo}
                  options={TIPOS_LANCAMENTO}
                  onChange={(e) =>
                    e.value && setLancamento((prev) => ({ ...prev, tipo: e.value }))
                  }
                  optionLabel="label"
                  optionValue="value"
                />
              </div>

              {/* Vencimento */}
              <div className="field col-12 md:col-3">
                <label htmlFor="vencimento" className="font-semibold text-700 block mb-2">
                  Vencimento *
                </label>
                <Calendar
                  id="vencimento"
                  value={lancamento.dataVencimento}
                  onChange={(e) =>
                    setLancamento((prev) => ({
                      ...prev,
                      dataVencimento: e.value as Date | null,
                    }))
                  }
                  dateFormat="dd/mm/yy"
                  showIcon
                  placeholder="dd/mm/aaaa"
                  className="w-full"
                />
              </div>

              {/* Pagamento / Recebimento */}
              <div className="field col-12 md:col-3">
                <label htmlFor="pagamento" className="font-semibold text-700 block mb-2">
                  {lancamento.tipo === 'RECEITA' ? 'Recebimento' : 'Pagamento'}
                </label>
                <Calendar
                  id="pagamento"
                  value={lancamento.dataPagamento}
                  onChange={(e) =>
                    setLancamento((prev) => ({
                      ...prev,
                      dataPagamento: e.value as Date | null,
                    }))
                  }
                  dateFormat="dd/mm/yy"
                  showIcon
                  placeholder="dd/mm/aaaa"
                  className="w-full"
                />
              </div>

              {/* Espaço em branco no desktop */}
              <div className="hidden md:block md:col-6"></div>

              {/* Descrição */}
              <div className="field col-12 md:col-9">
                <label htmlFor="descricao" className="font-semibold text-700 block mb-2">
                  Descrição *
                </label>
                <InputText
                  id="descricao"
                  value={lancamento.descricao}
                  onChange={(e) =>
                    setLancamento((prev) => ({ ...prev, descricao: e.target.value }))
                  }
                  placeholder="Ex: Mensalidade da escola"
                  className="w-full"
                />
              </div>

              {/* Valor */}
              <div className="field col-12 md:col-3">
                <label htmlFor="valor" className="font-semibold text-700 block mb-2">
                  Valor *
                </label>
                <InputNumber
                  id="valor"
                  value={lancamento.valor}
                  onValueChange={(e) =>
                    setLancamento((prev) => ({ ...prev, valor: e.value ?? null }))
                  }
                  mode="currency"
                  currency="BRL"
                  locale="pt-BR"
                  placeholder="R$ 0,00"
                  className="w-full"
                />
              </div>

              {/* Categoria */}
              <div className="field col-12 md:col-6">
                <label htmlFor="categoria" className="font-semibold text-700 block mb-2">
                  Categoria *
                </label>
                <Dropdown
                  id="categoria"
                  value={lancamento.categoriaId}
                  options={categorias}
                  onChange={(e) =>
                    setLancamento((prev) => ({ ...prev, categoriaId: e.value }))
                  }
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Selecione uma categoria"
                  className="w-full"
                />
              </div>

              {/* Pessoa */}
              <div className="field col-12 md:col-6">
                <label htmlFor="pessoa" className="font-semibold text-700 block mb-2">
                  Pessoa *
                </label>
                <Dropdown
                  id="pessoa"
                  value={lancamento.pessoaId}
                  options={pessoas}
                  onChange={(e) =>
                    setLancamento((prev) => ({ ...prev, pessoaId: e.value }))
                  }
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Selecione uma pessoa"
                  className="w-full"
                />
              </div>

              {/* Observação */}
              <div className="field col-12">
                <label htmlFor="observacao" className="font-semibold text-700 block mb-2">
                  Observação
                </label>
                <InputTextarea
                  id="observacao"
                  value={lancamento.observacao}
                  onChange={(e) =>
                    setLancamento((prev) => ({ ...prev, observacao: e.target.value }))
                  }
                  rows={3}
                  placeholder="Observações adicionais sobre o lançamento..."
                  className="w-full"
                />
              </div>

              {/* Botões de Ação */}
              <div className="col-12 mt-3 flex flex-wrap gap-2">
                <Button
                  type="submit"
                  label="Salvar"
                  icon="pi pi-check"
                  loading={salvando}
                  className="w-auto"
                />
                <Button
                  type="button"
                  label="Novo"
                  icon="pi pi-plus"
                  severity="info"
                  onClick={novo}
                  className="w-auto"
                />
                <Button
                  type="button"
                  label="Voltar"
                  icon="pi pi-arrow-left"
                  severity="secondary"
                  onClick={voltar}
                  className="w-auto"
                />
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
