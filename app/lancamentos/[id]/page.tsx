import { LancamentoCadastro } from '../../../components/lancamentos/LancamentoCadastro';
import { Navbar } from '../../../components/navbar/Navbar';

export const metadata = {
  title: 'Edição de Lançamento | Gestão Financeira',
  description: 'Edição de lançamento financeiro',
};

interface EditarLancamentoPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarLancamentoPage({ params }: EditarLancamentoPageProps) {
  const { id } = await params;
  const idNumerico = id ? Number(id) : undefined;

  return (
    <div className="min-h-screen flex flex-column">
      <Navbar />
      <LancamentoCadastro idProp={idNumerico} />
    </div>
  );
}

