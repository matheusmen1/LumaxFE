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

const normalizar = (texto: string) =>
  texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

/**
 * Cria um service CRUD padrão para os endpoints do openapi.yaml:
 *   GET    /apis/{recurso}        PUT /apis/{recurso}
 *   GET    /apis/{recurso}/{id}   POST /apis/{recurso}
 *   DELETE /apis/{recurso}/{id}
 *
 * @param recurso       caminho após /apis (ex.: "cliente")
 * @param camposBusca   campos usados na busca por nome/filtro
 */
export function criarCrudService<T extends { id?: number }>(
  recurso: string,
  camposBusca: (keyof T)[],
): CrudService<T> {
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

    // Ainda não existe endpoint de busca no backend: o filtro é feito no cliente.
    buscarPorNome: async (termo) => {
      const lista = await listar();
      const alvo = normalizar(termo.trim());
      if (!alvo) return lista;
      return lista.filter((item) =>
        camposBusca.some((campo) => normalizar(String(item[campo] ?? '')).includes(alvo)),
      );
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
