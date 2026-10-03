import { useEffect, useRef, useState, type ElementType } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  BatteryCharging,
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Receipt,
  Tags,
  Truck,
  UserCircle,
  UserCog,
  Users,
} from 'lucide-react';
import { useAuth } from '../contexts/useAuth';
import { descricaoNivel } from '../features/usuario/types/usuario';

interface ItemMenu {
  rotulo: string;
  rota: string;
  icone: ElementType;
  somenteAdmin?: boolean;
}

interface SecaoMenu {
  titulo: string;
  itens: ItemMenu[];
}

const SECOES: SecaoMenu[] = [
  { titulo: 'Geral', itens: [{ rotulo: 'Início', rota: '/dashboard', icone: LayoutDashboard }] },
  {
    titulo: 'Cadastros',
    itens: [
      { rotulo: 'Clientes', rota: '/clientes', icone: Users },
      { rotulo: 'Fornecedores', rota: '/fornecedores', icone: Truck },
      { rotulo: 'Produtos', rota: '/produtos', icone: Package },
      { rotulo: 'Categorias', rota: '/categorias', icone: Tags },
    ],
  },
  {
    titulo: 'Financeiro',
    itens: [
      { rotulo: 'Tipos de Despesa', rota: '/tipos-despesa', icone: Receipt },
      { rotulo: 'Tipos de Pagamento', rota: '/tipos-pagamento', icone: CreditCard },
    ],
  },
  {
    titulo: 'Administração',
    itens: [{ rotulo: 'Usuários', rota: '/usuarios', icone: UserCog, somenteAdmin: true }],
  },
];

const TITULOS: Record<string, string> = {
  '/dashboard': 'Início',
  '/clientes': 'Clientes',
  '/fornecedores': 'Fornecedores',
  '/produtos': 'Produtos',
  '/categorias': 'Categorias',
  '/tipos-despesa': 'Tipos de Despesa',
  '/tipos-pagamento': 'Tipos de Pagamento',
  '/usuarios': 'Usuários',
  '/meus-dados': 'Meus Dados',
};

export const Layout = () => {
  const { usuarioLogado, isAdministrador, logout } = useAuth();
  const { pathname } = useLocation();
  const [menuAberto, setMenuAberto] = useState(true);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fecharAoClicarFora = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownAberto(false);
    };
    document.addEventListener('mousedown', fecharAoClicarFora);
    return () => document.removeEventListener('mousedown', fecharAoClicarFora);
  }, []);

  const secoesVisiveis = SECOES.map((s) => ({
    ...s,
    itens: s.itens.filter((i) => !i.somenteAdmin || isAdministrador),
  })).filter((s) => s.itens.length > 0);

  const iniciais =
    usuarioLogado?.nome
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('') ?? '?';

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Menu lateral */}
      <aside
        className={`flex shrink-0 flex-col bg-lumax-blue-dark text-blue-100 shadow-xl transition-all duration-300 ${
          menuAberto ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-5">
          <BatteryCharging size={28} className="shrink-0 text-lumax-yellow" />
          {menuAberto && (
            <span className="text-xl font-bold tracking-wide text-white">
              Lumax<span className="text-lumax-yellow">ERP</span>
            </span>
          )}
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {secoesVisiveis.map((secao) => (
            <div key={secao.titulo}>
              {menuAberto ? (
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-lumax-orange">{secao.titulo}</p>
              ) : (
                <div className="mx-auto mb-2 h-px w-8 bg-white/10" />
              )}
              <ul className="space-y-1">
                {secao.itens.map((item) => (
                  <li key={item.rota}>
                    <NavLink
                      to={item.rota}
                      title={item.rotulo}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                          isActive ? 'bg-lumax-blue-light text-white shadow' : 'hover:bg-white/10 hover:text-white'
                        } ${menuAberto ? '' : 'justify-center'}`
                      }
                    >
                      <item.icone size={19} className="shrink-0" />
                      {menuAberto && <span>{item.rotulo}</span>}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {menuAberto && (
          <div className="border-t border-white/10 px-5 py-3 text-xs text-blue-300">
            {isAdministrador ? 'Painel do Administrador' : 'Painel do Funcionário'}
          </div>
        )}
      </aside>

      {/* Conteúdo */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMenuAberto((v) => !v)}
              className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100"
              title={menuAberto ? 'Recolher menu' : 'Expandir menu'}
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-semibold text-lumax-blue">{TITULOS[pathname] ?? 'LumaxERP'}</h1>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownAberto((v) => !v)}
              className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition hover:bg-gray-100"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-lumax-orange text-sm font-bold text-white">
                {iniciais}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold leading-tight text-gray-800">{usuarioLogado?.nome}</p>
                <p className="text-xs leading-tight text-gray-500">{descricaoNivel(usuarioLogado?.nivel ?? 0)}</p>
              </div>
              <ChevronDown size={16} className="text-gray-500" />
            </button>

            {dropdownAberto && (
              <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                <Link
                  to="/meus-dados"
                  onClick={() => setDropdownAberto(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <UserCircle size={16} /> Meus Dados
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="flex w-full items-center gap-2 border-t border-gray-100 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} /> Sair
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
