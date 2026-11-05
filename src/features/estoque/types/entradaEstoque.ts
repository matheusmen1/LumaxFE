import type { Produto } from '../../produto/types/produto';

export interface ItemEntradaEstoque {
  id?: number;
  quantidade: number;
  custoUnitario: number;
  produto: Pick<Produto, 'id' | 'nome'> & Partial<Produto>;
}

export interface EntradaEstoque {
  id?: number;
  dataEntrada: string | number[];
  fornecedor: { id?: number; razaoSocial?: string };
  usuario: { id?: number; nome?: string };
  itens: ItemEntradaEstoque[];
}

export interface EntradaEstoqueRequest {
  fornecedorId: number;
  itens: { produtoId: number; quantidade: number; custoUnitario: number }[];
}
