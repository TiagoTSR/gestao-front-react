import { LancamentoCadastro } from '../../../components/lancamentos/LancamentoCadastro';
import { Navbar } from '../../../components/navbar/Navbar';

export const metadata = {
  title: 'Novo Lançamento | Gestão Financeira',
  description: 'Cadastro de novo lançamento financeiro',
};

export default function NovoLancamentoPage() {
  return (
    <div className="min-h-screen flex flex-column">
      <Navbar />
      <LancamentoCadastro />
    </div>
  );
}
