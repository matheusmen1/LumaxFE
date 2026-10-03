import { FormNomeDescricao } from '../../../components/ui/FormNomeDescricao';
import type { Categoria } from '../types/categoria';

interface Props {
  entidadeParaAlterar?: Categoria | null;
  onCancelar: () => void;
  onSalvar: (categoria: Categoria) => Promise<void>;
}

export const FormCategoria = (props: Props) => <FormNomeDescricao<Categoria> rotuloEntidade="Categoria" {...props} />;
