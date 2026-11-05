import axios from 'axios';
import { api } from './api';
import { criarCrudService } from './crudService';
import type { Venda, VendaRequest } from '../features/venda/types/venda';

const baseCrud = criarCrudService<Venda>('venda');

export const vendaService = {
  ...baseCrud,

  registrar: async (request: VendaRequest): Promise<Venda> => {
    const response = await api.post<Venda>('/apis/venda', request);
    return response.data;
  },

  buscarPorCliente: async (clienteId: number): Promise<Venda[]> => {
    try {
      const response = await api.get<Venda[]>(`/apis/venda/cliente/${clienteId}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (erro) {
      if (axios.isAxiosError(erro) && erro.response?.status === 400) return [];
      throw erro;
    }
  },

  buscarPorUsuario: async (usuarioId: number): Promise<Venda[]> => {
    try {
      const response = await api.get<Venda[]>(`/apis/venda/usuario/${usuarioId}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (erro) {
      if (axios.isAxiosError(erro) && erro.response?.status === 400) return [];
      throw erro;
    }
  },
};
