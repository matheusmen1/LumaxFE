import { useState, type ReactNode } from 'react';
import { AlertTriangle, Inbox, Loader2, Pencil, Trash2 } from 'lucide-react';

export interface Coluna<T> {
  titulo: string;
  render: (item: T) => ReactNode;
  className?: string;
}

interface TabelaCrudProps<T> {
  colunas: Coluna<T>[];
  dados: T[];
  carregando: boolean;
  erro?: string | null;
  mensagemVazio?: string;
  onAlterar: (item: T) => void;
  onExcluir: (item: T) => void;
}

export function TabelaCrud<T extends { id?: number }>({
  colunas,
  dados,
  carregando,
  erro,
  mensagemVazio = 'Nenhum registro encontrado.',
  onAlterar,
  onExcluir,
}: TabelaCrudProps<T>) {
  const [itemParaExcluir, setItemParaExcluir] = useState<T | null>(null);

  if (carregando) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-12 text-gray-500 shadow-sm">
        <Loader2 className="animate-spin" size={20} /> Carregando...
      </div>
    );
  }

  if (erro) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700 shadow-sm">{erro}</div>
    );
  }

  if (dados.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-12 text-gray-500 shadow-sm">
        <Inbox size={36} className="text-gray-300" />
        <p>{mensagemVazio}</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-lumax-blue text-white">
            <tr>
              {colunas.map((c) => (
                <th key={c.titulo} className={`whitespace-nowrap px-4 py-3 font-semibold ${c.className ?? ''}`}>
                  {c.titulo}
                </th>
              ))}
              <th className="px-4 py-3 text-right font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dados.map((item, idx) => (
              <tr key={item.id ?? idx} className="transition-colors hover:bg-blue-50/60">
                {colunas.map((c) => (
                  <td key={c.titulo} className={`whitespace-nowrap px-4 py-3 text-gray-700 ${c.className ?? ''}`}>
                    {c.render(item)}
                  </td>
                ))}
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      type="button"
                      onClick={() => onAlterar(item)}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-lumax-blue-light transition hover:bg-blue-100"
                    >
                      <Pencil size={15} /> Alterar
                    </button>
                    <button
                      type="button"
                      onClick={() => setItemParaExcluir(item)}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 size={15} /> Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {itemParaExcluir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md animate-in zoom-in-95 rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3 text-red-600">
              <AlertTriangle size={28} />
              <h3 className="text-xl font-bold">Confirmar exclusão</h3>
            </div>
            <p className="mb-6 text-gray-600">
              Você tem certeza que deseja excluir este registro? Essa ação não poderá ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setItemParaExcluir(null)}
                className="rounded-lg px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onExcluir(itemParaExcluir);
                  setItemParaExcluir(null);
                }}
                className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
              >
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
