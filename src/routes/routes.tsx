import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useAuth } from '../contexts/useAuth';
import { Login } from '../features/auth/pages/Login';
import { Dashboard } from '../features/dashboard/pages/Dashboard';
import { GerenciarCliente } from '../features/cliente/pages/GerenciarCliente';
import { GerenciarFornecedor } from '../features/fornecedor/pages/GerenciarFornecedor';
import { GerenciarProduto } from '../features/produto/pages/GerenciarProduto';
import { GerenciarCategoria } from '../features/categoria/pages/GerenciarCategoria';
import { GerenciarLancamento } from '../features/lancamento/pages/GerenciarLancamento';
import { GerenciarTipoDespesa } from '../features/tipoDespesa/pages/GerenciarTipoDespesa';
import { GerenciarTipoPagamento } from '../features/tipoPagamento/pages/GerenciarTipoPagamento';
import { GerenciarUsuarios } from '../features/usuario/pages/GerenciarUsuarios';
import { MeusDados } from '../features/usuario/components/MeusDados';
import { GerenciarVenda } from '../features/venda/pages/GerenciarVenda';
import { NovaVenda } from '../features/venda/pages/NovaVenda';
import { GerenciarEntradaEstoque } from '../features/estoque/pages/GerenciarEntradaEstoque';
import { NovaEntradaEstoque } from '../features/estoque/pages/NovaEntradaEstoque';

export const AppRoutes = () => {
  const { usuarioLogado, isAdministrador } = useAuth();

  if (!usuarioLogado) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vendas" element={<GerenciarVenda />} />
        <Route path="/vendas/nova" element={<NovaVenda />} />
        <Route path="/estoque/entradas" element={<GerenciarEntradaEstoque />} />
        <Route path="/estoque/entradas/nova" element={<NovaEntradaEstoque />} />
        <Route path="/clientes" element={<GerenciarCliente />} />
        <Route path="/fornecedores" element={<GerenciarFornecedor />} />
        <Route path="/produtos" element={<GerenciarProduto />} />
        <Route path="/categorias" element={<GerenciarCategoria />} />
        <Route path="/lancamentos" element={<GerenciarLancamento />} />
        <Route path="/tipos-despesa" element={<GerenciarTipoDespesa />} />
        <Route path="/tipos-pagamento" element={<GerenciarTipoPagamento />} />
        {isAdministrador && <Route path="/usuarios" element={<GerenciarUsuarios />} />}
        <Route path="/meus-dados" element={<MeusDados />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
