'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tooltip } from 'primereact/tooltip';
import { Toast } from 'primereact/toast';
import { Lancamento, PageResult } from '@/models';
import { LancamentoService } from '@/services';

export function LancamentosPesquisa() {
  const router = useRouter();
  const toast = useRef<Toast>(null);

  const [descricaoFiltro, setDescricaoFiltro] = useState('');
  const [dataVencimentoDe, setDataVencimentoDe] = useState('');
  const [dataVencimentoAte, setDataVencimentoAte] = useState('');
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pagina, setPagina] = useState(0);
  const [linhas, setLinhas] = useState(5);

  const carregarLancamentos = useCallback(
    async (page = 0, size = 5) => {
      setLoading(true);
      try {
        const resultado: PageResult<Lancamento> = await LancamentoService.listar(
          {
            descricao: descricaoFiltro || undefined,
            data_vencimento_de: dataVencimentoDe || undefined,
            data_vencimento_ate: dataVencimentoAte || undefined,
          },
          {
            pagina: page,
            tamanho: size,
          }
        );
        setLancamentos(resultado.conteudo || []);
        setTotalRecords(resultado.total_elementos || 0);
      } catch (error) {
        console.error('Erro ao carregar lançamentos do backend:', error);
        toast.current?.show({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar os lançamentos.',
          life: 4000,
        });
      } finally {
        setLoading(false);
      }
    },
    [descricaoFiltro, dataVencimentoDe, dataVencimentoAte]
  );

  useEffect(() => {
    carregarLancamentos(pagina, linhas);
  }, [carregarLancamentos, pagina, linhas]);

  const handlePesquisar = (e: React.FormEvent) => {
    e.preventDefault();
    setPagina(0);
    carregarLancamentos(0, linhas);
  };

  const handleLimpar = () => {
    setDescricaoFiltro('');
    setDataVencimentoDe('');
    setDataVencimentoAte('');
    setPagina(0);
  };

  const handleExcluir = async (lancamento: Lancamento) => {
    if (!lancamento.id) return;
    if (!confirm(`Deseja realmente excluir o lançamento "${lancamento.descricao}"?`)) return;

    try {
      await LancamentoService.remover(lancamento.id);
      toast.current?.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Lançamento excluído com sucesso!',
        life: 3000,
      });
      carregarLancamentos(pagina, linhas);
    } catch (error) {
      console.error('Erro ao excluir lançamento:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao excluir o lançamento.',
        life: 4000,
      });
    }
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatarData = (dataIso?: string | null) => {
    if (!dataIso) return '-';
    // Se vier no formato yyyy-mm-dd
    const partes = dataIso.split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return dataIso;
  };

  const valorBodyTemplate = (rowData: Lancamento) => {
    const isDespesa = rowData.tipo === 'DESPESA';
    return (
      <span className={`font-bold ${isDespesa ? 'text-danger' : 'text-success'}`}>
        {formatarMoeda(rowData.valor)}
      </span>
    );
  };

  const acoesBodyTemplate = (rowData: Lancamento) => {
    return (
      <div className="flex justify-content-center gap-1">
        <Button
          type="button"
          icon="pi pi-pencil"
          rounded
          text
          size="small"
          aria-label="Editar"
          tooltip="Editar"
          tooltipOptions={{ position: 'top' }}
          onClick={() => rowData.id && router.push(`/lancamentos/${rowData.id}`)}
        />
        <Button
          type="button"
          icon="pi pi-trash"
          severity="danger"
          rounded
          text
          size="small"
          aria-label="Excluir"
          tooltip="Excluir"
          tooltipOptions={{ position: 'top' }}
          onClick={() => handleExcluir(rowData)}
        />
      </div>
    );
  };

  return (
    <div className="container py-4">
      <Toast ref={toast} />
      <Tooltip target=".p-button" />

      <div className="surface-card p-4 shadow-1 border-round">
        {/* Cabeçalho da Página */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-900 m-0">Lançamentos</h1>
          <span className="text-500 text-sm">Pesquise e gerencie suas receitas e despesas</span>
        </div>

        {/* Formulário de Pesquisa */}
        <form onSubmit={handlePesquisar} className="grid formgrid p-fluid">
          <div className="field col-12">
            <label htmlFor="descricao" className="font-semibold text-700 block mb-2">
              Descrição
            </label>
            <InputText
              id="descricao"
              value={descricaoFiltro}
              onChange={(e) => setDescricaoFiltro(e.target.value)}
              placeholder="Digite a descrição para pesquisar..."
            />
          </div>

          <div className="field col-12 flex flex-column md:flex-row md:align-items-end justify-content-between gap-3">
            <div className="flex flex-column gap-2">
              <label className="font-semibold text-700 block">Vencimento</label>
              <div className="flex align-items-center gap-2">
                <InputText
                  type="date"
                  value={dataVencimentoDe}
                  onChange={(e) => setDataVencimentoDe(e.target.value)}
                  style={{ width: '160px' }}
                />
                <span className="text-500 font-semibold">até</span>
                <InputText
                  type="date"
                  value={dataVencimentoAte}
                  onChange={(e) => setDataVencimentoAte(e.target.value)}
                  style={{ width: '160px' }}
                />
              </div>
            </div>

            {/* Ações alinhadas ao lado das datas */}
            <div className="flex align-items-center gap-2 flex-wrap mt-2 md:mt-0">
              <Button
                type="submit"
                label="Pesquisar"
                icon="pi pi-search"
                loading={loading}
                className="w-auto"
              />
              <Button
                type="button"
                icon="pi pi-filter-slash"
                label="Limpar"
                outlined
                severity="secondary"
                tooltip="Limpar filtros"
                tooltipOptions={{ position: 'top' }}
                onClick={handleLimpar}
                className="w-auto"
              />
              <Button
                type="button"
                label="Novo Lançamento"
                icon="pi pi-plus"
                severity="success"
                onClick={() => router.push('/lancamentos/novo')}
                className="w-auto"
              />
            </div>
          </div>
        </form>

        {/* Tabela de Dados */}
        <div className="mt-4">
          <DataTable
            value={lancamentos}
            loading={loading}
            paginator
            rows={linhas}
            totalRecords={totalRecords}
            rowsPerPageOptions={[5, 10, 20]}
            onPage={(e) => {
              setPagina(e.page ?? 0);
              setLinhas(e.rows);
            }}
            stripedRows
            showGridlines
            emptyMessage={
              <div className="text-center p-4 text-500 font-medium">
                Nenhum lançamento encontrado.
              </div>
            }
          >
            <Column
              field="pessoa.nome"
              header="Pessoa"
              body={(row: Lancamento) => row.pessoa?.nome || '-'}
            />
            <Column field="descricao" header="Descrição" />
            <Column
              field="data_vencimento"
              header="Vencimento"
              body={(row: Lancamento) => (
                <div className="text-center">{formatarData(row.data_vencimento)}</div>
              )}
              style={{ width: '140px' }}
            />
            <Column
              field="data_pagamento"
              header="Pagamento"
              body={(row: Lancamento) => (
                <div className="text-center">{formatarData(row.data_pagamento)}</div>
              )}
              style={{ width: '140px' }}
            />
            <Column
              field="valor"
              header="Valor"
              body={valorBodyTemplate}
              style={{ width: '150px' }}
            />
            <Column
              header="Ações"
              body={acoesBodyTemplate}
              style={{ width: '110px' }}
            />
          </DataTable>
        </div>
      </div>
    </div>
  );
}
