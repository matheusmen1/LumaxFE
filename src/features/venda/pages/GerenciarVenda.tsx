import { useNavigate } from 'react-router-dom';
import { CabecalhoCrud } from '../../../components/ui/CabecalhoCrud';
import { TabelaCrud, type Coluna } from '../../../components/ui/TabelaCrud';
import { useAuth } from '../../../contexts/useAuth';
import { useCrud } from '../../../hooks/useCrud';
import { vendaService } from '../../../services/vendaService';
import { formatarDataHora, formatarMoeda } from '../../../utils/masks';
import type { Venda } from '../types/venda';

const colunas: Coluna<Venda>[] = [
  { titulo: 'Data', render: (v) => formatarDataHora(v.dataVenda) },
  { titulo: 'Cliente', render: (v) => v.cliente?.nome ?? '-' },
  { titulo: 'Vendedor', render: (v) => v.usuario?.nome ?? '-' },
  { titulo: 'Pagamento', render: (v) => v.tipoPagamento?.nome ?? '-' },
  {
    titulo: 'Itens',
    render: (v) => (
      <div className="space-y-0.5">
        {v.itens.map((i) => (
          <p key={i.id}>
            <span className="font-semibold">{i.quantidade}×</span> {i.produto?.nome}{' '}
            <span className="text-xs text-gray-500">
              ({formatarMoeda(i.valorUnitario)}
              {i.cascoEntregue ? ', c/ casco' : ''}
              {i.numeroSerie ? `, série ${i.numeroSerie}` : ''}
              {i.mesesGarantia ? `, ${i.mesesGarantia}m garantia` : ''})
            </span>
          </p>
        ))}
      </div>
    ),
  },
  { titulo: 'Total', render: (v) => <span className="font-semibold">{formatarMoeda(v.valorTotal)}</span> },
];

export const GerenciarVenda = () => {
  const navigate = useNavigate();
  const { isAdministrador } = useAuth();
  const crud = useCrud(vendaService, 'venda');

  return (
    <>
      <CabecalhoCrud
        titulo="Vendas"
        subtitulo="Histórico de vendas registradas"
        termoBusca={crud.termoBusca}
        placeholderBusca="Buscar por cliente (nome ou CPF)..."
        onTermoBuscaChange={crud.setTermoBusca}
        onBuscar={crud.buscar}
        onNovo={() => navigate('/vendas/nova')}
        rotuloNovo="Nova venda"
      />
      <TabelaCrud
        colunas={colunas}
        dados={crud.lista}
        carregando={crud.carregando}
        erro={crud.erro}
        mensagemVazio="Nenhuma venda encontrada."
        onExcluir={isAdministrador ? crud.excluir : undefined}
      />
    </>
  );
};
