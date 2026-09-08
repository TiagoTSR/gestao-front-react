'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tooltip } from 'primereact/tooltip';
import { Lancamento } from '../../types/lancamento';

const LANCAMENTOS_INICIAIS: Lancamento[] = [
  {
    tipo: 'DESPESA',
    descricao: 'Compra de pão',
    dataVencimento: '30/06/2017',
    dataPagamento: null,
    valor: 4.55,
    pessoa: 'Padaria do José',
  },
  {
    tipo: 'RECEITA',
    descricao: 'Venda de software',
    dataVencimento: '10/06/2017',
    dataPagamento: '09/06/2017',
    valor: 80000,
    pessoa: 'Atacado Brasil',
  },
  {
    tipo: 'DESPESA',
    descricao: 'Impostos',
    dataVencimento: '20/07/2017',
    dataPagamento: null,
    valor: 14312,
    pessoa: 'Ministério da Fazenda',
  },
  {
    tipo: 'DESPESA',
    descricao: 'Mensalidade de escola',
    dataVencimento: '05/06/2017',
    dataPagamento: '30/05/2017',
    valor: 800,
    pessoa: 'Escola Abelha Rainha',
  },
  {
    tipo: 'RECEITA',
    descricao: 'Venda de carro',
    dataVencimento: '18/08/2017',
    dataPagamento: null,
    valor: 55000,
    pessoa: 'Sebastião Souza',
  },
  {
    tipo: 'DESPESA',
    descricao: 'Aluguel',
    dataVencimento: '10/07/2017',
    dataPagamento: '09/07/2017',
    valor: 1750,
    pessoa: 'Casa Nova Imóveis',
  },
  {
    tipo: 'DESPESA',
    descricao: 'Mensalidade musculação',
    dataVencimento: '13/07/2017',
    dataPagamento: null,
    valor: 180,
    pessoa: 'Academia Top',
  },
];

export function LancamentosPesquisa() {
  const router = useRouter();
  const [descricaoFiltro, setDescricaoFiltro] = useState('');
  const [dataVencimentoDe, setDataVencimentoDe] = useState('');
  const [dataVencimentoAte, setDataVencimentoAte] = useState('');
  const [lancamentos, setLancamentos] = useState<Lancamento[]>(LANCAMENTOS_INICIAIS);

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handlePesquisar = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Pesquisando por:', {
      descricao: descricaoFiltro,
      de: dataVencimentoDe,
      ate: dataVencimentoAte,
    });

    if (!descricaoFiltro.trim()) {
      setLancamentos(LANCAMENTOS_INICIAIS);
      return;
    }

    const filtrados = LANCAMENTOS_INICIAIS.filter((l) =>
      l.descricao.toLowerCase().includes(descricaoFiltro.toLowerCase())
    );
    setLancamentos(filtrados);
  };

  const handleLimpar = () => {
    setDescricaoFiltro('');
    setDataVencimentoDe('');
    setDataVencimentoAte('');
    setLancamentos(LANCAMENTOS_INICIAIS);
  };

  const valorBodyTemplate = (rowData: Lancamento) => {
    const isDespesa = rowData.tipo === 'DESPESA';
    return (
      <span className={`font-bold ${isDespesa ? 'text-danger' : 'text-success'}`}>
        {formatarMoeda(rowData.valor)}
      </span>
    );
  };

  const pagamentoBodyTemplate = (rowData: Lancamento) => {
    return <span>{rowData.dataPagamento || '-'}</span>;
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
          onClick={() => console.log('Editar', rowData)}
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
          onClick={() => console.log('Excluir', rowData)}
        />
      </div>
    );
  };

  return (
    <div className="container py-4">
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
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 20]}
            stripedRows
            showGridlines
            emptyMessage={
              <div className="text-center p-4 text-500 font-medium">
                Nenhum lançamento encontrado.
              </div>
            }
          >
            <Column field="pessoa" header="Pessoa" />
            <Column field="descricao" header="Descrição" />
            <Column
              field="dataVencimento"
              header="Vencimento"
              body={(row) => <div className="text-center">{row.dataVencimento}</div>}
              style={{ width: '140px' }}
            />
            <Column
              field="dataPagamento"
              header="Pagamento"
              body={(row) => <div className="text-center">{pagamentoBodyTemplate(row)}</div>}
              style={{ width: '140px' }}
            />
            <Column
              field="valor"
              header="Valor"
              body={(row) => <div className="text-right">{valorBodyTemplate(row)}</div>}
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
