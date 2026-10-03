import { useState } from 'react';
import { Campo } from '../../../components/ui/Campo';
import { FormularioBase } from '../../../components/ui/FormularioBase';
import { classeInput } from '../../../components/ui/estilos';
import { NIVEL_ADMINISTRADOR, NIVEL_FUNCIONARIO, type Usuario } from '../types/usuario';

interface Props {
  entidadeParaAlterar?: Usuario | null;
  onCancelar: () => void;
  onSalvar: (usuario: Usuario) => Promise<void>;
  /** Força um nível e esconde o seletor (ex.: cadastro do primeiro administrador). */
  nivelFixo?: number;
  titulo?: string;
}

export const FormUsuario = ({ entidadeParaAlterar, onCancelar, onSalvar, nivelFixo, titulo }: Props) => {
  const editando = Boolean(entidadeParaAlterar?.id);
  const [nome, setNome] = useState(entidadeParaAlterar?.nome ?? '');
  const [email, setEmail] = useState(entidadeParaAlterar?.email ?? '');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [nivel, setNivel] = useState<number>(nivelFixo ?? entidadeParaAlterar?.nivel ?? NIVEL_FUNCIONARIO);

  const handleSubmit = async () => {
    if (!editando && !senha) throw new Error('Informe a senha.');
    if (senha && senha.length < 6) throw new Error('A senha deve ter pelo menos 6 caracteres.');
    if (senha !== confirmacao) throw new Error('A confirmação de senha não confere.');

    await onSalvar({
      id: entidadeParaAlterar?.id,
      nome: nome.trim(),
      email: email.trim(),
      // Em edição, senha em branco mantém a atual (o PUT substitui a entidade inteira).
      senha: senha || entidadeParaAlterar?.senha || '',
      nivel: nivelFixo ?? nivel,
    });
  };

  return (
    <FormularioBase
      titulo={titulo ?? (editando ? 'Alterar Usuário' : 'Novo Usuário')}
      onCancelar={onCancelar}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Campo rotulo="Nome" obrigatorio>
          <input className={classeInput} value={nome} maxLength={100} onChange={(e) => setNome(e.target.value)} required />
        </Campo>
        <Campo rotulo="E-mail" obrigatorio>
          <input
            type="email"
            className={classeInput}
            value={email}
            maxLength={50}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Campo>
        <Campo rotulo={editando ? 'Nova senha (deixe em branco para manter)' : 'Senha'} obrigatorio={!editando}>
          <input
            type="password"
            className={classeInput}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="new-password"
          />
        </Campo>
        <Campo rotulo="Confirmar senha" obrigatorio={!editando}>
          <input
            type="password"
            className={classeInput}
            value={confirmacao}
            onChange={(e) => setConfirmacao(e.target.value)}
            autoComplete="new-password"
          />
        </Campo>
        {nivelFixo === undefined && (
          <Campo rotulo="Nível de acesso" obrigatorio>
            <select className={classeInput} value={nivel} onChange={(e) => setNivel(Number(e.target.value))}>
              <option value={NIVEL_FUNCIONARIO}>Funcionário</option>
              <option value={NIVEL_ADMINISTRADOR}>Administrador</option>
            </select>
          </Campo>
        )}
      </div>
    </FormularioBase>
  );
};
