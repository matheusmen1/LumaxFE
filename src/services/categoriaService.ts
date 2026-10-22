import { criarCrudService } from './crudService';
import type { Categoria } from '../features/categoria/types/categoria';

export const categoriaService = criarCrudService<Categoria>('categoria');
