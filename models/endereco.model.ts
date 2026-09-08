export interface Endereco {
  logradouro: string;
  numero?: string | null;
  complemento?: string | null;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
}
