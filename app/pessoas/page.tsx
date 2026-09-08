import { PessoasPesquisa } from '../../components/pessoas/PessoasPesquisa';
import { Navbar } from '../../components/navbar/Navbar';

export const metadata = {
  title: 'Pessoas | Gestão Financeira',
  description: 'Pesquisa e gerenciamento de pessoas',
};

export default function PessoasPage() {
  return (
    <div className="min-h-screen flex flex-column">
      <Navbar />
      <PessoasPesquisa />
    </div>
  );
}
