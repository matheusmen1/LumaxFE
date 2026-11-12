export interface Lancamento {
  id?: number;
  dataHora: string | number[];
  valorTotal: number;
  observacao?: string | null;
  usuario: { id?: number; nome?: string };
  tipoDespesa: { id?: number; nome?: string; descricao?: string };
}

export interface LancamentoRequest {
  id?: number;
  tipoDespesaId: number;
  valorTotal: number;
  observacao?: string | null;
  dataHora?: string | null;
}

export interface LancamentoFormData {
  id?: number;
  tipoDespesaId: number;
  valorTotal: number;
  observacao?: string | null;
  dataHora?: string | null;
}
