import type { Produto } from '../../produto/types/produto';

export interface ItemVenda {
  id?: number;
  quantidade: number;
  valorUnitario: number;
  cascoEntregue: boolean;
  numeroSerie?: string | null;
  mesesGarantia?: number | null;
  produto: Pick<Produto, 'id' | 'nome'> & Partial<Produto>;
}

export interface Venda {
  id?: number;
  dataVenda: string | number[];
  valorTotal: number;
  cliente: { id?: number; nome?: string; cpf?: string };
  usuario: { id?: number; nome?: string };
  tipoPagamento: { id?: number; nome?: string };
  itens: ItemVenda[];
}

export interface ItemVendaRequest {
  produtoId: number;
  quantidade: number;
  cascoEntregue: boolean;
  numeroSerie?: string;
  mesesGarantia?: number;
}

/** O vendedor e os preços não são enviados: o backend usa o token JWT e o cadastro do produto. */
export interface VendaRequest {
  clienteId: number;
  tipoPagamentoId: number;
  itens: ItemVendaRequest[];
}
