import axios from 'axios';
import { api } from './api';
import { criarCrudService } from './crudService';
import type { Fornecedor } from '../features/fornecedor/types/fornecedor';

const baseCrud = criarCrudService<Fornecedor>('fornecedor');

export const fornecedorService = {
  ...baseCrud,

  buscarPorCnpj: async (cnpj: string): Promise<Fornecedor | null> => {
    try {
      const response = await api.get<Fornecedor>(`/apis/fornecedor/cnpj/${cnpj}`);
      return response.data;
    } catch (erro) {
      if (axios.isAxiosError(erro) && erro.response?.status === 400) return null;
      throw erro;
    }
  },
};
