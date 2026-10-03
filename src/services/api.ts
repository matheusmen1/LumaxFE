import axios from 'axios';

// TODO: mover para variável de ambiente (import.meta.env.VITE_API_URL) em uma etapa posterior.
export const API_URL = 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_URL,
});

/** O backend devolve erros no formato { mensagem: string } (classe Erro). */
export const extrairMensagemErro = (erro: unknown, padrao = 'Ocorreu um erro inesperado.'): string => {
  if (axios.isAxiosError(erro)) {
    const dados = erro.response?.data as { mensagem?: string } | undefined;
    if (dados?.mensagem) return dados.mensagem;
    if (!erro.response) return 'Não foi possível conectar ao servidor.';
  }
  return padrao;
};
