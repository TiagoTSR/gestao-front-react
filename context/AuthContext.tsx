'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

export interface UsuarioLogado {
  nome: string;
  email: string;
  permissoes: string[];
}

export interface AuthContextType {
  usuario: UsuarioLogado | null;
  nomeUsuario: string | null;
  token: string | null;
  refreshToken: string | null;
  estaAutenticado: boolean;
  carregando: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  temPermissao: (permissao: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);

  useEffect(() => {
    // Carrega sessao do localStorage no cliente
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('access_token');
      const storedRefresh = localStorage.getItem('refresh_token');
      const storedUser = localStorage.getItem('usuario_logado');
      if (storedToken && storedUser) {
        try {
          const parsedUser: UsuarioLogado = JSON.parse(storedUser);
          setToken(storedToken);
          setRefreshToken(storedRefresh);
          setUsuario(parsedUser);
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('usuario_logado');
        }
      }
    }
    setCarregando(false);
  }, []);

  const login = async (email: string, pass: string) => {
    const { data } = await axios.post(`${API_URL}/login`, {
      email: email.trim(),
      senha: pass.trim(),
    });

    const usuarioObj: UsuarioLogado = {
      nome: data.nome,
      email: data.email,
      permissoes: data.permissoes || [],
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', data.access_token);
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }
      localStorage.setItem('usuario_logado', JSON.stringify(usuarioObj));
    }

    setToken(data.access_token);
    setRefreshToken(data.refresh_token || null);
    setUsuario(usuarioObj);
  };

  const logout = () => {
    // 1. Limpa imediatamente o storage local e estado no cliente
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('usuario_logado');
      localStorage.removeItem('basic_auth');
    }
    setToken(null);
    setRefreshToken(null);
    setUsuario(null);

    // 2. Notifica o backend em segundo plano de forma silenciosa
    axios.post(`${API_URL}/auth/logout`).catch(() => {
      // Ignora erro de rede no logout
    });
  };

  const temPermissao = (permissao: string): boolean => {
    return usuario?.permissoes?.includes(permissao) ?? false;
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        nomeUsuario: usuario ? usuario.nome || usuario.email : null,
        token,
        refreshToken,
        estaAutenticado: !!token && !!usuario,
        carregando,
        login,
        logout,
        temPermissao,
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