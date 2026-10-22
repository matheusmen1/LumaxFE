import axios from 'axios';
import { somenteDigitos } from '../utils/masks';

export interface ViaCepResposta {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean | string;
}

export const viaCepService = {
  buscarPorCep: async (cep: string): Promise<ViaCepResposta> => {
    const digitos = somenteDigitos(cep);
    if (digitos.length !== 8) {
      throw new Error('CEP inválido: informe os 8 dígitos.');
    }

    const { data } = await axios.get<ViaCepResposta>(`https://viacep.com.br/ws/${digitos}/json/`);
    if (data.erro) {
      throw new Error('CEP não encontrado.');
    }

    return data;
  },
};
