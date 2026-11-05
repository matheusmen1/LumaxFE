import { useNavigate } from 'react-router-dom';
import { CabecalhoCrud } from '../../../components/ui/CabecalhoCrud';
import { TabelaCrud, type Coluna } from '../../../components/ui/TabelaCrud';
import { useAuth } from '../../../contexts/useAuth';
import { useCrud } from '../../../hooks/useCrud';
import { entradaEstoqueService } from '../../../services/entradaEstoqueService';
import { formatarDataHora, formatarMoeda } from '../../../utils/masks';
import type { EntradaEstoque } from '../types/entradaEstoque';

const totalEntrada = (e: EntradaEstoque) => e.itens.reduce((soma, i) => soma + i.quantidade * i.custoUnitario, 0);

const colunas: Coluna<EntradaEstoque>[] = [
  { titulo: 'Data', render: (e) => formatarDataHora(e.dataEntrada) },
  { titulo: 'Fornecedor', render: (e) => e.fornecedor?.razaoSocial ?? '-' },
  { titulo: 'Responsável', render: (e) => e.usuario?.nome ?? '-' },
  {
    titulo: 'Itens',
    render: (e) => (
      <div className="space-y-0.5">
        {e.itens.map((i) => (
          <p key={i.id}>
            <span className="font-semibold">{i.quantidade}×</span> {i.produto?.nome}{' '}
            <span className="text-xs text-gray-500">({formatarMoeda(i.custoUnitario)})</span>
          </p>
        ))}
      </div>
    ),
  },
  { titulo: 'Custo total', render: (e) => <span className="font-semibold">{formatarMoeda(totalEntrada(e))}</span> },
];

export const GerenciarEntradaEstoque = () => {
  const navigate = useNavigate();
  const { isAdministrador } = useAuth();
  const crud = useCrud(entradaEstoqueService, 'entrada de estoque');

  return (
    <>
      <CabecalhoCrud
        titulo="Entradas de Estoque"
        subtitulo="Mercadorias recebidas dos fornecedores"
        termoBusca={crud.termoBusca}
        placeholderBusca="Buscar por fornecedor..."
        onTermoBuscaChange={crud.setTermoBusca}
        onBuscar={crud.buscar}
        onNovo={() => navigate('/estoque/entradas/nova')}
        rotuloNovo="Nova entrada"
      />
      <TabelaCrud
        colunas={colunas}
        dados={crud.lista}
        carregando={crud.carregando}
        erro={crud.erro}
        mensagemVazio="Nenhuma entrada de estoque encontrada."
        onExcluir={isAdministrador ? crud.excluir : undefined}
      />
    </>
  );
};
