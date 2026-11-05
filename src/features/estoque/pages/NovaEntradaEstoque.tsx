import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Campo } from '../../../components/ui/Campo';
import { FormularioBase } from '../../../components/ui/FormularioBase';
import { classeBotaoSecundario, classeInput } from '../../../components/ui/estilos';
import { entradaEstoqueService } from '../../../services/entradaEstoqueService';
import { fornecedorService } from '../../../services/fornecedorService';
import { produtoService } from '../../../services/produtoService';
import { formatarMoeda } from '../../../utils/masks';
import type { Fornecedor } from '../../fornecedor/types/fornecedor';
import type { Produto } from '../../produto/types/produto';

interface LinhaEntrada {
  chave: number;
  produtoId: string;
  quantidade: string;
  custoUnitario: string;
}

let proximaChave = 1;
const novaLinha = (): LinhaEntrada => ({ chave: proximaChave++, produtoId: '', quantidade: '1', custoUnitario: '' });

export const NovaEntradaEstoque = () => {
  const navigate = useNavigate();
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [produtosDoFornecedor, setProdutosDoFornecedor] = useState<Produto[]>([]);
  const [carregandoFornecedores, setCarregandoFornecedores] = useState(true);
  const [carregandoProdutos, setCarregandoProdutos] = useState(false);
  const [fornecedorId, setFornecedorId] = useState('');
  const [linhas, setLinhas] = useState<LinhaEntrada[]>([novaLinha()]);

  useEffect(() => {
    let ativo = true;
    fornecedorService
      .listar()
      .then((lista) => {
        if (ativo) setFornecedores(lista);
      })
      .catch(() => toast.error('Não foi possível carregar fornecedores.'))
      .finally(() => {
        if (ativo) setCarregandoFornecedores(false);
      });
    return () => {
      ativo = false;
    };
  }, []);

  const handleFornecedorChange = async (novoId: string) => {
    setFornecedorId(novoId);
    setLinhas([novaLinha()]);

    if (!novoId) {
      setProdutosDoFornecedor([]);
      return;
    }

    setCarregandoProdutos(true);
    try {
      const lista = await produtoService.buscarPorFornecedor(Number(novoId));
      setProdutosDoFornecedor(lista);
    } catch {
      setProdutosDoFornecedor([]);
      toast.error('Erro ao consultar produtos deste fornecedor.');
    } finally {
      setCarregandoProdutos(false);
    }
  };

  const atualizarLinha = (chave: number, campos: Partial<LinhaEntrada>) =>
    setLinhas((atual) => atual.map((l) => (l.chave === chave ? { ...l, ...campos } : l)));

  const totalCusto = linhas.reduce((soma, l) => soma + (Number(l.quantidade) || 0) * (Number(l.custoUnitario) || 0), 0);

  const handleSubmit = async () => {
    if (!fornecedorId) throw new Error('Selecione o fornecedor.');
    if (linhas.some((l) => !l.produtoId)) throw new Error('Selecione o produto em todos os itens.');
    if (linhas.some((l) => !(Number(l.quantidade) > 0) || !Number.isInteger(Number(l.quantidade))))
      throw new Error('A quantidade deve ser um número inteiro maior que zero.');
    if (linhas.some((l) => l.custoUnitario === '' || Number(l.custoUnitario) < 0))
      throw new Error('Informe o custo unitário de todos os itens.');

    await entradaEstoqueService.registrar({
      fornecedorId: Number(fornecedorId),
      itens: linhas.map((l) => ({
        produtoId: Number(l.produtoId),
        quantidade: Number(l.quantidade),
        custoUnitario: Number(l.custoUnitario),
      })),
    });
    toast.success('Entrada de estoque registrada com sucesso!');
    navigate('/estoque/entradas');
  };

  return (
    <FormularioBase
      titulo="Nova Entrada de Estoque"
      rotuloSalvar="Registrar entrada"
      onCancelar={() => navigate('/estoque/entradas')}
      onSubmit={handleSubmit}
    >
      <Campo rotulo="Fornecedor" obrigatorio className="max-w-md">
        <select
          className={classeInput}
          value={fornecedorId}
          onChange={(e) => void handleFornecedorChange(e.target.value)}
          disabled={carregandoFornecedores}
          required
        >
          <option value="">{carregandoFornecedores ? 'Carregando...' : 'Selecione'}</option>
          {fornecedores.map((f) => (
            <option key={f.id} value={f.id}>
              {f.razaoSocial}
            </option>
          ))}
        </select>
      </Campo>

      {fornecedorId && !carregandoProdutos && produtosDoFornecedor.length === 0 && (
        <div className="rounded-lg border border-lumax-yellow/50 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          O fornecedor selecionado não possui nenhum produto vinculado no banco de dados.
        </div>
      )}

      <fieldset className="space-y-3">
        <legend className="mb-2 text-sm font-semibold uppercase tracking-wide text-lumax-orange">Itens</legend>
        {linhas.map((linha) => (
          <div key={linha.chave} className="grid items-end gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 md:grid-cols-[1fr_120px_160px_auto]">
            <Campo rotulo="Produto" obrigatorio>
              <div className="relative">
                <select
                  className={classeInput}
                  value={linha.produtoId}
                  onChange={(e) => atualizarLinha(linha.chave, { produtoId: e.target.value })}
                  disabled={carregandoProdutos || !fornecedorId}
                  required
                >
                  <option value="">
                    {!fornecedorId
                      ? 'Selecione o fornecedor acima primeiro'
                      : carregandoProdutos
                        ? 'Consultando produtos no banco...'
                        : produtosDoFornecedor.length === 0
                          ? 'Nenhum produto para este fornecedor'
                          : 'Selecione'}
                  </option>
                  {produtosDoFornecedor.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} (estoque atual: {p.estoque ?? 0})
                    </option>
                  ))}
                </select>
                {carregandoProdutos && (
                  <Loader2 size={16} className="absolute right-8 top-1/2 -translate-y-1/2 animate-spin text-lumax-blue" />
                )}
              </div>
            </Campo>
            <Campo rotulo="Quantidade" obrigatorio>
              <input
                type="number"
                min={1}
                step={1}
                className={classeInput}
                value={linha.quantidade}
                onChange={(e) => atualizarLinha(linha.chave, { quantidade: e.target.value })}
                required
              />
            </Campo>
            <Campo rotulo="Custo unitário (R$)" obrigatorio>
              <input
                type="number"
                min={0}
                step="0.01"
                className={classeInput}
                value={linha.custoUnitario}
                onChange={(e) => atualizarLinha(linha.chave, { custoUnitario: e.target.value })}
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
        ))}
        <button
          type="button"
          disabled={!fornecedorId || produtosDoFornecedor.length === 0}
          onClick={() => setLinhas((atual) => [...atual, novaLinha()])}
          className={classeBotaoSecundario}
        >
          <Plus size={16} /> Adicionar item
        </button>
      </fieldset>

      <p className="text-right text-sm text-gray-600">
        Custo total: <span className="text-lg font-bold text-lumax-blue">{formatarMoeda(totalCusto)}</span>
      </p>
    </FormularioBase>
  );
};
