import { api } from './api';

export interface AcessoDTO {
  email: string;
  senha: string;
}

export interface ClaimsToken {
  sub?: string;
  id?: number;
  nivel?: number;
  exp?: number;
}

export const decodificarClaimsToken = (token: string): ClaimsToken => {
  try {
    const payloadBase64Url = token.split('.')[1];
    if (!payloadBase64Url) return {};
    const base64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(''),
    );
    return JSON.parse(json) as ClaimsToken;
  } catch {
    return {};
  }
};

export const acessoService = {
  logar: async (acesso: AcessoDTO): Promise<string> => {
    const { data } = await api.post<string>('/logar', acesso);
    return data;
  },
};
