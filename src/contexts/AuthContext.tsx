import { useCallback, useMemo, useState, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import { usuarioService } from '../services/usuarioService';
import { NIVEL_ADMINISTRADOR, type Usuario, type UsuarioLogado } from '../features/usuario/types/usuario';
import {
  AuthContext,
  ERRO_CREDENCIAIS,
  ERRO_SEM_USUARIOS,
  STORAGE_USUARIO,
  type AuthContextData,
} from './authContextDef';

const lerUsuarioSalvo = (): UsuarioLogado | null => {
  const salvo = localStorage.getItem(STORAGE_USUARIO);
  if (!salvo) return null;
  try {
    return JSON.parse(salvo) as UsuarioLogado;
  } catch {
    localStorage.removeItem(STORAGE_USUARIO);
    return null;
  }
};

const semSenha = (usuario: Usuario | UsuarioLogado): UsuarioLogado => ({
  id: usuario.id,
  nome: usuario.nome,
  email: usuario.email,
  nivel: usuario.nivel,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuarioLogado, setUsuarioLogado] = useState<UsuarioLogado | null>(lerUsuarioSalvo);

  const atualizarUsuarioLogado = useCallback((usuario: UsuarioLogado) => {
    const limpo = semSenha(usuario);
    localStorage.setItem(STORAGE_USUARIO, JSON.stringify(limpo));
    setUsuarioLogado(limpo);
  }, []);

  /**
   * PROVISÓRIO: o backend ainda não possui endpoint de login (/apis/usuario/logar).
   * Enquanto isso, a validação é feita no cliente a partir de GET /apis/usuario.
   * Substituir por uma chamada POST ao backend assim que o endpoint existir.
   */
  const login = useCallback(
    async (email: string, senha: string) => {
      const usuarios = await usuarioService.listar();
      if (usuarios.length === 0) throw new Error(ERRO_SEM_USUARIOS);

      const encontrado = usuarios.find(
        (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase() && u.senha === senha,
      );
      if (!encontrado) throw new Error(ERRO_CREDENCIAIS);

      atualizarUsuarioLogado(encontrado);
    },
    [atualizarUsuarioLogado],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_USUARIO);
    setUsuarioLogado(null);
    toast.success('Desconectado com sucesso!');
  }, []);

  const valor = useMemo<AuthContextData>(
    () => ({
      usuarioLogado,
      isAdministrador: usuarioLogado?.nivel === NIVEL_ADMINISTRADOR,
      login,
      logout,
      atualizarUsuarioLogado,
    }),
    [usuarioLogado, login, logout, atualizarUsuarioLogado],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
};
