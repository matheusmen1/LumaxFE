import { useEffect, useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { ArrowLeftRight, CalendarRange, ReceiptText, Search, ShoppingCart } from 'lucide-react';
import { classeBotaoPrimario, classeInput } from '../../../components/ui/estilos';
import { extrairMensagemErro } from '../../../services/api';
import { relatorioService } from '../../../services/relatorioService';
import { formatarData, paraISODate } from '../../../utils/datas';
import type { Lancamento } from '../../lancamento/types/lancamento';
import type { Venda } from '../../venda/types/venda';
import { RelatorioLancamentos } from '../components/RelatorioLancamentos';
import { RelatorioMovimentacoes } from '../components/RelatorioMovimentacoes';
import { RelatorioVendas } from '../components/RelatorioVendas';
import type { MovimentacaoEstoque, Periodo } from '../types/relatorio';

type Aba = 'lancamentos' | 'vendas' | 'movimentacoes';

const ABAS: { id: Aba; rotulo: string; icone: typeof ReceiptText }[] = [
  { id: 'lancamentos', rotulo: 'Lançamentos', icone: ReceiptText },
  { id: 'vendas', rotulo: 'Vendas', icone: ShoppingCart },
  { id: 'movimentacoes', rotulo: 'Movimentações de Estoque', icone: ArrowLeftRight },
];

const hoje = () => new Date();
const diasAtras = (n: number) => {
  const d = hoje();
  d.setDate(d.getDate() - n);
  return d;
};
const inicioDoMes = () => {
  const d = hoje();
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

const ATALHOS: { rotulo: string; periodo: () => Periodo }[] = [
  { rotulo: 'Hoje', periodo: () => ({ inicio: paraISODate(hoje()), fim: paraISODate(hoje()) }) },
  { rotulo: '7 dias', periodo: () => ({ inicio: paraISODate(diasAtras(6)), fim: paraISODate(hoje()) }) },
  { rotulo: '30 dias', periodo: () => ({ inicio: paraISODate(diasAtras(29)), fim: paraISODate(hoje()) }) },
  { rotulo: 'Este mês', periodo: () => ({ inicio: paraISODate(inicioDoMes()), fim: paraISODate(hoje()) }) },
];

interface Resultado {
  chave: string;
  lancamentos: Lancamento[];
  vendas: Venda[];
  movimentacoes: MovimentacaoEstoque[];
  erro: string | null;
}

const VAZIO: Omit<Resultado, 'chave' | 'erro'> = { lancamentos: [], vendas: [], movimentacoes: [] };

export const Relatorios = () => {
  const [aba, setAba] = useState<Aba>('lancamentos');
  const [filtro, setFiltro] = useState<Periodo>(() => ATALHOS[3].periodo());
  const [periodo, setPeriodo] = useState<Periodo>(filtro);
  const [resultado, setResultado] = useState<Resultado | null>(null);

  // Cada combinação aba + período é uma "chave"; enquanto o resultado guardado não for dela, está carregando.
  const chave = `${aba}|${periodo.inicio}|${periodo.fim}`;
  const carregando = resultado?.chave !== chave;

  useEffect(() => {
    let ativo = true;
    const consulta: Promise<Partial<Resultado>> =
      aba === 'lancamentos'
        ? relatorioService.lancamentos(periodo).then((lancamentos) => ({ lancamentos }))
        : aba === 'vendas'
          ? relatorioService.vendas(periodo).then((vendas) => ({ vendas }))
          : relatorioService.movimentacoes(periodo).then((movimentacoes) => ({ movimentacoes }));

    consulta
      .then((dados) => {
        if (ativo) setResultado({ ...VAZIO, ...dados, chave, erro: null });
      })
      .catch((e) => {
        const mensagem = extrairMensagemErro(e, 'Não foi possível gerar o relatório.');
        if (ativo) {
          setResultado({ ...VAZIO, chave, erro: mensagem });
          toast.error(mensagem);
        }
      });
    return () => {
      ativo = false;
    };
  }, [aba, periodo, chave]);

  const aplicar = (e?: FormEvent) => {
    e?.preventDefault();
    if (!filtro.inicio || !filtro.fim) {
      toast.error('Informe a data inicial e a data final.');
      return;
    }
    if (filtro.inicio > filtro.fim) {
      toast.error('A data inicial não pode ser posterior à data final.');
      return;
    }
    setPeriodo({ ...filtro });
  };

  const usarAtalho = (p: Periodo) => {
    setFiltro(p);
    setPeriodo(p);
  };

  const dados = carregando ? { ...VAZIO, erro: null } : resultado!;
  const props = { periodo, carregando, erro: dados.erro };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-lumax-blue">Relatórios</h2>
        <p className="flex items-center gap-1.5 text-sm text-gray-500">
          <CalendarRange size={15} /> Período: {formatarData(periodo.inicio)} a {formatarData(periodo.fim)}
        </p>
      </div>

      <form
        onSubmit={aplicar}
        className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:flex-row lg:items-end"
      >
        <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:max-w-md">
          <label className="text-sm font-medium text-gray-700">
            Data inicial
            <input
              type="date"
              className={`${classeInput} mt-1`}
              value={filtro.inicio}
              max={filtro.fim || undefined}
              onChange={(e) => setFiltro((f) => ({ ...f, inicio: e.target.value }))}
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Data final
            <input
              type="date"
              className={`${classeInput} mt-1`}
              value={filtro.fim}
              min={filtro.inicio || undefined}
              onChange={(e) => setFiltro((f) => ({ ...f, fim: e.target.value }))}
            />
          </label>
        </div>
        <button type="submit" className={classeBotaoPrimario}>
          <Search size={16} /> Filtrar
        </button>
        <div className="flex flex-wrap gap-2 lg:ml-auto">
          {ATALHOS.map((a) => {
            const p = a.periodo();
            const ativo = p.inicio === periodo.inicio && p.fim === periodo.fim;
            return (
              <button
                key={a.rotulo}
                type="button"
                onClick={() => usarAtalho(p)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  ativo ? 'border-lumax-orange bg-orange-50 text-lumax-orange' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {a.rotulo}
              </button>
            );
          })}
        </div>
      </form>

      <div className="flex gap-1 overflow-x-auto overflow-y-hidden border-b border-gray-200">
        {ABAS.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setAba(a.id)}
            className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
              aba === a.id
                ? 'border-lumax-orange text-lumax-blue'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            <a.icone size={17} /> {a.rotulo}
          </button>
        ))}
      </div>

      {aba === 'lancamentos' && <RelatorioLancamentos dados={dados.lancamentos} {...props} />}
      {aba === 'vendas' && <RelatorioVendas dados={dados.vendas} {...props} />}
      {aba === 'movimentacoes' && <RelatorioMovimentacoes dados={dados.movimentacoes} {...props} />}
    </div>
  );
};
