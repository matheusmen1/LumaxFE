import { useState, type FormEvent } from 'react';
import { BatteryCharging, Loader2, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../contexts/useAuth';
import { ERRO_CREDENCIAIS, ERRO_SEM_USUARIOS } from '../../../contexts/authContextDef';
import { extrairMensagemErro } from '../../../services/api';
import { usuarioService } from '../../../services/usuarioService';
import { classeBotaoPrimario, classeInput } from '../../../components/ui/estilos';
import { FormUsuario } from '../../usuario/components/FormUsuario';
import { NIVEL_ADMINISTRADOR, type Usuario } from '../../usuario/types/usuario';

export const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [entrando, setEntrando] = useState(false);
  const [primeiroAcesso, setPrimeiroAcesso] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEntrando(true);
    try {
      await login(email, senha);
      toast.success('Login realizado com sucesso!');
    } catch (err) {
      if (err instanceof Error && err.message === ERRO_SEM_USUARIOS) setPrimeiroAcesso(true);
      else if (err instanceof Error && err.message === ERRO_CREDENCIAIS) toast.error('E-mail ou senha inválidos.');
      else toast.error(extrairMensagemErro(err, 'Não foi possível entrar.'));
      setEntrando(false);
    }
  };

  const criarPrimeiroAdministrador = async (usuario: Usuario) => {
    await usuarioService.criar(usuario);
    toast.success('Primeiro administrador criado com sucesso!');
    await login(usuario.email, usuario.senha);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-lumax-blue-dark via-lumax-blue to-lumax-blue-light p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-white">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-lumax-yellow shadow-lg">
            <BatteryCharging size={34} className="text-lumax-blue-dark" />
          </div>
          <h1 className="text-3xl font-bold tracking-wide">
            Lumax<span className="text-lumax-yellow">ERP</span>
          </h1>
          <p className="text-sm text-blue-100">Gestão da loja de baterias</p>
        </div>

        {primeiroAcesso ? (
          <div className="space-y-3">
            <div className="rounded-lg bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
              Nenhum usuário cadastrado. Crie o administrador inicial para acessar o sistema.
            </div>
            <FormUsuario
              titulo="Primeiro acesso — Administrador"
              nivelFixo={NIVEL_ADMINISTRADOR}
              onCancelar={() => setPrimeiroAcesso(false)}
              onSalvar={criarPrimeiroAdministrador}
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-white p-8 shadow-xl">
            <h2 className="text-xl font-semibold text-lumax-blue">Acessar o sistema</h2>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-700">E-mail</span>
              <input
                type="email"
                className={classeInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
                autoFocus
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-700">Senha</span>
              <input
                type="password"
                className={classeInput}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete="current-password"
                required
              />
            </label>

            <button type="submit" disabled={entrando} className={`${classeBotaoPrimario} w-full py-2.5`}>
              {entrando ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
              {entrando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
