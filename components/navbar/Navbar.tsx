'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-blue-600 text-white shadow-2 py-3 px-4 flex justify-content-between align-items-center">
      <Link href="/" className="flex align-items-center gap-2 text-white no-underline">
        <i className="pi pi-wallet text-2xl"></i>
        <span className="text-xl font-bold">Gestão Financeira</span>
      </Link>
      <nav className="flex align-items-center gap-4">
        <Link
          href="/lancamentos"
          className={`text-white no-underline hover:text-blue-200 flex align-items-center gap-2 ${
            isActive('/lancamentos') ? 'font-bold underline' : ''
          }`}
        >
          <i className="pi pi-list"></i> Lançamentos
        </Link>
        <Link
          href="/pessoas"
          className={`text-white no-underline hover:text-blue-200 flex align-items-center gap-2 ${
            isActive('/pessoas') ? 'font-bold underline' : ''
          }`}
        >
          <i className="pi pi-users"></i> Pessoas
        </Link>
        <Link
          href="/categorias"
          className={`text-white no-underline hover:text-blue-200 flex align-items-center gap-2 ${
            isActive('/categorias') ? 'font-bold underline' : ''
          }`}
        >
          <i className="pi pi-tags"></i> Categorias
        </Link>
      </nav>
    </header>
  );
}
