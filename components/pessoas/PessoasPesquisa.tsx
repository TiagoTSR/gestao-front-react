'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tooltip } from 'primereact/tooltip';
import { Toast } from 'primereact/toast';
import { Pessoa, PageResult } from '@/models';
import { PessoaService } from '@/services';

export function PessoasPesquisa() {
  const router = useRouter();
  const toast = useRef<Toast>(null);

  const [nomeFiltro, setNomeFiltro] = useState('');
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pagina, setPagina] = useState(0);
  const [linhas, setLinhas] = useState(5);

  const carregarPessoas = useCallback(
    async (page = 0, size = 5) => {
      setLoading(true);
      try {
        const resultado: PageResult<Pessoa> = await PessoaService.listar(
          {
            nome: nomeFiltro || undefined,
          },
          {
            pagina: page,
            tamanho: size,
          }
        );
        setPessoas(resultado.conteudo || []);
        setTotalRecords(resultado.total_elementos || 0);
      } catch (error) {
        console.error('Erro ao carregar pessoas do backend:', error);
        toast.current?.show({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar as pessoas.',
          life: 4000,
        });
      } finally {
        setLoading(false);
      }
    },
    [nomeFiltro]
  );

  useEffect(() => {
    carregarPessoas(pagina, linhas);
  }, [carregarPessoas, pagina, linhas]);

  const handlePesquisar = (e: React.FormEvent) => {
    e.preventDefault();
    setPagina(0);
    carregarPessoas(0, linhas);
  };

  const handleLimpar = () => {
    setNomeFiltro('');
    setPagina(0);
  };

  const alternarStatus = async (pessoa: Pessoa) => {
    if (!pessoa.id) return;
    const novoStatus = !pessoa.ativo;

    try {
      await PessoaService.atualizarAtivo(pessoa.id, novoStatus);
      setPessoas((lista) =>
        lista.map((p) => (p.id === pessoa.id ? { ...p, ativo: novoStatus } : p))
      );
      toast.current?.show({
        severity: 'info',
        summary: 'Status Atualizado',
        detail: `Pessoa "${pessoa.nome}" ${novoStatus ? 'ativada' : 'desativada'} com sucesso!`,
        life: 3000,
      });
    } catch (error) {
      console.error('Erro ao alternar status da pessoa:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível alterar o status da pessoa.',
        life: 4000,
      });
    }
  };

  const handleExcluir = async (pessoa: Pessoa) => {
    if (!pessoa.id) return;
    if (!confirm(`Deseja realmente excluir a pessoa "${pessoa.nome}"?`)) return;

    try {
      await PessoaService.remover(pessoa.id);
      toast.current?.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Pessoa excluída com sucesso!',
        life: 3000,
      });
      carregarPessoas(pagina, linhas);
    } catch (error) {
      console.error('Erro ao excluir pessoa:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao excluir a pessoa. Verifique se ela possui lançamentos vinculados.',
        life: 4000,
      });
    }
  };

  const statusBodyTemplate = (rowData: Pessoa) => {
    const isAtivo = rowData.ativo;
    return (
      <a
        href="javascript:void(0)"
        onClick={(e) => {
          e.preventDefault();
          alternarStatus(rowData);
        }}
        className={isAtivo ? 'status-ativo' : 'status-inativo'}
        data-pr-tooltip={isAtivo ? 'Clique para desativar' : 'Clique para ativar'}
        data-pr-position="top"
      >
        {isAtivo ? 'Ativo' : 'Inativo'}
      </a>
    );
  };

  const acoesBodyTemplate = (rowData: Pessoa) => {
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
          onClick={() => rowData.id && router.push(`/pessoas/${rowData.id}`)}
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
      <Tooltip target="[data-pr-tooltip], .p-button" />

      <div className="surface-card p-4 shadow-1 border-round">
        {/* Cabeçalho da Página */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-900 m-0">Pessoas</h1>
          <span className="text-500 text-sm">Pesquise e gerencie o cadastro de pessoas</span>
        </div>

        {/* Formulário de Pesquisa */}
        <form onSubmit={handlePesquisar} className="grid formgrid p-fluid">
          <div className="field col-12">
            <label htmlFor="nome" className="font-semibold text-700 block mb-2">
              Nome
            </label>
            <InputText
              id="nome"
              value={nomeFiltro}
              onChange={(e) => setNomeFiltro(e.target.value)}
              placeholder="Digite o nome da pessoa para pesquisar..."
            />
          </div>

          <div className="col-12 mt-2 flex flex-wrap gap-2">
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
              label="Nova Pessoa"
              icon="pi pi-plus"
              severity="success"
              onClick={() => router.push('/pessoas/nova')}
              className="w-auto"
            />
          </div>
        </form>

        {/* Tabela de Dados */}
        <div className="mt-4">
          <DataTable
            value={pessoas}
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
                Nenhuma pessoa encontrada.
              </div>
            }
          >
            <Column field="nome" header="Nome" />
            <Column
              field="endereco.cidade"
              header="Cidade"
              body={(row: Pessoa) => row.endereco?.cidade || '-'}
            />
            <Column
              field="endereco.estado"
              header="Estado"
              body={(row: Pessoa) => (
                <div className="text-center">{row.endereco?.estado || '-'}</div>
              )}
              style={{ width: '120px' }}
            />
            <Column
              header="Status"
              body={statusBodyTemplate}
              style={{ width: '130px' }}
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
