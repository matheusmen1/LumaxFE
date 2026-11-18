/** Converte ISO string ("2026-11-05T08:30:00") ou array do Jackson ([2026, 11, 5, 8, 30]) em Date. */
export const paraDate = (valor?: string | number[] | null): Date | null => {
  if (!valor) return null;
  const data = Array.isArray(valor)
    ? new Date(valor[0], (valor[1] ?? 1) - 1, valor[2] ?? 1, valor[3] ?? 0, valor[4] ?? 0, valor[5] ?? 0)
    : new Date(valor);
  return Number.isNaN(data.getTime()) ? null : data;
};

const doisDigitos = (n: number) => String(n).padStart(2, '0');

/** Data local no formato yyyy-MM-dd (o formato do <input type="date"> e da API de relatórios). */
export const paraISODate = (data: Date): string =>
  `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`;

/** Lê yyyy-MM-dd como data local (new Date('yyyy-MM-dd') seria UTC). */
export const deISODate = (valor: string): Date => {
  const [a, m, d] = valor.split('-').map(Number);
  return new Date(a, m - 1, d);
};

export const formatarData = (valor: string): string => deISODate(valor).toLocaleDateString('pt-BR');

export interface Bucket {
  chave: string;
  rotulo: string;
}

/**
 * Divide o período em dias (até 62 dias) ou meses (períodos maiores), para os gráficos.
 * Devolve os buckets vazios e a função que diz em qual bucket uma data cai.
 */
export const criarBuckets = (inicio: string, fim: string): { buckets: Bucket[]; chaveDe: (d: Date) => string } => {
  const ini = deISODate(inicio);
  const end = deISODate(fim);
  const dias = Math.round((end.getTime() - ini.getTime()) / 86_400_000) + 1;
  const porMes = dias > 62;
  const chaveDe = (d: Date) => (porMes ? `${d.getFullYear()}-${doisDigitos(d.getMonth() + 1)}` : paraISODate(d));

  const buckets: Bucket[] = [];
  const cursor = new Date(ini);
  if (porMes) cursor.setDate(1);
  while (cursor <= end) {
    buckets.push({
      chave: chaveDe(cursor),
      rotulo: porMes
        ? cursor.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
        : `${doisDigitos(cursor.getDate())}/${doisDigitos(cursor.getMonth() + 1)}`,
    });
    if (porMes) cursor.setMonth(cursor.getMonth() + 1);
    else cursor.setDate(cursor.getDate() + 1);
  }
  return { buckets, chaveDe };
};
