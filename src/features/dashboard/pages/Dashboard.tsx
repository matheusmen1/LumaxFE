import { useEffect, useState, type ElementType } from 'react';
import { Link } from 'react-router-dom';
import { Package, Tags, Truck, Users } from 'lucide-react';
import { useAuth } from '../../../contexts/useAuth';
import { clienteService } from '../../../services/clienteService';
import { produtoService } from '../../../services/produtoService';
import { fornecedorService } from '../../../services/fornecedorService';
import { categoriaService } from '../../../services/categoriaService';

interface Indicador {
  titulo: string;
  valor: number | null;
  icone: ElementType;
  cor: string;
  rota: string;
}

export const Dashboard = () => {
  const { usuarioLogado } = useAuth();
  const [totais, setTotais] = useState<{ clientes: number; produtos: number; fornecedores: number; categorias: number } | null>(
    null,
  );

  useEffect(() => {
    let ativo = true;
    Promise.all([clienteService.listar(), produtoService.listar(), fornecedorService.listar(), categoriaService.listar()])
      .then(([clientes, produtos, fornecedores, categorias]) => {
        if (ativo)
          setTotais({
            clientes: clientes.length,
            produtos: produtos.length,
            fornecedores: fornecedores.length,
            categorias: categorias.length,
          });
      })
      .catch(() => {
        if (ativo) setTotais({ clientes: 0, produtos: 0, fornecedores: 0, categorias: 0 });
      });
    return () => {
      ativo = false;
    };
  }, []);

  const indicadores: Indicador[] = [
    { titulo: 'Clientes', valor: totais?.clientes ?? null, icone: Users, cor: 'border-lumax-blue text-lumax-blue', rota: '/clientes' },
    { titulo: 'Produtos', valor: totais?.produtos ?? null, icone: Package, cor: 'border-lumax-yellow text-lumax-yellow', rota: '/produtos' },
    { titulo: 'Fornecedores', valor: totais?.fornecedores ?? null, icone: Truck, cor: 'border-lumax-orange text-lumax-orange', rota: '/fornecedores' },
    { titulo: 'Categorias', valor: totais?.categorias ?? null, icone: Tags, cor: 'border-lumax-blue-light text-lumax-blue-light', rota: '/categorias' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-lumax-blue">Olá, {usuarioLogado?.nome?.split(' ')[0]}!</h2>
        <p className="text-sm text-gray-500">Resumo dos cadastros do sistema.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {indicadores.map((i) => (
          <Link
            key={i.titulo}
            to={i.rota}
            className={`flex items-center justify-between rounded-xl border-l-4 bg-white p-5 shadow-sm transition hover:shadow-md ${i.cor}`}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{i.titulo}</p>
              <p className="mt-1 text-3xl font-bold text-gray-800">{i.valor ?? '…'}</p>
            </div>
            <i.icone size={36} className="opacity-60" />
          </Link>
        ))}
      </div>
    </div>
  );
};
