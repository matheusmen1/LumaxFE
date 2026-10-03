import { criarCrudService } from './crudService';
import type { TipoPagamento } from '../features/tipoPagamento/types/tipoPagamento';

export const tipoPagamentoService = criarCrudService<TipoPagamento>('tipo-pagamento', ['nome', 'descricao']);
