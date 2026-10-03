import { createContext } from 'react';
import type { UsuarioLogado } from '../features/usuario/types/usuario';

export const STORAGE_USUARIO = '@LumaxERP:usuario';
export const ERRO_SEM_USUARIOS = 'SEM_USUARIOS';
export const ERRO_CREDENCIAIS = 'CREDENCIAIS_INVALIDAS';

export interface AuthContextData {
  usuarioLogado: UsuarioLogado | null;
  isAdministrador: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  atualizarUsuarioLogado: (usuario: UsuarioLogado) => void;
}

export const AuthContext = createContext<AuthContextData | undefined>(undefined);
