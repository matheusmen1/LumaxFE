import { Receipt, ReceiptText, TrendingUp } from 'lucide-react';
import { TabelaCrud, type Coluna } from '../../../components/ui/TabelaCrud';
import { formatarDataHora, formatarMoeda } from '../../../utils/masks';
import type { Lancamento } from '../../lancamento/types/lancamento';
import type { Periodo } from '../types/relatorio';
import { CaixaGrafico } from './CaixaGrafico';
import { CardKpi } from './CardKpi';
import { GraficoPeriodo } from './GraficoPeriodo';
import { somarPor } from '../agregacao';
import { RankingBarras } from './RankingBarras';

const colunas: Coluna<Lancamento>[] = [
  { titulo: 'Data', render: (l) => formatarDataHora(l.dataHora) },
  { titulo: 'Tipo de despesa', render: (l) => l.tipoDespesa?.nome ?? '-' },
  { titulo: 'Observação', render: (l) => l.observacao || '-', className: 'max-w-xs truncate' },
  { titulo: 'Usuário', render: (l) => l.usuario?.nome ?? '-' },
  { titulo: 'Valor', render: (l) => <span className="font-semibold">{formatarMoeda(l.valorTotal)}</span> },
];

interface Props {
  dados: Lancamento[];
  periodo: Periodo;
  carregando: boolean;
  erro: string | null;
}

export const RelatorioLancamentos = ({ dados, periodo, carregando, erro }: Props) => {
  const total = dados.reduce((s, l) => s + (l.valorTotal ?? 0), 0);
  const porTipo = somarPor(dados, (l) => l.tipoDespesa?.nome ?? 'Sem tipo', (l) => l.valorTotal ?? 0);
  const maiorTipo = [...porTipo].sort((a, b) => b.valor - a.valor)[0];

  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <CardKpi titulo="Total de despesas" valor={formatarMoeda(total)} icone={Receipt} cor="border-lumax-orange text-lumax-orange" />
        <CardKpi titulo="Lançamentos" valor={String(dados.length)} icone={ReceiptText} cor="border-lumax-blue text-lumax-blue" />
        <CardKpi
          titulo="Maior tipo de despesa"
          valor={maiorTipo?.rotulo ?? '-'}
          detalhe={maiorTipo ? formatarMoeda(maiorTipo.valor) : undefined}
          icone={TrendingUp}
          cor="border-lumax-yellow text-lumax-yellow"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <CaixaGrafico titulo="Despesas no período" className="xl:col-span-2">
          <GraficoPeriodo
            dados={dados}
            periodo={periodo}
            data={(l) => l.dataHora}
            series={[{ chave: 'valor', nome: 'Despesas', cor: '#f97316', valor: (l) => l.valorTotal ?? 0 }]}
            formatar={formatarMoeda}
          />
        </CaixaGrafico>
        <CaixaGrafico titulo="Por tipo de despesa">
          <RankingBarras itens={porTipo} formatar={formatarMoeda} corBarra="bg-lumax-orange" />
        </CaixaGrafico>
      </div>

      <TabelaCrud
        colunas={colunas}
        dados={dados}
        carregando={carregando}
        erro={erro}
        mensagemVazio="Nenhum lançamento de despesa no período."
      />
    </div>
  );
};
