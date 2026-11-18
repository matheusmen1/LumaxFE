export interface ItemRanking {
  rotulo: string;
  valor: number;
}

/** Soma valores por rótulo. */
export const somarPor = <T,>(lista: T[], rotulo: (item: T) => string, valor: (item: T) => number): ItemRanking[] => {
  const mapa = new Map<string, number>();
  lista.forEach((item) => mapa.set(rotulo(item), (mapa.get(rotulo(item)) ?? 0) + valor(item)));
  return [...mapa.entries()].map(([r, v]) => ({ rotulo: r, valor: v }));
};
