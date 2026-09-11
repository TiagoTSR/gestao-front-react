'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Message } from '../message/Message';
import { PessoaForm, CriarPessoaRequest, AtualizarPessoaRequest } from '@/models';
import { PessoaService } from '@/services';

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
  idProp?: number;
  onSalvar?: (pessoa: PessoaForm) => void;
  onVoltar?: () => void;
}

export function PessoaCadastro({ idProp, onSalvar, onVoltar }: PessoaCadastroProps) {
  const router = useRouter();
  const params = useParams();
  const toast = useRef<Toast>(null);

  const pessoaId = idProp ?? (params?.id ? Number(params.id) : undefined);
  const editando = Boolean(pessoaId && !isNaN(pessoaId));

  const [pessoa, setPessoa] = useState<PessoaForm>(FORM_INICIAL);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!editando || !pessoaId) {
      setPessoa(FORM_INICIAL);
      return;
    }

    async function carregarDadosPessoa() {
      setCarregando(true);
      try {
        const p = await PessoaService.buscarPorId(pessoaId!);
        setPessoa({
          id: p.id,
          nome: p.nome || '',
          logradouro: p.endereco?.logradouro || '',
          numero: p.endereco?.numero || '',
          complemento: p.endereco?.complemento || '',
          bairro: p.endereco?.bairro || '',
          cep: p.endereco?.cep || '',
          cidade: p.endereco?.cidade || '',
          estado: p.endereco?.estado || '',
          ativo: p.ativo !== undefined ? p.ativo : true,
        });
      } catch (error) {
        console.error('Erro ao buscar pessoa por ID:', error);
        toast.current?.show({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar os dados da pessoa para edição.',
          life: 4000,
        });
      } finally {
        setCarregando(false);
      }
    }

    carregarDadosPessoa();
  }, [editando, pessoaId]);

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

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (isFormInvalid) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha todos os campos obrigatórios corretamente.',
        life: 3000,
      });
      return;
    }

    setSalvando(true);
    console.log('Salvando pessoa:', pessoa);
    try {
      if (onSalvar) {
        onSalvar(pessoa);
      } else {
        const payload: CriarPessoaRequest | AtualizarPessoaRequest = {
          nome: pessoa.nome.trim(),
          ativo: pessoa.ativo,
          endereco: {
            logradouro: pessoa.logradouro.trim(),
            numero: pessoa.numero?.trim() || null,
            complemento: pessoa.complemento?.trim() || null,
            bairro: pessoa.bairro.trim(),
            cep: pessoa.cep?.trim() || '00000-000',
            cidade: pessoa.cidade.trim(),
            estado: pessoa.estado.trim(),
          },
        };

        if (editando && pessoaId) {
          await PessoaService.atualizar(pessoaId, payload);
          toast.current?.show({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Pessoa atualizada com sucesso!',
            life: 2500,
          });
        } else {
          await PessoaService.criar(payload);
          toast.current?.show({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Pessoa cadastrada com sucesso!',
            life: 2500,
          });
        }

        setTimeout(() => {
          router.push('/pessoas');
        }, 800);
      }
    } catch (error) {
      console.error('Erro ao salvar pessoa:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível salvar os dados da pessoa.',
        life: 4000,
      });
    } finally {
      setSalvando(false);
    }
  };

  const novo = () => {
    if (editando) {
      router.push('/pessoas/nova');
    } else {
      setPessoa(FORM_INICIAL);
      setTouched({});
      setSubmitted(false);
    }
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
      <Toast ref={toast} />
      <div className="surface-card p-4 shadow-1 border-round">
        {/* Cabeçalho */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-900 m-0">
            {editando ? 'Edição de Pessoa' : 'Nova Pessoa'}
          </h1>
          <span className="text-500 text-sm">
            {editando
              ? 'Edite as informações de contato e endereço'
              : 'Cadastre e gerencie as informações de contato e endereço'}
          </span>
        </div>

        {carregando ? (
          <div className="flex align-items-center justify-content-center p-6 gap-2 text-600">
            <i className="pi pi-spin pi-spinner text-2xl text-blue-600"></i>
            <span>Carregando dados da pessoa...</span>
          </div>
        ) : (
          <form onSubmit={salvar} className="p-fluid">
            <div className="grid formgrid">
              {/* Nome */}
              <div className="field col-12">
                <label htmlFor="nome" className="font-semibold text-700 block mb-2">
                  Nome *
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
                  Logradouro *
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
                  Número *
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
                  Bairro *
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
                  onChange={(e: any) => {
                    const val = e?.value || e?.target?.value || '';
                    setPessoa((prev) => ({ ...prev, cep: val }));
                  }}
                  onInput={(e: any) => {
                    const val = e?.target?.value || e?.value || '';
                    setPessoa((prev) => ({ ...prev, cep: val }));
                  }}
                  placeholder="00000-000"
                  className="w-full"
                />
              </div>

              {/* Cidade */}
              <div className="field col-12 md:col-6">
                <label htmlFor="cidade" className="font-semibold text-700 block mb-2">
                  Cidade *
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
                  Estado (UF) *
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
                  loading={salvando}
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
        )}
      </div>
    </div>
  );
}
