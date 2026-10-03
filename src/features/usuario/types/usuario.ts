export const NIVEL_ADMINISTRADOR = 1;
export const NIVEL_FUNCIONARIO = 0;

export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha: string;
  nivel: number;
}

/** Usuário guardado no localStorage (sem a senha). */
export type UsuarioLogado = Omit<Usuario, 'senha'>;

export const descricaoNivel = (nivel: number): string =>
  nivel === NIVEL_ADMINISTRADOR ? 'Administrador' : 'Funcionário';
