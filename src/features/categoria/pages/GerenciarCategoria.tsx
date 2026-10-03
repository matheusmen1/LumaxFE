import { CabecalhoCrud } from '../../../components/ui/CabecalhoCrud';
import { TabelaCrud, type Coluna } from '../../../components/ui/TabelaCrud';
import { useCrud } from '../../../hooks/useCrud';
import { categoriaService } from '../../../services/categoriaService';
import { FormCategoria } from '../components/FormCategoria';
import type { Categoria } from '../types/categoria';

const colunas: Coluna<Categoria>[] = [
  { titulo: 'ID', render: (c) => c.id, className: 'w-20' },
  { titulo: 'Nome', render: (c) => c.nome },
  { titulo: 'Descrição', render: (c) => c.descricao || '-' },
];

export const GerenciarCategoria = () => {
  const crud = useCrud(categoriaService, 'categoria');

  if (crud.modo === 'formulario') {
    return (
      <FormCategoria
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
        titulo="Categorias"
        subtitulo="Categorias utilizadas para classificar os produtos"
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
        mensagemVazio="Nenhuma categoria encontrada."
        onAlterar={crud.alterar}
        onExcluir={crud.excluir}
      />
    </>
  );
};
