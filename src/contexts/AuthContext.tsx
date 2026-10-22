import { useCallback, useMemo, useState, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import { acessoService, decodificarClaimsToken } from '../services/acessoService';
import { STORAGE_TOKEN } from '../services/api';
import { usuarioService } from '../services/usuarioService';
import { NIVEL_ADMINISTRADOR, type Usuario, type UsuarioLogado } from '../features/usuario/types/usuario';
import {
  AuthContext,
  STORAGE_USUARIO,
  type AuthContextData,
} from './authContextDef';

const lerUsuarioSalvo = (): UsuarioLogado | null => {
  const salvo = localStorage.getItem(STORAGE_USUARIO);
  const token = localStorage.getItem(STORAGE_TOKEN);
  if (!salvo || !token) return null;
  try {
    return JSON.parse(salvo) as UsuarioLogado;
  } catch {
    localStorage.removeItem(STORAGE_USUARIO);
    localStorage.removeItem(STORAGE_TOKEN);
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

  const login = useCallback(
    async (email: string, senha: string) => {
      const emailLimpo = email.trim();
      const token = await acessoService.logar({ email: emailLimpo, senha });
      localStorage.setItem(STORAGE_TOKEN, token);

      const claims = decodificarClaimsToken(token);
      let usuarioCompleto: UsuarioLogado = {
        id: claims.id,
        nome: emailLimpo.split('@')[0] || emailLimpo,
        email: emailLimpo,
        nivel: claims.nivel ?? 0,
      };

      if (claims.id != null) {
        try {
          const encontrado = await usuarioService.buscarPorId(claims.id);
          usuarioCompleto = semSenha(encontrado);
        } catch {
          // Mantém os dados extraídos do token caso ocorra falha ao buscar por ID.
        }
      }

      atualizarUsuarioLogado(usuarioCompleto);
    },
    [atualizarUsuarioLogado],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_USUARIO);
    localStorage.removeItem(STORAGE_TOKEN);
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
