import { CabecalhoCrud } from '../../../components/ui/CabecalhoCrud';
import { TabelaCrud, type Coluna } from '../../../components/ui/TabelaCrud';
import { useCrud } from '../../../hooks/useCrud';
import { fornecedorService } from '../../../services/fornecedorService';
import { mascaraCnpj, mascaraTelefone } from '../../../utils/masks';
import { FormFornecedor } from '../components/FormFornecedor';
import type { Fornecedor } from '../types/fornecedor';

const colunas: Coluna<Fornecedor>[] = [
  { titulo: 'Razão Social', render: (f) => <span className="font-medium text-gray-900">{f.razaoSocial}</span> },
  { titulo: 'CNPJ', render: (f) => mascaraCnpj(f.cnpj) },
  { titulo: 'Telefone', render: (f) => mascaraTelefone(f.telefone) },
  { titulo: 'E-mail', render: (f) => f.email },
  { titulo: 'Cidade/UF', render: (f) => `${f.cidade}/${f.estado}` },
];

export const GerenciarFornecedor = () => {
  const crud = useCrud(fornecedorService, 'fornecedor');

  if (crud.modo === 'formulario') {
    return (
      <FormFornecedor
        key={crud.entidadeParaAlterar?.id ?? 'novo'}
        entidadeParaAlterar={crud.entidadeParaAlterar}
        onCancelar={crud.cancelar}
        onSalvar={crud.salvar}
      />
    );
  }

  return (
    <>
      <CabecalhoCrud
        titulo="Fornecedores"
        subtitulo="Empresas que fornecem produtos para a loja"
        placeholderBusca="Buscar por razão social, CNPJ ou e-mail..."
        termoBusca={crud.termoBusca}
        onTermoBuscaChange={crud.setTermoBusca}
        onBuscar={crud.buscar}
        onNovo={crud.novo}
      />
      <TabelaCrud
        colunas={colunas}
        dados={crud.lista}
        carregando={crud.carregando}
        erro={crud.erro}
        mensagemVazio="Nenhum fornecedor encontrado."
        onAlterar={crud.alterar}
        onExcluir={crud.excluir}
      />
    </>
  );
};
