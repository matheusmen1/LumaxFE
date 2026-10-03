import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../contexts/useAuth';
import { usuarioService } from '../../../services/usuarioService';
import { extrairMensagemErro } from '../../../services/api';
import { FormUsuario } from './FormUsuario';
import type { Usuario } from '../types/usuario';

/** Permite ao usuário logado alterar o próprio cadastro (o nível não pode ser alterado aqui). */
export const MeusDados = () => {
  const { usuarioLogado, atualizarUsuarioLogado } = useAuth();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const id = usuarioLogado?.id;

  useEffect(() => {
    if (!id) return;
    usuarioService
      .buscarPorId(id)
      .then(setUsuario)
      .catch((e) => {
        const msg = extrairMensagemErro(e, 'Não foi possível carregar seus dados.');
        setErro(msg);
        toast.error(msg);
      });
  }, [id]);

  const handleSalvar = async (dados: Usuario) => {
    const salvo = await usuarioService.atualizar(dados);
    atualizarUsuarioLogado(salvo);
    setUsuario(salvo);
    toast.success('Dados atualizados com sucesso.');
  };

  if (erro) {
    return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">{erro}</div>;
  }

  if (!usuario) {
    return (
      <div className="flex items-center gap-2 p-8 text-gray-500">
        <Loader2 className="animate-spin" size={20} /> Carregando...
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-4">
      <h2 className="text-2xl font-bold text-lumax-blue">Meus Dados</h2>
      <FormUsuario
        key={`${usuario.id}-${usuario.email}`}
        titulo="Editar meu cadastro"
        entidadeParaAlterar={usuario}
        nivelFixo={usuario.nivel}
        onCancelar={() => navigate(-1)}
        onSalvar={handleSalvar}
      />
    </div>
  );
};
