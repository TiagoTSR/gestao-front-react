'use client';

import { Navbar } from '../components/navbar/Navbar';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-column">
      <Navbar />

      {/* Conteúdo Principal com Grid PrimeFlex */}
      <main className="container py-5 flex-grow-1">
        <div className="grid">
          {/* Card de Receitas */}
          <div className="col-12 md:col-4">
            <div className="p-4 bg-white border-round-xl shadow-1 border-1 border-gray-100 flex flex-column gap-2">
              <div className="flex justify-content-between align-items-center">
                <span className="text-500 font-medium">Receitas</span>
                <span className="p-2 border-round-circle bg-green-50 text-green-600">
                  <i className="pi pi-arrow-up-right text-lg"></i>
                </span>
              </div>
              <span className="text-2xl font-bold text-900">R$ 135.000,00</span>
              <span className="text-xs text-500">Total do mês</span>
            </div>
          </div>

          {/* Card de Despesas */}
          <div className="col-12 md:col-4">
            <div className="p-4 bg-white border-round-xl shadow-1 border-1 border-gray-100 flex flex-column gap-2">
              <div className="flex justify-content-between align-items-center">
                <span className="text-500 font-medium">Despesas</span>
                <span className="p-2 border-round-circle bg-red-50 text-red-600">
                  <i className="pi pi-arrow-down-left text-lg"></i>
                </span>
              </div>
              <span className="text-2xl font-bold text-900">R$ 17.046,55</span>
              <span className="text-xs text-500">Total do mês</span>
            </div>
          </div>

          {/* Card de Saldo */}
          <div className="col-12 md:col-4">
            <div className="p-4 bg-white border-round-xl shadow-1 border-1 border-gray-100 flex flex-column gap-2">
              <div className="flex justify-content-between align-items-center">
                <span className="text-500 font-medium">Saldo Atual</span>
                <span className="p-2 border-round-circle bg-blue-50 text-blue-600">
                  <i className="pi pi-wallet text-lg"></i>
                </span>
              </div>
              <span className="text-2xl font-bold text-900">R$ 117.953,45</span>
              <span className="text-xs text-500">Consolidado</span>
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="mt-5 p-4 bg-white border-round-xl shadow-1 border-1 border-gray-100 flex flex-column md:flex-row justify-content-between align-items-center gap-3">
          <div>
            <h2 className="text-xl font-bold text-900 m-0">Acessar Lançamentos</h2>
            <p className="text-500 m-0 text-sm mt-1">Consulte todas as receitas e despesas cadastradas no sistema</p>
          </div>
          <Link
            href="/lancamentos"
            className="p-button p-component flex align-items-center gap-2 no-underline"
          >
            <i className="pi pi-list"></i>
            <span>Ir para Lançamentos</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
