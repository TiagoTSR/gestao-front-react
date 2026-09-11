'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useAuth } from '../../context/AuthContext';

export function LoginCard() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [submetido, setSubmetido] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmetido(true);
    setErro(null);

    if (!usuario.trim() || !senha.trim()) {
      return;
    }

    try {
      setCarregando(true);
      await login(usuario.trim(), senha.trim());
      router.push('/lancamentos');
    } catch {
      setErro('Usuário ou senha inválidos. Verifique suas credenciais.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="flex align-items-center justify-content-center min-h-screen px-3 py-6 bg-slate-100">
      <div className="surface-card p-5 shadow-2 border-round w-full sm:w-30rem">
        {/* Cabeçalho do Card */}
        <div className="text-center mb-5">
          <div className="inline-flex align-items-center justify-content-center bg-blue-100 border-circle w-4rem h-4rem mb-3">
            <i className="pi pi-wallet text-blue-600 text-3xl"></i>
          </div>
          <h1 className="text-900 font-bold text-2xl mb-2">Gestão Financeira</h1>
          <p className="text-600 font-medium text-sm">Entre com suas credenciais para acessar</p>
        </div>

        {/* Alerta de Erro */}
        {erro && (
          <div
            className="p-3 mb-4 bg-red-100 border-round text-red-700 text-sm flex align-items-center gap-2"
            role="alert"
            data-testid="alerta-erro"
          >
            <i className="pi pi-exclamation-circle text-lg"></i>
            <span>{erro}</span>
          </div>
        )}

        {/* Formulário de Login */}
        <form onSubmit={handleLogin} className="flex flex-column gap-4" noValidate>
          <div className="flex flex-column gap-2">
            <label htmlFor="usuario" className="font-semibold text-slate-700 text-sm">
              Usuário *
            </label>
            <div className="p-input-icon-left w-full">
              <i className="pi pi-user text-slate-400" />
              <InputText
                id="usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Ex: admin"
                className={`w-full ${submetido && !usuario.trim() ? 'p-invalid' : ''}`}
                autoComplete="username"
                disabled={carregando}
              />
            </div>
            {submetido && !usuario.trim() && (
              <small className="p-error">Informe o nome de usuário.</small>
            )}
          </div>

          <div className="flex flex-column gap-2">
            <label htmlFor="senha" className="font-semibold text-slate-700 text-sm">
              Senha *
            </label>
            <div className="p-input-icon-left w-full">
              <i className="pi pi-lock text-slate-400" />
              <InputText
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Ex: admin"
                className={`w-full ${submetido && !senha.trim() ? 'p-invalid' : ''}`}
                autoComplete="current-password"
                disabled={carregando}
              />
            </div>
            {submetido && !senha.trim() && (
              <small className="p-error">Informe a senha.</small>
            )}
          </div>

          <Button
            type="submit"
            label={carregando ? 'Entrando...' : 'Entrar'}
            icon={carregando ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'}
            className="w-full mt-2"
            loading={carregando}
            disabled={carregando}
          />
        </form>

        <div className="mt-4 text-center">
          <span className="text-xs text-slate-400">
            Credenciais padrão: <strong>admin</strong> / <strong>admin</strong>
          </span>
        </div>
      </div>
    </div>
  );
}