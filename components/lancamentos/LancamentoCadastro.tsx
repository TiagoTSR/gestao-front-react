'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SelectButton } from 'primereact/selectbutton';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { LancamentoForm, TipoLancamento } from '../../types/lancamento';

export const TIPOS_LANCAMENTO: { label: string; value: TipoLancamento }[] = [
  { label: 'Receita', value: 'RECEITA' },
  { label: 'Despesa', value: 'DESPESA' },
];

export const CATEGORIAS_MOCK = [
  { label: 'Alimentação', value: 1 },
  { label: 'Transporte', value: 2 },
  { label: 'Saúde', value: 3 },
  { label: 'Educação', value: 4 },
];

export const PESSOAS_MOCK = [
  { label: 'João da Silva', value: 4 },
  { label: 'Sebastião Souza', value: 9 },
  { label: 'Maria Abadia', value: 3 },
];

const FORM_INICIAL: LancamentoForm = {
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
  onSalvar?: (lancamento: LancamentoForm) => void;
  onVoltar?: () => void;
}

export function LancamentoCadastro({ onSalvar, onVoltar }: LancamentoCadastroProps) {
  const router = useRouter();
  const [lancamento, setLancamento] = useState<LancamentoForm>(FORM_INICIAL);

  const salvar = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Salvando lançamento:', lancamento);
    if (onSalvar) {
      onSalvar(lancamento);
    }
  };

  const novo = () => {
    setLancamento(FORM_INICIAL);
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
      <div className="surface-card p-4 shadow-1 border-round">
        {/* Cabeçalho */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-900 m-0">Novo Lançamento</h1>
          <span className="text-500 text-sm">Preencha os dados do lançamento financeiro</span>
        </div>

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
                Vencimento
              </label>
              <Calendar
                id="vencimento"
                value={lancamento.dataVencimento}
                onChange={(e) =>
                  setLancamento((prev) => ({ ...prev, dataVencimento: e.value as Date | null }))
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
                  setLancamento((prev) => ({ ...prev, dataPagamento: e.value as Date | null }))
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
                Descrição
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
                Valor
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
                Categoria
              </label>
              <Dropdown
                id="categoria"
                value={lancamento.categoriaId}
                options={CATEGORIAS_MOCK}
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
                Pessoa
              </label>
              <Dropdown
                id="pessoa"
                value={lancamento.pessoaId}
                options={PESSOAS_MOCK}
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
      </div>
    </div>
  );
}
