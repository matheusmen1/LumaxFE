import { criarCrudService } from './crudService';
import type { Usuario } from '../features/usuario/types/usuario';

export const usuarioService = criarCrudService<Usuario>('usuario', ['nome', 'email']);
