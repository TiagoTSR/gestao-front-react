export interface PageRequest {
  pagina?: number;
  tamanho?: number;
  ordenar_por?: string;
  direcao?: 'asc' | 'desc';
}

export interface PageResult<T> {
  conteudo: T[];
  pagina: number;
  tamanho: number;
  total_elementos: number;
  total_paginas: number;
}
