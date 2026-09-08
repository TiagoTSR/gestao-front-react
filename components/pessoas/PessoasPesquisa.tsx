'use client';

import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tooltip } from 'primereact/tooltip';
import { Pessoa } from '../../types/pessoa';

const PESSOAS_INICIAIS: Pessoa[] = [
  { nome: 'Manoel Pinheiro', cidade: 'Uberlândia', estado: 'MG', ativo: true },
  { nome: 'Sebastião da Silva', cidade: 'São Paulo', estado: 'SP', ativo: false },
  { nome: 'Carla Souza', cidade: 'Florianópolis', estado: 'SC', ativo: true },
  { nome: 'Luís Pereira', cidade: 'Curitiba', estado: 'PR', ativo: true },
  { nome: 'Vilmar Andrade', cidade: 'Rio de Janeiro', estado: 'RJ', ativo: false },
  { nome: 'Paula Maria', cidade: 'Uberlândia', estado: 'MG', ativo: true },
];

export function PessoasPesquisa() {
  const [nomeFiltro, setNomeFiltro] = useState('');
  const [pessoas, setPessoas] = useState<Pessoa[]>(PESSOAS_INICIAIS);

  const handlePesquisar = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Pesquisando pessoas por nome:', nomeFiltro);

    if (!nomeFiltro.trim()) {
      setPessoas(PESSOAS_INICIAIS);
      return;
    }

    const filtradas = PESSOAS_INICIAIS.filter((p) =>
      p.nome.toLowerCase().includes(nomeFiltro.toLowerCase())
    );
    setPessoas(filtradas);
  };

  const handleLimpar = () => {
    setNomeFiltro('');
    setPessoas(PESSOAS_INICIAIS);
  };

  const alternarStatus = (pessoa: Pessoa) => {
    setPessoas((lista) =>
      lista.map((p) => (p === pessoa ? { ...p, ativo: !p.ativo } : p))
    );
  };

  const statusBodyTemplate = (rowData: Pessoa) => {
    const isAtivo = rowData.ativo;
    return (
      <a
        href="#"
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
              className="w-auto"
            />
          </div>
        </form>

        {/* Tabela de Dados */}
        <div className="mt-4">
          <DataTable
            value={pessoas}
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 20]}
            stripedRows
            showGridlines
            emptyMessage={
              <div className="text-center p-4 text-500 font-medium">
                Nenhuma pessoa encontrada.
              </div>
            }
          >
            <Column field="nome" header="Nome" />
            <Column field="cidade" header="Cidade" />
            <Column
              field="estado"
              header="Estado"
              body={(row) => <div className="text-center">{row.estado}</div>}
              style={{ width: '120px' }}
            />
            <Column
              header="Status"
              body={(row) => <div className="text-center">{statusBodyTemplate(row)}</div>}
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
