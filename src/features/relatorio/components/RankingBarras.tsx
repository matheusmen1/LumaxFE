import type { ItemRanking } from '../agregacao';

interface RankingBarrasProps {
  itens: ItemRanking[];
  formatar: (valor: number) => string;
  /** Classe de fundo da barra, ex.: 'bg-lumax-orange'. */
  corBarra: string;
  limite?: number;
}

/** Lista ordenada com barra proporcional ao maior valor (top N). */
export const RankingBarras = ({ itens, formatar, corBarra, limite = 6 }: RankingBarrasProps) => {
  const ordenados = [...itens].sort((a, b) => b.valor - a.valor).slice(0, limite);
  const maior = ordenados[0]?.valor || 1;

  if (ordenados.length === 0) return <p className="py-8 text-center text-sm text-gray-400">Sem dados no período.</p>;

  return (
    <ul className="space-y-3">
      {ordenados.map((i) => (
        <li key={i.rotulo}>
          <div className="mb-1 flex justify-between gap-3 text-sm">
            <span className="truncate text-gray-700">{i.rotulo}</span>
            <span className="shrink-0 font-semibold text-gray-800">{formatar(i.valor)}</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100">
            <div className={`h-2 rounded-full ${corBarra}`} style={{ width: `${(i.valor / maior) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
};
