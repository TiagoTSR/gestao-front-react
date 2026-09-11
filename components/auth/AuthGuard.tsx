'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { estaAutenticado, carregando } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Verifica se a rota atual e a tela de login
  const isLoginPage = pathname === '/login' || pathname === '/login/' || pathname?.startsWith('/login');

  useEffect(() => {
    if (!carregando && !estaAutenticado && !isLoginPage) {
      router.push('/login');
    }
  }, [estaAutenticado, carregando, isLoginPage, router]);

  // Na rota de login, renderiza o conteudo diretamente sem bloqueios
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Enquanto carrega o estado da sessao no cliente
  if (carregando) {
    return (
      <div className="flex align-items-center justify-content-center min-h-screen bg-slate-100">
        <div className="text-center">
          <i className="pi pi-spin pi-spinner text-4xl text-blue-600 mb-2"></i>
          <p className="text-slate-500 text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se nao esta autenticado, exibe spinner enquanto o router redireciona para o login
  if (!estaAutenticado) {
    return (
      <div className="flex align-items-center justify-content-center min-h-screen bg-slate-100">
        <div className="text-center">
          <i className="pi pi-spin pi-spinner text-4xl text-blue-600 mb-2"></i>
          <p className="text-slate-500 text-sm">Redirecionando para o login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}