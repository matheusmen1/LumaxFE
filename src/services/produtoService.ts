import { criarCrudService } from './crudService';
import type { Produto } from '../features/produto/types/produto';

export const produtoService = criarCrudService<Produto>('produto', ['nome', 'descricao']);
