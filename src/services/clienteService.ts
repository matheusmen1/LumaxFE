import { criarCrudService } from './crudService';
import type { Cliente } from '../features/cliente/types/cliente';

export const clienteService = criarCrudService<Cliente>('cliente');
