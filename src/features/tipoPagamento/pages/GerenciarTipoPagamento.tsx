import { CabecalhoCrud } from '../../../components/ui/CabecalhoCrud';
import { TabelaCrud, type Coluna } from '../../../components/ui/TabelaCrud';
import { useCrud } from '../../../hooks/useCrud';
import { tipoPagamentoService } from '../../../services/tipoPagamentoService';
import { FormTipoPagamento } from '../components/FormTipoPagamento';
import type { TipoPagamento } from '../types/tipoPagamento';

const colunas: Coluna<TipoPagamento>[] = [
  { titulo: 'ID', render: (t) => t.id, className: 'w-20' },
  { titulo: 'Nome', render: (t) => t.nome },
  { titulo: 'Descrição', render: (t) => t.descricao || '-' },
];

export const GerenciarTipoPagamento = () => {
  const crud = useCrud(tipoPagamentoService, 'tipo de pagamento');

  if (crud.modo === 'formulario') {
    return (
      <FormTipoPagamento
        key={crud.entidadeParaAlterar?.id ?? 'novo'}
        entidadeParaAlterar={crud.entidadeParaAlterar}
        onCancelar={crud.cancelar}
        onSalvar={crud.salvar}
      />
    );
  }

  return (
    <>
      <CabecalhoCrud
        titulo="Tipos de Pagamento"
        subtitulo="Formas de pagamento aceitas nas vendas"
        termoBusca={crud.termoBusca}
        onTermoBuscaChange={crud.setTermoBusca}
        onBuscar={crud.buscar}
        onNovo={crud.novo}
      />
      <TabelaCrud
        colunas={colunas}
        dados={crud.lista}
        carregando={crud.carregando}
        erro={crud.erro}
        mensagemVazio="Nenhum tipo de pagamento encontrado."
        onAlterar={crud.alterar}
        onExcluir={crud.excluir}
      />
    </>
  );
};
