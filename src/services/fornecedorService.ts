import { criarCrudService } from './crudService';
import type { Fornecedor } from '../features/fornecedor/types/fornecedor';

export const fornecedorService = criarCrudService<Fornecedor>('fornecedor');
