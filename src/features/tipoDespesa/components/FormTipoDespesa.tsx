import { FormNomeDescricao } from '../../../components/ui/FormNomeDescricao';
import type { TipoDespesa } from '../types/tipoDespesa';

interface Props {
  entidadeParaAlterar?: TipoDespesa | null;
  onCancelar: () => void;
  onSalvar: (tipo: TipoDespesa) => Promise<void>;
}

export const FormTipoDespesa = (props: Props) => (
  <FormNomeDescricao<TipoDespesa> rotuloEntidade="Tipo de Despesa" {...props} />
);
