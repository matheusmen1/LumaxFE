import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Campo } from '../../../components/ui/Campo';
import { FormularioBase } from '../../../components/ui/FormularioBase';
import { classeBotaoSecundario, classeInput } from '../../../components/ui/estilos';
import { clienteService } from '../../../services/clienteService';
import { produtoService } from '../../../services/produtoService';
import { tipoPagamentoService } from '../../../services/tipoPagamentoService';
import { vendaService } from '../../../services/vendaService';
import { formatarMoeda, mascaraCpf } from '../../../utils/masks';
import type { Cliente } from '../../cliente/types/cliente';
import type { Produto } from '../../produto/types/produto';
import type { TipoPagamento } from '../../tipoPagamento/types/tipoPagamento';

interface LinhaVenda {
  chave: number;
  produtoId: string;
  quantidade: string;
  cascoEntregue: boolean;
  numeroSerie: string;
  mesesGarantia: string;
}

let proximaChave = 1;
const novaLinha = (): LinhaVenda => ({
  chave: proximaChave++,
  produtoId: '',
  quantidade: '1',
  cascoEntregue: false,
  numeroSerie: '',
  mesesGarantia: '',
});

/** Preço unitário final: com casco entregue, desconta o valor do casco (mesma regra do backend). */
const precoUnitario = (produto: Produto | undefined, cascoEntregue: boolean): number => {
  if (!produto) return 0;
  const desconto = cascoEntregue ? (produto.valorCasco ?? 0) : 0;
  return Math.max(0, produto.valor - desconto);
};

export const NovaVenda = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [tiposPagamento, setTiposPagamento] = useState<TipoPagamento[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [clienteId, setClienteId] = useState('');
  const [tipoPagamentoId, setTipoPagamentoId] = useState('');
  const [linhas, setLinhas] = useState<LinhaVenda[]>([novaLinha()]);

  useEffect(() => {
    let ativo = true;
    Promise.all([clienteService.listar(), tipoPagamentoService.listar(), produtoService.buscarDisponiveis()])
      .then(([listaClientes, listaTipos, listaProdutos]) => {
        if (!ativo) return;
        setClientes(listaClientes);
        setTiposPagamento(listaTipos);
        setProdutos(listaProdutos);
      })
      .catch(() => toast.error('Não foi possível carregar clientes, pagamentos e produtos.'))
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => {
      ativo = false;
    };
  }, []);

  const obterProduto = (id: string) => produtos.find((p) => String(p.id) === id);

  const obterTotalPedido = (produtoId: string) =>
    linhas.filter((l) => l.produtoId === produtoId).reduce((soma, l) => soma + (Number(l.quantidade) || 0), 0);

  const atualizarLinha = (chave: number, campos: Partial<LinhaVenda>) =>
    setLinhas((atual) => atual.map((l) => (l.chave === chave ? { ...l, ...campos } : l)));

  const total = linhas.reduce((soma, l) => {
    const produto = obterProduto(l.produtoId);
    return soma + precoUnitario(produto, l.cascoEntregue) * (Number(l.quantidade) || 0);
  }, 0);

  const handleSubmit = async () => {
    if (!clienteId) throw new Error('Selecione o cliente.');
    if (!tipoPagamentoId) throw new Error('Selecione o tipo de pagamento.');
    if (linhas.some((l) => !l.produtoId)) throw new Error('Selecione o produto em todos os itens.');

    for (const l of linhas) {
      const produto = obterProduto(l.produtoId);
      const quantidade = Number(l.quantidade);
      if (!(quantidade > 0) || !Number.isInteger(quantidade))
        throw new Error(`Quantidade inválida para ${produto?.nome}.`);
      if (l.numeroSerie.trim() && quantidade !== 1)
        throw new Error(`Item com número de série deve ter quantidade 1 (${produto?.nome}).`);
      if (l.cascoEntregue && produto?.valorCasco == null)
        throw new Error(`O produto ${produto?.nome} não possui valor de casco cadastrado.`);

      const pedido = obterTotalPedido(l.produtoId);
      if (pedido > (produto?.estoque ?? 0))
        throw new Error(`Estoque insuficiente para ${produto?.nome} (disponível: ${produto?.estoque ?? 0}, pedido: ${pedido}).`);
    }

    await vendaService.registrar({
      clienteId: Number(clienteId),
      tipoPagamentoId: Number(tipoPagamentoId),
      itens: linhas.map((l) => ({
        produtoId: Number(l.produtoId),
        quantidade: Number(l.quantidade),
        cascoEntregue: l.cascoEntregue,
        numeroSerie: l.numeroSerie.trim() || undefined,
        mesesGarantia: l.mesesGarantia === '' ? undefined : Number(l.mesesGarantia),
      })),
    });
    toast.success('Venda registrada com sucesso!');
    navigate('/vendas');
  };

  const semDados = !carregando && (clientes.length === 0 || tiposPagamento.length === 0 || produtos.length === 0);

  return (
    <FormularioBase
      titulo="Nova Venda"
      rotuloSalvar="Finalizar venda"
      onCancelar={() => navigate('/vendas')}
      onSubmit={handleSubmit}
    >
      {semDados && (
        <div className="flex items-start gap-2 rounded-lg border border-lumax-yellow/50 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          Para registrar uma venda é necessário ter clientes, tipos de pagamento e produtos com estoque disponível.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Campo rotulo="Cliente" obrigatorio>
          <select
            className={classeInput}
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            disabled={carregando}
            required
          >
            <option value="">{carregando ? 'Carregando...' : 'Selecione'}</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome} — {mascaraCpf(c.cpf)}
              </option>
            ))}
          </select>
        </Campo>
        <Campo rotulo="Tipo de pagamento" obrigatorio>
          <select
            className={classeInput}
            value={tipoPagamentoId}
            onChange={(e) => setTipoPagamentoId(e.target.value)}
            disabled={carregando}
            required
          >
            <option value="">{carregando ? 'Carregando...' : 'Selecione'}</option>
            {tiposPagamento.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nome}
              </option>
            ))}
          </select>
        </Campo>
      </div>

      <fieldset className="space-y-3">
        <legend className="mb-2 text-sm font-semibold uppercase tracking-wide text-lumax-orange">Itens</legend>
        {linhas.map((linha) => {
          const produto = obterProduto(linha.produtoId);
          const saldo = produto?.estoque ?? 0;
          const pedido = obterTotalPedido(linha.produtoId);
          const temSerie = linha.numeroSerie.trim() !== '';
          const unitario = precoUnitario(produto, linha.cascoEntregue);
          const quantidade = temSerie ? 1 : Number(linha.quantidade) || 0;

          return (
            <div key={linha.chave} className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
              <div className="grid items-end gap-3 md:grid-cols-[1fr_110px_auto]">
                <Campo rotulo="Produto" obrigatorio>
                  <select
                    className={classeInput}
                    value={linha.produtoId}
                    onChange={(e) => atualizarLinha(linha.chave, { produtoId: e.target.value, cascoEntregue: false })}
                    disabled={carregando}
                    required
                  >
                    <option value="">Selecione</option>
                    {produtos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome} — {formatarMoeda(p.valor)} (estoque disponível: {p.estoque ?? 0})
                      </option>
                    ))}
                  </select>
                </Campo>
                <Campo rotulo="Quantidade" obrigatorio>
                  <input
                    type="number"
                    min={1}
                    max={saldo || undefined}
                    step={1}
                    className={classeInput}
                    value={temSerie ? '1' : linha.quantidade}
                    disabled={temSerie}
                    onChange={(e) => atualizarLinha(linha.chave, { quantidade: e.target.value })}
                    required
                  />
                </Campo>
                <button
                  type="button"
                  disabled={linhas.length === 1}
                  onClick={() => setLinhas((atual) => atual.filter((l) => l.chave !== linha.chave))}
                  className="mb-1 inline-flex items-center gap-1 rounded-md px-2 py-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                  title="Remover item"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="grid items-end gap-3 md:grid-cols-[auto_1fr_150px_auto]">
                <label
                  className={`mb-2 flex items-center gap-2 text-sm text-gray-700 ${produto && produto.valorCasco == null ? 'opacity-50' : ''}`}
                  title={produto && produto.valorCasco == null ? 'Produto sem valor de casco cadastrado' : undefined}
                >
                  <input
                    type="checkbox"
                    checked={linha.cascoEntregue}
                    disabled={!produto || produto.valorCasco == null}
                    onChange={(e) => atualizarLinha(linha.chave, { cascoEntregue: e.target.checked })}
                  />
                  Casco entregue
                  {produto?.valorCasco != null && (
                    <span className="text-xs text-gray-500">(− {formatarMoeda(produto.valorCasco)})</span>
                  )}
                </label>
                <Campo rotulo="Nº de série">
                  <input
                    className={classeInput}
                    value={linha.numeroSerie}
                    maxLength={100}
                    onChange={(e) =>
                      atualizarLinha(linha.chave, {
                        numeroSerie: e.target.value,
                        quantidade: e.target.value.trim() ? '1' : linha.quantidade,
                      })
                    }
                    placeholder="Opcional (fixa a quantidade em 1)"
                  />
                </Campo>
                <Campo rotulo="Garantia (meses)">
                  <input
                    type="number"
                    min={0}
                    step={1}
                    className={classeInput}
                    value={linha.mesesGarantia}
                    onChange={(e) => atualizarLinha(linha.chave, { mesesGarantia: e.target.value })}
                  />
                </Campo>
                <p className="mb-2 text-right text-sm text-gray-600">
                  {formatarMoeda(unitario)} × {quantidade} ={' '}
                  <span className="font-bold text-lumax-blue">{formatarMoeda(unitario * quantidade)}</span>
                </p>
              </div>

              {produto && pedido > saldo && (
                <p className="flex items-center gap-1 text-xs font-medium text-red-600">
                  <AlertTriangle size={14} /> Estoque insuficiente: disponível {saldo}, pedido {pedido}.
                </p>
              )}
            </div>
          );
        })}
        <button type="button" onClick={() => setLinhas((atual) => [...atual, novaLinha()])} className={classeBotaoSecundario}>
          <Plus size={16} /> Adicionar item
        </button>
      </fieldset>

      <p className="text-right text-sm text-gray-600">
        Total da venda: <span className="text-2xl font-bold text-lumax-blue">{formatarMoeda(total)}</span>
      </p>
    </FormularioBase>
  );
};
