import type { ElementType } from 'react';

interface CardKpiProps {
  titulo: string;
  valor: string;
  detalhe?: string;
  icone: ElementType;
  /** Classes de borda e texto, ex.: 'border-lumax-blue text-lumax-blue'. */
  cor: string;
}

export const CardKpi = ({ titulo, valor, detalhe, icone: Icone, cor }: CardKpiProps) => (
  <div className={`flex items-center justify-between rounded-xl border-l-4 bg-white p-5 shadow-sm ${cor}`}>
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{titulo}</p>
      <p className="mt-1 truncate text-2xl font-bold text-gray-800">{valor}</p>
      {detalhe && <p className="mt-0.5 truncate text-xs text-gray-500">{detalhe}</p>}
    </div>
    <Icone size={34} className="shrink-0 opacity-60" />
  </div>
);
