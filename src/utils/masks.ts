export const somenteDigitos = (valor: string): string => (valor ?? '').replace(/\D/g, '');

export const mascaraCpf = (valor: string): string =>
  somenteDigitos(valor)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

export const mascaraCnpj = (valor: string): string =>
  somenteDigitos(valor)
    .slice(0, 14)
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');

export const mascaraTelefone = (valor: string): string => {
  const d = somenteDigitos(valor).slice(0, 11);
  if (d.length <= 10) {
    return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d{1,4})$/, '$1-$2');
  }
  return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{1,4})$/, '$1-$2');
};

export const mascaraCep = (valor: string): string =>
  somenteDigitos(valor).slice(0, 8).replace(/(\d{5})(\d{1,3})$/, '$1-$2');

export const formatarMoeda = (valor?: number | null): string =>
  valor == null ? '-' : valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const ESTADOS_BR = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
  'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

/** Aceita ISO string ("2026-11-05T08:30:00") ou array do Jackson ([2026, 11, 5, 8, 30, 0]). */
export const formatarDataHora = (valor?: string | number[] | null): string => {
  if (!valor) return '-';
  const data = Array.isArray(valor)
    ? new Date(valor[0], (valor[1] ?? 1) - 1, valor[2] ?? 1, valor[3] ?? 0, valor[4] ?? 0, valor[5] ?? 0)
    : new Date(valor);
  return Number.isNaN(data.getTime()) ? '-' : data.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
};
