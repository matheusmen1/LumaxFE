import axios from 'axios';
import { api } from './api';
import { criarCrudService, type CrudService } from './crudService';
import type { Lancamento, LancamentoRequest } from '../features/lancamento/types/lancamento';

const baseCrud = criarCrudService<Lancamento>('lancamento');

export const lancamentoService: CrudService<Lancamento> & {
  registrar: (request: LancamentoRequest) => Promise<Lancamento>;
  buscarPorTipoDespesa: (tipoDespesaId: number) => Promise<Lancamento[]>;
  buscarPorUsuario: (usuarioId: number) => Promise<Lancamento[]>;
  obterTotal: () => Promise<number>;
} = {
  ...baseCrud,

  buscarPorNome: async (termo: string): Promise<Lancamento[]> => {
    const filtro = termo.trim();
    if (!filtro) return baseCrud.listar();
    if (filtro.startsWith('tipoId:')) {
      const id = Number(filtro.replace('tipoId:', ''));
      return lancamentoService.buscarPorTipoDespesa(id);
    }
    if (filtro.startsWith('usuarioId:')) {
      const id = Number(filtro.replace('usuarioId:', ''));
      return lancamentoService.buscarPorUsuario(id);
    }
    try {
      const response = await api.get<Lancamento[]>(`/apis/lancamento/filtro/${encodeURIComponent(filtro)}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (erro) {
      if (axios.isAxiosError(erro) && erro.response?.status === 400) return [];
      throw erro;
    }
  },

  criar: async (entidade: unknown): Promise<Lancamento> => {
    const dados = entidade as {
      tipoDespesaId?: number;
      tipoDespesa?: { id?: number };
      valorTotal: number | string;
      observacao?: string | null;
      dataHora?: string | null;
    };
    const payload: LancamentoRequest = {
      tipoDespesaId: Number(dados.tipoDespesaId ?? dados.tipoDespesa?.id),
      valorTotal: Number(dados.valorTotal),
      observacao: dados.observacao ?? null,
      dataHora: dados.dataHora || null,
    };
    const response = await api.post<Lancamento>('/apis/lancamento', payload);
    return response.data;
  },

  atualizar: async (entidade: unknown): Promise<Lancamento> => {
    const dados = entidade as {
      id?: number;
      tipoDespesaId?: number;
      tipoDespesa?: { id?: number };
      valorTotal: number | string;
      observacao?: string | null;
      dataHora?: string | null;
    };
    const payload: LancamentoRequest = {
      id: dados.id,
      tipoDespesaId: Number(dados.tipoDespesaId ?? dados.tipoDespesa?.id),
      valorTotal: Number(dados.valorTotal),
      observacao: dados.observacao ?? null,
      dataHora: dados.dataHora || null,
    };
    const response = await api.put<Lancamento>('/apis/lancamento', payload);
    return response.data;
  },

  registrar: async (request: LancamentoRequest): Promise<Lancamento> => {
    const response = await api.post<Lancamento>('/apis/lancamento', request);
    return response.data;
  },

  buscarPorTipoDespesa: async (tipoDespesaId: number): Promise<Lancamento[]> => {
    try {
      const response = await api.get<Lancamento[]>(`/apis/lancamento/tipo-despesa/${tipoDespesaId}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (erro) {
      if (axios.isAxiosError(erro) && erro.response?.status === 400) return [];
      throw erro;
    }
  },

  buscarPorUsuario: async (usuarioId: number): Promise<Lancamento[]> => {
    try {
      const response = await api.get<Lancamento[]>(`/apis/lancamento/usuario/${usuarioId}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (erro) {
      if (axios.isAxiosError(erro) && erro.response?.status === 400) return [];
      throw erro;
    }
  },

  obterTotal: async (): Promise<number> => {
    const response = await api.get<number>('/apis/lancamento/total');
    return response.data;
  },
};
