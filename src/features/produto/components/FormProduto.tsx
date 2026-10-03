import { useEffect, useState, type ChangeEvent } from 'react';
import { ImageOff, Upload } from 'lucide-react';
import { Campo } from '../../../components/ui/Campo';
import { FormularioBase } from '../../../components/ui/FormularioBase';
import { classeBotaoSecundario, classeInput } from '../../../components/ui/estilos';
import { categoriaService } from '../../../services/categoriaService';
import { fornecedorService } from '../../../services/fornecedorService';
import type { Categoria } from '../../categoria/types/categoria';
import type { Fornecedor } from '../../fornecedor/types/fornecedor';
import type { Produto } from '../types/produto';

interface Props {
  entidadeParaAlterar?: Produto | null;
  onCancelar: () => void;
  onSalvar: (produto: Produto) => Promise<void>;
}

const TAMANHO_MAXIMO_FOTO = 2 * 1024 * 1024; // 2 MB

/** Lê o arquivo e devolve apenas o conteúdo Base64 (sem o prefixo data:...;base64,). */
const lerComoBase64 = (arquivo: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = () => resolve(String(leitor.result).split(',')[1] ?? '');
    leitor.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
    leitor.readAsDataURL(arquivo);
  });

export const FormProduto = ({ entidadeParaAlterar, onCancelar, onSalvar }: Props) => {
  const [nome, setNome] = useState(entidadeParaAlterar?.nome ?? '');
  const [descricao, setDescricao] = useState(entidadeParaAlterar?.descricao ?? '');
  const [valor, setValor] = useState(entidadeParaAlterar?.valor != null ? String(entidadeParaAlterar.valor) : '');
  const [valorCasco, setValorCasco] = useState(
    entidadeParaAlterar?.valorCasco != null ? String(entidadeParaAlterar.valorCasco) : '',
  );
  const [categoriaId, setCategoriaId] = useState(entidadeParaAlterar?.categoria?.id ? String(entidadeParaAlterar.categoria.id) : '');
  const [fornecedorId, setFornecedorId] = useState(
    entidadeParaAlterar?.fornecedor?.id ? String(entidadeParaAlterar.fornecedor.id) : '',
  );
  const [foto, setFoto] = useState<string | null>(entidadeParaAlterar?.foto ?? null);
  const [erroFoto, setErroFoto] = useState<string | null>(null);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [carregandoOpcoes, setCarregandoOpcoes] = useState(true);
  const [erroOpcoes, setErroOpcoes] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    Promise.all([categoriaService.listar(), fornecedorService.listar()])
      .then(([listaCategorias, listaFornecedores]) => {
        if (!ativo) return;
        setCategorias(listaCategorias);
        setFornecedores(listaFornecedores);
      })
      .catch(() => {
        if (ativo) setErroOpcoes('Não foi possível carregar categorias e fornecedores.');
      })
      .finally(() => {
        if (ativo) setCarregandoOpcoes(false);
      });
    return () => {
      ativo = false;
    };
  }, []);

  const handleFoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    if (!arquivo.type.startsWith('image/')) {
      setErroFoto('Selecione um arquivo de imagem.');
      return;
    }
    if (arquivo.size > TAMANHO_MAXIMO_FOTO) {
      setErroFoto('A imagem deve ter no máximo 2 MB.');
      return;
    }
    setErroFoto(null);
    setFoto(await lerComoBase64(arquivo));
  };

  const handleSubmit = async () => {
    if (!categoriaId) throw new Error('Selecione a categoria.');
    if (!fornecedorId) throw new Error('Selecione o fornecedor.');
    const valorNumero = Number(valor);
    if (!(valorNumero > 0)) throw new Error('Informe um valor maior que zero.');

    await onSalvar({
      id: entidadeParaAlterar?.id,
      nome: nome.trim(),
      descricao: descricao.trim() || undefined,
      valor: valorNumero,
      valorCasco: valorCasco === '' ? null : Number(valorCasco),
      foto,
      categoria: { id: Number(categoriaId) },
      fornecedor: { id: Number(fornecedorId) },
    });
  };

  const semOpcoes = !carregandoOpcoes && (categorias.length === 0 || fornecedores.length === 0);

  return (
    <FormularioBase
      titulo={entidadeParaAlterar ? 'Alterar Produto' : 'Novo Produto'}
      onCancelar={onCancelar}
      onSubmit={handleSubmit}
    >
      {erroOpcoes && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{erroOpcoes}</div>
      )}
      {semOpcoes && !erroOpcoes && (
        <div className="rounded-lg border border-lumax-yellow/50 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          Para cadastrar um produto é necessário ter ao menos uma categoria e um fornecedor cadastrados.
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-[1fr_220px]">
        <div className="grid gap-4 md:grid-cols-2">
          <Campo rotulo="Nome" obrigatorio className="md:col-span-2">
            <input className={classeInput} value={nome} maxLength={100} onChange={(e) => setNome(e.target.value)} required />
          </Campo>
          <Campo rotulo="Descrição" className="md:col-span-2">
            <input className={classeInput} value={descricao} maxLength={100} onChange={(e) => setDescricao(e.target.value)} />
          </Campo>
          <Campo rotulo="Valor (R$)" obrigatorio>
            <input
              type="number"
              step="0.01"
              min="0"
              className={classeInput}
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              required
            />
          </Campo>
          <Campo rotulo="Valor do casco (R$)">
            <input
              type="number"
              step="0.01"
              min="0"
              className={classeInput}
              value={valorCasco}
              onChange={(e) => setValorCasco(e.target.value)}
            />
          </Campo>
          <Campo rotulo="Categoria" obrigatorio>
            <select
              className={classeInput}
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              disabled={carregandoOpcoes}
              required
            >
              <option value="">{carregandoOpcoes ? 'Carregando...' : 'Selecione'}</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </Campo>
          <Campo rotulo="Fornecedor" obrigatorio>
            <select
              className={classeInput}
              value={fornecedorId}
              onChange={(e) => setFornecedorId(e.target.value)}
              disabled={carregandoOpcoes}
              required
            >
              <option value="">{carregandoOpcoes ? 'Carregando...' : 'Selecione'}</option>
              {fornecedores.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.razaoSocial}
                </option>
              ))}
            </select>
          </Campo>
        </div>

        <div className="flex flex-col items-center gap-3">
          <span className="self-start text-sm font-medium text-gray-700">Foto</span>
          <div className="flex h-44 w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
            {foto ? (
              <img src={`data:image/*;base64,${foto}`} alt="Foto do produto" className="h-full w-full object-contain" />
            ) : (
              <ImageOff className="text-gray-300" size={40} />
            )}
          </div>
          <div className="flex w-full gap-2">
            <label className={`${classeBotaoSecundario} flex-1 cursor-pointer`}>
              <Upload size={16} /> Escolher
              <input type="file" accept="image/*" className="hidden" onChange={handleFoto} />
            </label>
            {foto && (
              <button type="button" onClick={() => setFoto(null)} className={`${classeBotaoSecundario} text-red-600`}>
                Remover
              </button>
            )}
          </div>
          {erroFoto && <p className="text-xs text-red-600">{erroFoto}</p>}
        </div>
      </div>
    </FormularioBase>
  );
};
