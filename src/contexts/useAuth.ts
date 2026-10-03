import { useContext } from 'react';
import { AuthContext, type AuthContextData } from './authContextDef';

export const useAuth = (): AuthContextData => {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return contexto;
};
