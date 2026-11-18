import { api } from './api';
import type { Lancamento } from '../features/lancamento/types/lancamento';
import type { Venda } from '../features/venda/types/venda';
import type { MovimentacaoEstoque, Periodo } from '../features/relatorio/types/relatorio';

const buscar = async <T>(recurso: string, periodo: Periodo): Promise<T[]> => {
  const response = await api.get<T[]>(`/apis/relatorio/${recurso}`, { params: periodo });
  return Array.isArray(response.data) ? response.data : [];
};

export const relatorioService = {
  lancamentos: (periodo: Periodo) => buscar<Lancamento>('lancamentos', periodo),
  vendas: (periodo: Periodo) => buscar<Venda>('vendas', periodo),
  movimentacoes: (periodo: Periodo) => buscar<MovimentacaoEstoque>('movimentacoes', periodo),
};
