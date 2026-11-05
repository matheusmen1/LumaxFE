import axios from 'axios';
import { api } from './api';
import { criarCrudService } from './crudService';
import type { Cliente } from '../features/cliente/types/cliente';

const baseCrud = criarCrudService<Cliente>('cliente');

export const clienteService = {
  ...baseCrud,

  buscarPorCpf: async (cpf: string): Promise<Cliente | null> => {
    try {
      const response = await api.get<Cliente>(`/apis/cliente/cpf/${cpf}`);
      return response.data;
    } catch (erro) {
      if (axios.isAxiosError(erro) && erro.response?.status === 400) return null;
      throw erro;
    }
  },

  buscarPorCidade: async (cidade: string): Promise<Cliente[]> => {
    try {
      const response = await api.get<Cliente[]>(`/apis/cliente/cidade/${encodeURIComponent(cidade)}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (erro) {
      if (axios.isAxiosError(erro) && erro.response?.status === 400) return [];
      throw erro;
    }
  },
};
