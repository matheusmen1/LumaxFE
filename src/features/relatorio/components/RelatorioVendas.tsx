import { DollarSign, Package, ShoppingCart, Wallet } from 'lucide-react';
import { TabelaCrud, type Coluna } from '../../../components/ui/TabelaCrud';
import { formatarDataHora, formatarMoeda } from '../../../utils/masks';
import type { Venda } from '../../venda/types/venda';
import type { Periodo } from '../types/relatorio';
import { CaixaGrafico } from './CaixaGrafico';
import { CardKpi } from './CardKpi';
import { GraficoPeriodo } from './GraficoPeriodo';
import { somarPor } from '../agregacao';
import { RankingBarras } from './RankingBarras';

const qtdItens = (v: Venda) => v.itens.reduce((s, i) => s + i.quantidade, 0);

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
            <span className="text-xs text-gray-500">({formatarMoeda(i.valorUnitario)})</span>
          </p>
        ))}
      </div>
    ),
  },
  { titulo: 'Total', render: (v) => <span className="font-semibold">{formatarMoeda(v.valorTotal)}</span> },
];

interface Props {
  dados: Venda[];
  periodo: Periodo;
  carregando: boolean;
  erro: string | null;
}

export const RelatorioVendas = ({ dados, periodo, carregando, erro }: Props) => {
  const faturamento = dados.reduce((s, v) => s + (v.valorTotal ?? 0), 0);
  const itensVendidos = dados.reduce((s, v) => s + qtdItens(v), 0);
  const ticketMedio = dados.length ? faturamento / dados.length : 0;
  const porPagamento = somarPor(dados, (v) => v.tipoPagamento?.nome ?? 'Não informado', (v) => v.valorTotal ?? 0);
  const porProduto = somarPor(
    dados.flatMap((v) => v.itens),
    (i) => i.produto?.nome ?? 'Produto',
    (i) => i.quantidade,
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <CardKpi titulo="Faturamento" valor={formatarMoeda(faturamento)} icone={DollarSign} cor="border-lumax-blue text-lumax-blue" />
        <CardKpi titulo="Vendas" valor={String(dados.length)} icone={ShoppingCart} cor="border-lumax-blue-light text-lumax-blue-light" />
        <CardKpi titulo="Ticket médio" valor={formatarMoeda(ticketMedio)} icone={Wallet} cor="border-lumax-yellow text-lumax-yellow" />
        <CardKpi titulo="Itens vendidos" valor={String(itensVendidos)} icone={Package} cor="border-lumax-orange text-lumax-orange" />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <CaixaGrafico titulo="Faturamento no período" className="xl:col-span-2">
          <GraficoPeriodo
            dados={dados}
            periodo={periodo}
            data={(v) => v.dataVenda}
            series={[{ chave: 'valor', nome: 'Faturamento', cor: '#1e3a8a', valor: (v) => v.valorTotal ?? 0 }]}
            formatar={formatarMoeda}
          />
        </CaixaGrafico>
        <div className="space-y-5">
          <CaixaGrafico titulo="Por forma de pagamento">
            <RankingBarras itens={porPagamento} formatar={formatarMoeda} corBarra="bg-lumax-blue" limite={4} />
          </CaixaGrafico>
          <CaixaGrafico titulo="Produtos mais vendidos (unidades)">
            <RankingBarras itens={porProduto} formatar={(n) => `${n} un.`} corBarra="bg-lumax-blue-light" limite={4} />
          </CaixaGrafico>
        </div>
      </div>

      <TabelaCrud colunas={colunas} dados={dados} carregando={carregando} erro={erro} mensagemVazio="Nenhuma venda no período." />
    </div>
  );
};
