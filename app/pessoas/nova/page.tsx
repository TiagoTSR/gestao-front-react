import { PessoaCadastro } from '../../../components/pessoas/PessoaCadastro';
import { Navbar } from '../../../components/navbar/Navbar';

export const metadata = {
  title: 'Nova Pessoa | Gestão Financeira',
  description: 'Cadastro de nova pessoa',
};

export default function NovaPessoaPage() {
  return (
    <div className="min-h-screen flex flex-column">
      <Navbar />
      <PessoaCadastro />
    </div>
  );
}
