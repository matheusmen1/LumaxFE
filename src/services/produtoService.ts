import { api } from './api';
import { criarCrudService } from './crudService';
import type { Produto } from '../features/produto/types/produto';
import axios from 'axios';

const baseCrud = criarCrudService<Produto>('produto');

export const produtoService = {
  ...baseCrud,

  buscarPorFornecedor: async (fornecedorId: number): Promise<Produto[]> => {
    try {
      const response = await api.get<Produto[]>(`/apis/produto/fornecedor/${fornecedorId}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (erro) {
      if (axios.isAxiosError(erro) && erro.response?.status === 400) return [];
      throw erro;
    }
  },

  buscarPorCategoria: async (categoriaId: number): Promise<Produto[]> => {
    try {
      const response = await api.get<Produto[]>(`/apis/produto/categoria/${categoriaId}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (erro) {
      if (axios.isAxiosError(erro) && erro.response?.status === 400) return [];
      throw erro;
    }
  },

  buscarDisponiveis: async (): Promise<Produto[]> => {
    try {
      const response = await api.get<Produto[]>('/apis/produto/disponiveis');
      return Array.isArray(response.data) ? response.data : [];
    } catch (erro) {
      if (axios.isAxiosError(erro) && erro.response?.status === 400) return [];
      throw erro;
    }
  },
};
