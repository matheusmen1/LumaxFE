import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useAuth } from '../contexts/useAuth';
import { Login } from '../features/auth/pages/Login';
import { Dashboard } from '../features/dashboard/pages/Dashboard';
import { GerenciarCliente } from '../features/cliente/pages/GerenciarCliente';
import { GerenciarFornecedor } from '../features/fornecedor/pages/GerenciarFornecedor';
import { GerenciarProduto } from '../features/produto/pages/GerenciarProduto';
import { GerenciarCategoria } from '../features/categoria/pages/GerenciarCategoria';
import { GerenciarTipoDespesa } from '../features/tipoDespesa/pages/GerenciarTipoDespesa';
import { GerenciarTipoPagamento } from '../features/tipoPagamento/pages/GerenciarTipoPagamento';
import { GerenciarUsuarios } from '../features/usuario/pages/GerenciarUsuarios';
import { MeusDados } from '../features/usuario/components/MeusDados';

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
        <Route path="/clientes" element={<GerenciarCliente />} />
        <Route path="/fornecedores" element={<GerenciarFornecedor />} />
        <Route path="/produtos" element={<GerenciarProduto />} />
        <Route path="/categorias" element={<GerenciarCategoria />} />
        <Route path="/tipos-despesa" element={<GerenciarTipoDespesa />} />
        <Route path="/tipos-pagamento" element={<GerenciarTipoPagamento />} />
        {isAdministrador && <Route path="/usuarios" element={<GerenciarUsuarios />} />}
        <Route path="/meus-dados" element={<MeusDados />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
