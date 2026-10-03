import { CabecalhoCrud } from '../../../components/ui/CabecalhoCrud';
import { TabelaCrud, type Coluna } from '../../../components/ui/TabelaCrud';
import { useCrud } from '../../../hooks/useCrud';
import { clienteService } from '../../../services/clienteService';
import { mascaraCpf, mascaraTelefone } from '../../../utils/masks';
import { FormCliente } from '../components/FormCliente';
import type { Cliente } from '../types/cliente';

const colunas: Coluna<Cliente>[] = [
  { titulo: 'Nome', render: (c) => <span className="font-medium text-gray-900">{c.nome}</span> },
  { titulo: 'CPF', render: (c) => mascaraCpf(c.cpf) },
  { titulo: 'Telefone', render: (c) => mascaraTelefone(c.telefone) },
  { titulo: 'E-mail', render: (c) => c.email },
  { titulo: 'Cidade/UF', render: (c) => `${c.cidade}/${c.estado}` },
];

export const GerenciarCliente = () => {
  const crud = useCrud(clienteService, 'cliente');

  if (crud.modo === 'formulario') {
    return (
      <FormCliente
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
        titulo="Clientes"
        subtitulo="Cadastro de clientes da loja"
        placeholderBusca="Buscar por nome, CPF ou e-mail..."
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
        mensagemVazio="Nenhum cliente encontrado."
        onAlterar={crud.alterar}
        onExcluir={crud.excluir}
      />
    </>
  );
};
