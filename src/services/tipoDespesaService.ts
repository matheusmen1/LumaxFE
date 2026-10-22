import { criarCrudService } from './crudService';
import type { TipoDespesa } from '../features/tipoDespesa/types/tipoDespesa';

export const tipoDespesaService = criarCrudService<TipoDespesa>('tipo-despesa');
