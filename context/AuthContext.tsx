'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface AuthContextType {
  usuario: string | null;
  estaAutenticado: boolean;
  carregando: boolean;
  login: (usuario: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<string | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);

  useEffect(() => {
    // Carrega sessao do localStorage no cliente
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('usuario_logado');
      const storedAuth = localStorage.getItem('basic_auth');
      if (storedUser && storedAuth) {
        setUsuario(storedUser);
      }
    }
    setCarregando(false);
  }, []);

  const login = async (user: string, pass: string) => {
    const credentials = btoa(`${user}:${pass}`);

    // Valida credenciais com uma chamada rapida ao backend
    await axios.get(`${API_URL}/categorias`, {
      params: { pagina: 0, tamanho: 1 },
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });

    // Se a chamada responder 200 OK, grava a sessao
    if (typeof window !== 'undefined') {
      localStorage.setItem('basic_auth', credentials);
      localStorage.setItem('usuario_logado', user);
    }
    setUsuario(user);
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('basic_auth');
      localStorage.removeItem('usuario_logado');
    }
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        estaAutenticado: !!usuario,
        carregando,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}