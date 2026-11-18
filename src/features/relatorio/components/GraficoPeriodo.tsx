import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { criarBuckets, paraDate } from '../../../utils/datas';
import type { Periodo } from '../types/relatorio';

export interface Serie<T> {
  chave: string;
  nome: string;
  cor: string;
  /** Quanto cada registro soma nesta série (0 quando não pertence a ela). */
  valor: (item: T) => number;
}

interface GraficoPeriodoProps<T> {
  dados: T[];
  periodo: Periodo;
  data: (item: T) => string | number[];
  series: Serie<T>[];
  formatar: (valor: number) => string;
  empilhado?: boolean;
  /** Eixo só com inteiros (quantidades). */
  inteiro?: boolean;
}

/** Barras agrupadas por dia (ou por mês em períodos longos), preenchendo os dias sem registro com zero. */
export function GraficoPeriodo<T>({ dados, periodo, data, series, formatar, empilhado, inteiro }: GraficoPeriodoProps<T>) {
  const { buckets, chaveDe } = criarBuckets(periodo.inicio, periodo.fim);
  const linhas = new Map(buckets.map((b) => [b.chave, { rotulo: b.rotulo, ...Object.fromEntries(series.map((s) => [s.chave, 0])) }]));

  dados.forEach((item) => {
    const d = paraDate(data(item));
    const linha = d && (linhas.get(chaveDe(d)) as Record<string, number> | undefined);
    if (!linha) return;
    series.forEach((s) => {
      linha[s.chave] += s.valor(item);
    });
  });

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={[...linhas.values()]} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        <XAxis dataKey="rotulo" tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={{ stroke: '#d1d5db' }} />
        <YAxis
          tick={{ fontSize: 12, fill: '#6b7280' }}
          tickLine={false}
          axisLine={false}
          width={80}
          allowDecimals={!inteiro}
          tickFormatter={(v) => formatar(Number(v))}
        />
        <Tooltip formatter={(v) => formatar(Number(v))} cursor={{ fill: 'rgba(59,130,246,0.08)' }} />
        {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {series.map((s) => (
          <Bar
            key={s.chave}
            dataKey={s.chave}
            name={s.nome}
            fill={s.cor}
            stackId={empilhado ? 'pilha' : undefined}
            radius={empilhado ? undefined : [4, 4, 0, 0]}
            maxBarSize={36}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
