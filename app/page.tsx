'use client';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-column">
      {/* Navbar Superior */}
      <header className="bg-blue-600 text-white shadow-2 py-3 px-4 flex justify-content-between align-items-center">
        <div className="flex align-items-center gap-2">
          <i className="pi pi-wallet text-2xl"></i>
          <span className="text-xl font-bold">Gestão Financeira</span>
        </div>
        <nav className="flex align-items-center gap-4">
          <a href="#" className="text-white no-underline hover:text-blue-200 flex align-items-center gap-2">
            <i className="pi pi-list"></i> Lançamentos
          </a>
          <a href="#" className="text-white no-underline hover:text-blue-200 flex align-items-center gap-2">
            <i className="pi pi-users"></i> Pessoas
          </a>
          <a href="#" className="text-white no-underline hover:text-blue-200 flex align-items-center gap-2">
            <i className="pi pi-tags"></i> Categorias
          </a>
        </nav>
      </header>

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
              <span className="text-2xl font-bold text-900">R$ 0,00</span>
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
              <span className="text-2xl font-bold text-900">R$ 0,00</span>
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
              <span className="text-2xl font-bold text-900">R$ 0,00</span>
              <span className="text-xs text-500">Consolidado</span>
            </div>
          </div>
        </div>

        {/* Seção Informativa de Status */}
        <div className="mt-5 p-4 bg-white border-round-xl shadow-1 border-1 border-gray-100">
          <div className="flex align-items-center gap-3 mb-3">
            <i className="pi pi-check-circle text-green-500 text-2xl"></i>
            <h2 className="text-lg font-semibold text-900 m-0">Ambiente React Configurado</h2>
          </div>
          <p className="text-600 line-height-3 m-0">
            Os estilos do <strong>PrimeIcons</strong>, <strong>PrimeFlex</strong> e <strong>PrimeReact</strong> estão ativos e prontos para uso no Next.js App Router.
          </p>
        </div>
      </main>
    </div>
  );
}
