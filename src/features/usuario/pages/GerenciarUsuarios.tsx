import { CabecalhoCrud } from '../../../components/ui/CabecalhoCrud';
import { TabelaCrud, type Coluna } from '../../../components/ui/TabelaCrud';
import { useAuth } from '../../../contexts/useAuth';
import { useCrud } from '../../../hooks/useCrud';
import { usuarioService } from '../../../services/usuarioService';
import { FormUsuario } from '../components/FormUsuario';
import { NIVEL_ADMINISTRADOR, descricaoNivel, type Usuario } from '../types/usuario';
import toast from 'react-hot-toast';

const colunas: Coluna<Usuario>[] = [
  { titulo: 'Nome', render: (u) => <span className="font-medium text-gray-900">{u.nome}</span> },
  { titulo: 'E-mail', render: (u) => u.email },
  {
    titulo: 'Nível',
    render: (u) => (
      <span
        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
          u.nivel === NIVEL_ADMINISTRADOR ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-lumax-blue'
        }`}
      >
        {descricaoNivel(u.nivel)}
      </span>
    ),
  },
];

export const GerenciarUsuarios = () => {
  const crud = useCrud(usuarioService, 'usuário');
  const { usuarioLogado, atualizarUsuarioLogado } = useAuth();

  const salvar = async (usuario: Usuario) => {
    await crud.salvar(usuario);
    // Se o administrador alterou o próprio cadastro, mantém a sessão atualizada.
    if (usuario.id && usuario.id === usuarioLogado?.id) atualizarUsuarioLogado(usuario);
  };

  const excluir = (usuario: Usuario) => {
    if (usuario.id === usuarioLogado?.id) {
      toast.error('Você não pode excluir o seu próprio usuário.');
      return;
    }
    void crud.excluir(usuario);
  };

  if (crud.modo === 'formulario') {
    return (
      <FormUsuario
        key={crud.entidadeParaAlterar?.id ?? 'novo'}
        entidadeParaAlterar={crud.entidadeParaAlterar}
        onCancelar={crud.cancelar}
        onSalvar={salvar}
      />
    );
  }

  return (
    <>
      <CabecalhoCrud
        titulo="Usuários"
        subtitulo="Pessoas com acesso ao sistema"
        placeholderBusca="Buscar por nome ou e-mail..."
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
        mensagemVazio="Nenhum usuário encontrado."
        onAlterar={crud.alterar}
        onExcluir={excluir}
      />
    </>
  );
};
