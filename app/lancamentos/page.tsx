import { LancamentosPesquisa } from '../../components/lancamentos/LancamentosPesquisa';
import { Navbar } from '../../components/navbar/Navbar';

export const metadata = {
  title: 'Lançamentos | Gestão Financeira',
  description: 'Pesquisa e gerenciamento de lançamentos financeiros',
};

export default function LancamentosPage() {
  return (
    <div className="min-h-screen flex flex-column">
      <Navbar />
      <LancamentosPesquisa />
    </div>
  );
}
