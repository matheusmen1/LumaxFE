import { useEffect, useState, useCallback } from 'react';
import { Filter, DollarSign } from 'lucide-react';
import { CabecalhoCrud } from '../../../components/ui/CabecalhoCrud';
import { TabelaCrud, type Coluna } from '../../../components/ui/TabelaCrud';
import { useAuth } from '../../../contexts/useAuth';
import { useCrud } from '../../../hooks/useCrud';
import { lancamentoService } from '../../../services/lancamentoService';
import { tipoDespesaService } from '../../../services/tipoDespesaService';
import { formatarDataHora, formatarMoeda } from '../../../utils/masks';
import { FormLancamento } from '../components/FormLancamento';
import type { Lancamento } from '../types/lancamento';
import type { TipoDespesa } from '../../tipoDespesa/types/tipoDespesa';

const colunas: Coluna<Lancamento>[] = [
  { titulo: 'Data e Hora', render: (l) => formatarDataHora(l.dataHora) },
  {
    titulo: 'Tipo de Despesa',
    render: (l) => <span className="font-medium text-gray-900">{l.tipoDespesa?.nome ?? '-'}</span>,
  },
  { titulo: 'Responsável', render: (l) => l.usuario?.nome ?? '-' },
  {
    titulo: 'Observação',
    render: (l) => (
      <span className="text-gray-600" title={l.observacao ?? ''}>
        {l.observacao || '-'}
      </span>
    ),
  },
  {
    titulo: 'Valor',
    render: (l) => <span className="font-semibold text-red-600">-{formatarMoeda(l.valorTotal)}</span>,
    className: 'text-right',
  },
];

export const GerenciarLancamento = () => {
  const { isAdministrador } = useAuth();
  const crud = useCrud(lancamentoService, 'lançamento de despesa');

  const [tiposDespesa, setTiposDespesa] = useState<TipoDespesa[]>([]);
  const [tipoSelecionado, setTipoSelecionado] = useState<string>('');
  const [totalGeral, setTotalGeral] = useState<number | null>(null);

  // Carrega opções de tipos de despesa para o filtro
  useEffect(() => {
    let ativo = true;
    tipoDespesaService
      .listar()
      .then((tipos) => {
        if (ativo) setTiposDespesa(tipos);
      })
      .catch(() => {
        // Ignora erro no carregamento do filtro
      });
    return () => {
      ativo = false;
    };
  }, []);

  // Atualiza o total geral das despesas via endpoint @Query do backend
  const carregarTotal = useCallback(() => {
    lancamentoService
      .obterTotal()
      .then((total) => setTotalGeral(total))
      .catch(() => setTotalGeral(null));
  }, []);

  useEffect(() => {
    carregarTotal();
  }, [carregarTotal, crud.lista]);

  const handleTipoChange = (val: string) => {
    setTipoSelecionado(val);
    if (val) {
      crud.setTermoBusca(`tipoId:${val}`);
    } else {
      crud.setTermoBusca('');
    }
  };

  if (crud.modo === 'formulario') {
    return (
      <FormLancamento
        key={crud.entidadeParaAlterar?.id ?? 'novo'}
        entidadeParaAlterar={crud.entidadeParaAlterar}
        onCancelar={crud.cancelar}
        onSalvar={async (lancamento) => {
          await crud.salvar(lancamento);
          carregarTotal();
        }}
      />
    );
  }

  const termoExibicao = crud.termoBusca.startsWith('tipoId:') ? '' : crud.termoBusca;

  return (
    <div className="space-y-4">
      <CabecalhoCrud
        titulo="Lançamentos de Despesa"
        subtitulo="Controle e registro de saídas financeiras e despesas da empresa"
        termoBusca={termoExibicao}
        placeholderBusca="Buscar por observação ou tipo de despesa..."
        onTermoBuscaChange={(termo) => {
          setTipoSelecionado('');
          crud.setTermoBusca(termo);
        }}
        onBuscar={crud.buscar}
        onNovo={crud.novo}
        rotuloNovo="Novo lançamento"
      />

      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filtrar por Tipo:</span>
          <select
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800 outline-none transition focus:border-lumax-blue-light focus:ring-2 focus:ring-lumax-blue-light/30"
            value={tipoSelecionado}
            onChange={(e) => handleTipoChange(e.target.value)}
          >
            <option value="">Todos os tipos</option>
            {tiposDespesa.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nome}
              </option>
            ))}
          </select>
          {tipoSelecionado && (
            <button
              type="button"
              onClick={() => handleTipoChange('')}
              className="text-xs text-gray-500 underline hover:text-gray-700"
            >
              Limpar filtro
            </button>
          )}
        </div>

        {totalGeral !== null && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-1.5 text-sm text-red-700">
            <DollarSign size={16} />
            <span>Total de Despesas:</span>
            <span className="font-bold">{formatarMoeda(totalGeral)}</span>
          </div>
        )}
      </div>

      <TabelaCrud
        colunas={colunas}
        dados={crud.lista}
        carregando={crud.carregando}
        erro={crud.erro}
        mensagemVazio="Nenhum lançamento de despesa encontrado."
        onAlterar={crud.alterar}
        onExcluir={isAdministrador ? crud.excluir : undefined}
      />
    </div>
  );
};
