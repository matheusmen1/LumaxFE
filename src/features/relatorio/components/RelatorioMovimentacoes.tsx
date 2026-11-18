import { useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle, Scale } from 'lucide-react';
import { TabelaCrud, type Coluna } from '../../../components/ui/TabelaCrud';
import { formatarDataHora, formatarMoeda } from '../../../utils/masks';
import type { MovimentacaoEstoque, Periodo, TipoMovimentacao } from '../types/relatorio';
import { CaixaGrafico } from './CaixaGrafico';
import { CardKpi } from './CardKpi';
import { GraficoPeriodo } from './GraficoPeriodo';

/** TabelaCrud espera `id` numérico; o id da movimentação é texto (E12 / S7), então a linha usa a posição. */
type Linha = Omit<MovimentacaoEstoque, 'id'> & { id: number };

const colunas: Coluna<Linha>[] = [
  { titulo: 'Data', render: (m) => formatarDataHora(m.data) },
  {
    titulo: 'Tipo',
    render: (m) =>
      m.tipo === 'ENTRADA' ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
          <ArrowDownCircle size={13} /> Entrada
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
          <ArrowUpCircle size={13} /> Saída
        </span>
      ),
  },
  { titulo: 'Produto', render: (m) => m.produtoNome },
  {
    titulo: 'Qtd.',
    render: (m) => (
      <span className={`font-semibold ${m.tipo === 'ENTRADA' ? 'text-green-700' : 'text-red-700'}`}>
        {m.tipo === 'ENTRADA' ? '+' : '-'}
        {m.quantidade}
      </span>
    ),
  },
  { titulo: 'Valor unit.', render: (m) => formatarMoeda(m.valorUnitario) },
  {
    titulo: 'Origem / destino',
    render: (m) => (
      <>
        {m.origem ?? '-'}{' '}
        <span className="text-xs text-gray-500">
          ({m.tipo === 'ENTRADA' ? 'Entrada' : 'Venda'} #{m.documentoId})
        </span>
      </>
    ),
  },
  { titulo: 'Usuário', render: (m) => m.usuarioNome ?? '-' },
];

type Filtro = TipoMovimentacao | 'TODAS';

const FILTROS: { valor: Filtro; rotulo: string }[] = [
  { valor: 'TODAS', rotulo: 'Todas' },
  { valor: 'ENTRADA', rotulo: 'Entradas' },
  { valor: 'SAIDA', rotulo: 'Saídas' },
];

interface Props {
  dados: MovimentacaoEstoque[];
  periodo: Periodo;
  carregando: boolean;
  erro: string | null;
}

const unidades = (n: number) => `${n} un.`;

export const RelatorioMovimentacoes = ({ dados, periodo, carregando, erro }: Props) => {
  const [filtro, setFiltro] = useState<Filtro>('TODAS');

  const entradas = dados.filter((m) => m.tipo === 'ENTRADA').reduce((s, m) => s + m.quantidade, 0);
  const saidas = dados.filter((m) => m.tipo === 'SAIDA').reduce((s, m) => s + m.quantidade, 0);
  const saldo = entradas - saidas;
  const linhas: Linha[] = dados
    .filter((m) => filtro === 'TODAS' || m.tipo === filtro)
    .map((m, posicao) => ({
      id: posicao,
      data: m.data,
      tipo: m.tipo,
      produtoId: m.produtoId,
      produtoNome: m.produtoNome,
      quantidade: m.quantidade,
      valorUnitario: m.valorUnitario,
      origem: m.origem,
      documentoId: m.documentoId,
      usuarioNome: m.usuarioNome,
    }));

  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-3">
        <CardKpi titulo="Unidades que entraram" valor={unidades(entradas)} icone={ArrowDownCircle} cor="border-green-600 text-green-600" />
        <CardKpi titulo="Unidades que saíram" valor={unidades(saidas)} icone={ArrowUpCircle} cor="border-red-600 text-red-600" />
        <CardKpi
          titulo="Saldo do período"
          valor={`${saldo > 0 ? '+' : ''}${unidades(saldo)}`}
          detalhe={`${dados.length} movimentações`}
          icone={Scale}
          cor="border-lumax-blue text-lumax-blue"
        />
      </div>

      <CaixaGrafico titulo="Entradas x saídas (unidades)">
        <GraficoPeriodo
          dados={dados}
          periodo={periodo}
          data={(m) => m.data}
          series={[
            { chave: 'entradas', nome: 'Entradas', cor: '#16a34a', valor: (m) => (m.tipo === 'ENTRADA' ? m.quantidade : 0) },
            { chave: 'saidas', nome: 'Saídas', cor: '#dc2626', valor: (m) => (m.tipo === 'SAIDA' ? m.quantidade : 0) },
          ]}
          formatar={(n) => String(n)}
          inteiro
        />
      </CaixaGrafico>

      <div className="flex gap-2">
        {FILTROS.map((f) => (
          <button
            key={f.valor}
            type="button"
            onClick={() => setFiltro(f.valor)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              filtro === f.valor
                ? 'border-lumax-blue bg-lumax-blue text-white shadow'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f.rotulo}
          </button>
        ))}
      </div>

      <TabelaCrud
        colunas={colunas}
        dados={linhas}
        carregando={carregando}
        erro={erro}
        mensagemVazio="Nenhuma movimentação de estoque no período."
      />
    </div>
  );
};
