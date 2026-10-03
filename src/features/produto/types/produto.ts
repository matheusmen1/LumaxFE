import type { Categoria } from '../../categoria/types/categoria';
import type { Fornecedor } from '../../fornecedor/types/fornecedor';

export interface Produto {
  id?: number;
  nome: string;
  descricao?: string;
  valor: number;
  /** Bytes da imagem, trafegados em Base64 pelo Jackson. */
  foto?: string | null;
  valorCasco?: number | null;
  categoria: Pick<Categoria, 'id'> & Partial<Categoria>;
  fornecedor: Pick<Fornecedor, 'id'> & Partial<Fornecedor>;
}
