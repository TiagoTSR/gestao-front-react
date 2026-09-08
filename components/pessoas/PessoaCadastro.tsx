'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { Button } from 'primereact/button';
import { Message } from '../message/Message';
import { PessoaForm } from '../../types/pessoa';

const FORM_INICIAL: PessoaForm = {
  nome: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cep: '',
  cidade: '',
  estado: '',
  ativo: true,
};

interface PessoaCadastroProps {
  onSalvar?: (pessoa: PessoaForm) => void;
  onVoltar?: () => void;
}

export function PessoaCadastro({ onSalvar, onVoltar }: PessoaCadastroProps) {
  const router = useRouter();
  const [pessoa, setPessoa] = useState<PessoaForm>(FORM_INICIAL);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isTouched = (field: string) => touched[field] || submitted;

  // Validações
  const errors = {
    nomeRequired: !pessoa.nome.trim(),
    nomeMinLength: pessoa.nome.trim().length > 0 && pessoa.nome.trim().length < 5,
    logradouroRequired: !pessoa.logradouro.trim(),
    numeroRequired: !pessoa.numero.trim(),
    bairroRequired: !pessoa.bairro.trim(),
    cidadeRequired: !pessoa.cidade.trim(),
    cidadeMinLength: pessoa.cidade.trim().length > 0 && pessoa.cidade.trim().length < 3,
    estadoRequired: !pessoa.estado.trim(),
    estadoMinLength: pessoa.estado.trim().length > 0 && pessoa.estado.trim().length < 2,
  };

  const isFormInvalid =
    errors.nomeRequired ||
    errors.nomeMinLength ||
    errors.logradouroRequired ||
    errors.numeroRequired ||
    errors.bairroRequired ||
    errors.cidadeRequired ||
    errors.cidadeMinLength ||
    errors.estadoRequired ||
    errors.estadoMinLength;

  const salvar = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (isFormInvalid) {
      return;
    }

    console.log('Salvando pessoa:', pessoa);
    if (onSalvar) {
      onSalvar(pessoa);
    }
  };

  const novo = () => {
    setPessoa(FORM_INICIAL);
    setTouched({});
    setSubmitted(false);
  };

  const voltar = () => {
    console.log('Voltando para listagem de pessoas...');
    if (onVoltar) {
      onVoltar();
    } else {
      router.push('/pessoas');
    }
  };

  return (
    <div className="container py-4">
      <div className="surface-card p-4 shadow-1 border-round">
        {/* Cabeçalho */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-900 m-0">Nova Pessoa</h1>
          <span className="text-500 text-sm">
            Cadastre e gerencie as informações de contato e endereço
          </span>
        </div>

        <form onSubmit={salvar} className="p-fluid">
          <div className="grid formgrid">
            {/* Nome */}
            <div className="field col-12">
              <label htmlFor="nome" className="font-semibold text-700 block mb-2">
                Nome
              </label>
              <InputText
                id="nome"
                value={pessoa.nome}
                onChange={(e) => setPessoa((prev) => ({ ...prev, nome: e.target.value }))}
                onBlur={() => markTouched('nome')}
                maxLength={50}
                placeholder="Digite o nome completo"
                className="w-full"
              />
              <Message
                error={isTouched('nome') && errors.nomeRequired}
                text="Nome é obrigatório"
              />
              <Message
                error={isTouched('nome') && errors.nomeMinLength}
                text="Nome deve ter no mínimo 5 caracteres"
              />
            </div>

            {/* Logradouro */}
            <div className="field col-12 md:col-9">
              <label htmlFor="logradouro" className="font-semibold text-700 block mb-2">
                Logradouro
              </label>
              <InputText
                id="logradouro"
                value={pessoa.logradouro}
                onChange={(e) =>
                  setPessoa((prev) => ({ ...prev, logradouro: e.target.value }))
                }
                onBlur={() => markTouched('logradouro')}
                maxLength={50}
                placeholder="Ex: Rua das Flores, Av. Paulista"
                className="w-full"
              />
              <Message
                error={isTouched('logradouro') && errors.logradouroRequired}
                text="Informe o logradouro"
              />
            </div>

            {/* Número */}
            <div className="field col-12 md:col-3">
              <label htmlFor="numero" className="font-semibold text-700 block mb-2">
                Número
              </label>
              <InputText
                id="numero"
                value={pessoa.numero}
                onChange={(e) => setPessoa((prev) => ({ ...prev, numero: e.target.value }))}
                onBlur={() => markTouched('numero')}
                maxLength={10}
                placeholder="Ex: 123"
                className="w-full"
              />
              <Message
                error={isTouched('numero') && errors.numeroRequired}
                text="Número é obrigatório"
              />
            </div>

            {/* Complemento */}
            <div className="field col-12 md:col-4">
              <label htmlFor="complemento" className="font-semibold text-700 block mb-2">
                Complemento
              </label>
              <InputText
                id="complemento"
                value={pessoa.complemento}
                onChange={(e) =>
                  setPessoa((prev) => ({ ...prev, complemento: e.target.value }))
                }
                maxLength={50}
                placeholder="Ex: Apto 102, Bloco B"
                className="w-full"
              />
            </div>

            {/* Bairro */}
            <div className="field col-12 md:col-4">
              <label htmlFor="bairro" className="font-semibold text-700 block mb-2">
                Bairro
              </label>
              <InputText
                id="bairro"
                value={pessoa.bairro}
                onChange={(e) => setPessoa((prev) => ({ ...prev, bairro: e.target.value }))}
                onBlur={() => markTouched('bairro')}
                maxLength={50}
                placeholder="Ex: Centro"
                className="w-full"
              />
              <Message
                error={isTouched('bairro') && errors.bairroRequired}
                text="Informe o bairro"
              />
            </div>

            {/* CEP */}
            <div className="field col-12 md:col-4">
              <label htmlFor="cep" className="font-semibold text-700 block mb-2">
                CEP
              </label>
              <InputMask
                id="cep"
                mask="99999-999"
                value={pessoa.cep}
                onChange={(e) =>
                  setPessoa((prev) => ({ ...prev, cep: e.value || '' }))
                }
                placeholder="00000-000"
                className="w-full"
              />
            </div>

            {/* Cidade */}
            <div className="field col-12 md:col-6">
              <label htmlFor="cidade" className="font-semibold text-700 block mb-2">
                Cidade
              </label>
              <InputText
                id="cidade"
                value={pessoa.cidade}
                onChange={(e) => setPessoa((prev) => ({ ...prev, cidade: e.target.value }))}
                onBlur={() => markTouched('cidade')}
                maxLength={40}
                placeholder="Ex: São Paulo"
                className="w-full"
              />
              <Message
                error={isTouched('cidade') && errors.cidadeRequired}
                text="Informe a cidade"
              />
              <Message
                error={isTouched('cidade') && errors.cidadeMinLength}
                text="Cidade deve ter no mínimo 3 caracteres"
              />
            </div>

            {/* Estado */}
            <div className="field col-12 md:col-6">
              <label htmlFor="estado" className="font-semibold text-700 block mb-2">
                Estado (UF)
              </label>
              <InputText
                id="estado"
                value={pessoa.estado}
                onChange={(e) =>
                  setPessoa((prev) => ({
                    ...prev,
                    estado: e.target.value.toUpperCase(),
                  }))
                }
                onBlur={() => markTouched('estado')}
                maxLength={2}
                placeholder="Ex: SP"
                className="w-full"
              />
              <Message
                error={isTouched('estado') && errors.estadoRequired}
                text="Informe o estado"
              />
              <Message
                error={isTouched('estado') && errors.estadoMinLength}
                text="O estado deve ter 2 letras"
              />
            </div>

            {/* Botões de Ação */}
            <div className="col-12 mt-3 flex flex-wrap gap-2">
              <Button
                type="submit"
                label="Salvar"
                icon="pi pi-check"
                disabled={submitted && isFormInvalid}
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
