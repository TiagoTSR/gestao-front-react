import { PessoaCadastro } from '../../../components/pessoas/PessoaCadastro';
import { Navbar } from '../../../components/navbar/Navbar';

export const metadata = {
  title: 'Edição de Pessoa | Gestão Financeira',
  description: 'Edição de cadastro de pessoa',
};

interface EditarPessoaPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarPessoaPage({ params }: EditarPessoaPageProps) {
  const { id } = await params;
  const idNumerico = id ? Number(id) : undefined;

  return (
    <div className="min-h-screen flex flex-column">
      <Navbar />
      <PessoaCadastro idProp={idNumerico} />
    </div>
  );
}

