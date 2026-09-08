'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export function Navbar() {
  const [exibindoMenu, setExibindoMenu] = useState(false);
  const [usuarioLogado] = useState('Tiago Silva');

  const alternarMenu = () => {
    setExibindoMenu((prev) => !prev);
  };

  const fecharMenu = () => {
    setExibindoMenu(false);
  };

  return (
    <nav className="navbar">
      <div className="container flex align-items-center justify-content-between">
        {/* Lado Esquerdo: Toggle e Logo */}
        <div className="flex align-items-center gap-3">
          <button
            type="button"
            className="navbar-toggle"
            onClick={alternarMenu}
            aria-label="Alternar menu de navegação"
          >
            <i className="pi pi-bars text-xl"></i>
          </button>

          <Link href="/" className="navbar-brand flex align-items-center gap-2 text-white no-underline">
            <i className="pi pi-wallet text-2xl text-white"></i>
            <span className="font-bold text-xl text-white">Gestão Financeira</span>
          </Link>
        </div>

        {/* Lado Direito: Nome do Usuário no Desktop */}
        <div className="hidden md:flex align-items-center gap-2 text-white">
          <i className="pi pi-user text-lg"></i>
          <span className="font-medium text-sm">{usuarioLogado}</span>
        </div>
      </div>

      {/* Backdrop Escuro (fecha ao clicar fora) */}
      {exibindoMenu && (
        <div
          className="navbar-backdrop"
          onClick={fecharMenu}
          data-testid="navbar-backdrop"
        />
      )}

      {/* Gaveta Lateral do Menu */}
      <aside className={`navbar-menu ${exibindoMenu ? 'navbar-menu-aberto' : ''}`}>
        {/* Cabeçalho do Menu com Usuário e Botão de Fechar */}
        <div className="navbar-usuario flex align-items-center justify-content-between">
          <div className="flex align-items-center gap-2">
            <i className="pi pi-user"></i>
            <span>{usuarioLogado}</span>
          </div>
          <button
            type="button"
            className="btn-fechar"
            onClick={fecharMenu}
            aria-label="Fechar menu"
          >
            <i className="pi pi-times"></i>
          </button>
        </div>

        {/* Itens de Navegação */}
        <ul className="navbar-menu-items">
          <li>
            <Link href="/lancamentos" onClick={fecharMenu}>
              <i className="pi pi-money-bill"></i>
              <span>Lançamentos</span>
            </Link>
          </li>
          <li>
            <Link href="/pessoas" onClick={fecharMenu}>
              <i className="pi pi-users"></i>
              <span>Pessoas</span>
            </Link>
          </li>
          <li className="item-logout">
            <a href="#" onClick={(e) => { e.preventDefault(); fecharMenu(); }}>
              <i className="pi pi-sign-out"></i>
              <span>Logout</span>
            </a>
          </li>
        </ul>
      </aside>
    </nav>
  );
}
