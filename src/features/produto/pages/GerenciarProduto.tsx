import { ImageOff } from 'lucide-react';
import { CabecalhoCrud } from '../../../components/ui/CabecalhoCrud';
import { TabelaCrud, type Coluna } from '../../../components/ui/TabelaCrud';
import { useCrud } from '../../../hooks/useCrud';
import { produtoService } from '../../../services/produtoService';
import { formatarMoeda } from '../../../utils/masks';
import { FormProduto } from '../components/FormProduto';
import type { Produto } from '../types/produto';

const colunas: Coluna<Produto>[] = [
  {
    titulo: 'Foto',
    className: 'w-16',
    render: (p) =>
      p.foto ? (
        <img src={`data:image/*;base64,${p.foto}`} alt={p.nome} className="h-10 w-10 rounded object-cover" />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100">
          <ImageOff size={16} className="text-gray-400" />
        </div>
      ),
  },
  {
    titulo: 'Produto',
    render: (p) => (
      <div>
        <p className="font-medium text-gray-900">{p.nome}</p>
        {p.descricao && <p className="text-xs text-gray-500">{p.descricao}</p>}
      </div>
    ),
  },
  {
    titulo: 'Categoria',
    render: (p) => (
      <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-lumax-blue">
        {p.categoria?.nome ?? '-'}
      </span>
    ),
  },
  { titulo: 'Fornecedor', render: (p) => p.fornecedor?.razaoSocial ?? '-' },
  { titulo: 'Valor', render: (p) => <span className="font-semibold">{formatarMoeda(p.valor)}</span> },
  { titulo: 'Casco', render: (p) => formatarMoeda(p.valorCasco) },
];

export const GerenciarProduto = () => {
  const crud = useCrud(produtoService, 'produto');

  if (crud.modo === 'formulario') {
    return (
      <FormProduto
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
        titulo="Produtos"
        subtitulo="Baterias e demais itens comercializados"
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
        mensagemVazio="Nenhum produto encontrado."
        onAlterar={crud.alterar}
        onExcluir={crud.excluir}
      />
    </>
  );
};
