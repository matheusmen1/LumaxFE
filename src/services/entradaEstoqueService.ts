import axios from 'axios';
import { api } from './api';
import { criarCrudService } from './crudService';
import type { EntradaEstoque, EntradaEstoqueRequest } from '../features/estoque/types/entradaEstoque';

const baseCrud = criarCrudService<EntradaEstoque>('entrada-estoque');

export const entradaEstoqueService = {
  ...baseCrud,

  registrar: async (request: EntradaEstoqueRequest): Promise<EntradaEstoque> => {
    const response = await api.post<EntradaEstoque>('/apis/entrada-estoque', request);
    return response.data;
  },

  buscarPorFornecedor: async (fornecedorId: number): Promise<EntradaEstoque[]> => {
    try {
      const response = await api.get<EntradaEstoque[]>(`/apis/entrada-estoque/fornecedor/${fornecedorId}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (erro) {
      if (axios.isAxiosError(erro) && erro.response?.status === 400) return [];
      throw erro;
    }
  },
};
