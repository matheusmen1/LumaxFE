import { FormNomeDescricao } from '../../../components/ui/FormNomeDescricao';
import type { TipoPagamento } from '../types/tipoPagamento';

interface Props {
  entidadeParaAlterar?: TipoPagamento | null;
  onCancelar: () => void;
  onSalvar: (tipo: TipoPagamento) => Promise<void>;
}

export const FormTipoPagamento = (props: Props) => (
  <FormNomeDescricao<TipoPagamento> rotuloEntidade="Tipo de Pagamento" {...props} />
);
