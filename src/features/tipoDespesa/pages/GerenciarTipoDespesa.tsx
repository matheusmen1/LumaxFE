import { CabecalhoCrud } from '../../../components/ui/CabecalhoCrud';
import { TabelaCrud, type Coluna } from '../../../components/ui/TabelaCrud';
import { useCrud } from '../../../hooks/useCrud';
import { tipoDespesaService } from '../../../services/tipoDespesaService';
import { FormTipoDespesa } from '../components/FormTipoDespesa';
import type { TipoDespesa } from '../types/tipoDespesa';

const colunas: Coluna<TipoDespesa>[] = [
  { titulo: 'ID', render: (t) => t.id, className: 'w-20' },
  { titulo: 'Nome', render: (t) => t.nome },
  { titulo: 'Descrição', render: (t) => t.descricao || '-' },
];

export const GerenciarTipoDespesa = () => {
  const crud = useCrud(tipoDespesaService, 'tipo de despesa');

  if (crud.modo === 'formulario') {
    return (
      <FormTipoDespesa
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
        titulo="Tipos de Despesa"
        subtitulo="Classificação das despesas lançadas no financeiro"
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
        mensagemVazio="Nenhum tipo de despesa encontrado."
        onAlterar={crud.alterar}
        onExcluir={crud.excluir}
      />
    </>
  );
};
