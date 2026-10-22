import axios from 'axios';
import { api } from './api';

export interface CrudService<T> {
  listar: () => Promise<T[]>;
  buscarPorId: (id: number) => Promise<T>;
  buscarPorNome: (termo: string) => Promise<T[]>;
  criar: (entidade: T) => Promise<T>;
  atualizar: (entidade: T) => Promise<T>;
  excluir: (id: number) => Promise<void>;
}

/**
 * Cria um service CRUD padrão para os endpoints do backend:
 *   GET    /apis/{recurso}                 PUT /apis/{recurso}
 *   GET    /apis/{recurso}/{id}            POST /apis/{recurso}
 *   GET    /apis/{recurso}/filtro/{filtro} DELETE /apis/{recurso}/{id}
 */
export function criarCrudService<T extends { id?: number }>(recurso: string): CrudService<T> {
  const base = `/apis/${recurso}`;

  const listar = async (): Promise<T[]> => {
    try {
      const response = await api.get<T[]>(base);
      return Array.isArray(response.data) ? response.data : [];
    } catch (erro) {
      // O backend responde 400 ("Nenhum ... Encontrado") quando a lista está vazia.
      if (axios.isAxiosError(erro) && erro.response?.status === 400) return [];
      throw erro;
    }
  };

  return {
    listar,

    buscarPorId: async (id) => {
      const response = await api.get<T>(`${base}/${id}`);
      return response.data;
    },

    buscarPorNome: async (termo) => {
      const filtro = termo.trim();
      if (!filtro) return listar();
      try {
        const response = await api.get<T[]>(`${base}/filtro/${encodeURIComponent(filtro)}`);
        return Array.isArray(response.data) ? response.data : [];
      } catch (erro) {
        if (axios.isAxiosError(erro) && erro.response?.status === 400) return [];
        throw erro;
      }
    },

    criar: async (entidade) => {
      const response = await api.post<T>(base, entidade);
      return response.data;
    },

    atualizar: async (entidade) => {
      const response = await api.put<T>(base, entidade);
      return response.data;
    },

    excluir: async (id) => {
      await api.delete(`${base}/${id}`);
    },
  };
}
