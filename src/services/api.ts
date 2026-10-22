import axios from 'axios';

export const API_URL = 'http://localhost:8080';
export const STORAGE_TOKEN = '@LumaxERP:token';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_TOKEN);
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

/** O backend devolve erros no formato { mensagem: string } (classe Erro). */
export const extrairMensagemErro = (erro: unknown, padrao = 'Ocorreu um erro inesperado.'): string => {
  if (axios.isAxiosError(erro)) {
    const dados = erro.response?.data as { mensagem?: string } | string | undefined;
    if (typeof dados === 'object' && dados?.mensagem) return dados.mensagem;
    if (typeof dados === 'string' && dados.trim()) return dados.trim();
    if (!erro.response) return 'Não foi possível conectar ao servidor.';
  }
  if (erro instanceof Error && erro.message) return erro.message;
  return padrao;
};
