export type TipoMovimentacao = 'ENTRADA' | 'SAIDA';

/** Item de entrada (fornecedor) ou de venda (cliente) que alterou o estoque. */
export interface MovimentacaoEstoque {
  id: string;
  data: string | number[];
  tipo: TipoMovimentacao;
  produtoId: number;
  produtoNome: string;
  quantidade: number;
  valorUnitario: number;
  origem?: string | null;
  documentoId: number;
  usuarioNome?: string | null;
}

export interface Periodo {
  inicio: string; // yyyy-MM-dd
  fim: string; // yyyy-MM-dd
}
