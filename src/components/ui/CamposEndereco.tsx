import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Campo } from './Campo';
import { classeInput } from './estilos';
import { ESTADOS_BR, mascaraCep, somenteDigitos } from '../../utils/masks';
import { viaCepService } from '../../services/viaCepService';

export interface Endereco {
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

interface Props {
  valor: Endereco;
  onChange: (campo: keyof Endereco, valor: string) => void;
}

/** Bloco de endereço compartilhado por Cliente e Fornecedor, integrado ao ViaCEP. */
export const CamposEndereco = ({ valor, onChange }: Props) => {
  const [buscandoCep, setBuscandoCep] = useState(false);

  const consultarCep = async (cepDigitado: string) => {
    const digitos = somenteDigitos(cepDigitado);
    if (digitos.length !== 8) return;

    setBuscandoCep(true);
    try {
      const dados = await viaCepService.buscarPorCep(digitos);
      if (dados.logradouro) onChange('endereco', dados.logradouro);
      if (dados.bairro) onChange('bairro', dados.bairro);
      if (dados.localidade) onChange('cidade', dados.localidade);
      if (dados.uf) onChange('estado', dados.uf);
      toast.success('Endereço preenchido pelo CEP!');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Não foi possível consultar o CEP.');
    } finally {
      setBuscandoCep(false);
    }
  };

  const handleCepChange = (novoCep: string) => {
    const digitosAnteriores = somenteDigitos(valor.cep);
    const digitosNovos = somenteDigitos(novoCep);
    onChange('cep', novoCep);

    if (digitosNovos.length === 8 && digitosNovos !== digitosAnteriores) {
      void consultarCep(digitosNovos);
    }
  };

  return (
    <fieldset className="space-y-4">
      <legend className="mb-2 text-sm font-semibold uppercase tracking-wide text-lumax-orange">Endereço</legend>
      <div className="grid gap-4 md:grid-cols-6">
        <Campo rotulo="CEP" obrigatorio className="md:col-span-2">
          <div className="relative">
            <input
              className={classeInput}
              value={mascaraCep(valor.cep)}
              onChange={(e) => handleCepChange(e.target.value)}
              placeholder="00000-000"
              required
            />
            {buscandoCep && (
              <Loader2
                size={16}
                className=" absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-lumax-blue"
              />
            )}
          </div>
        </Campo>
        <Campo rotulo="Logradouro" obrigatorio className="md:col-span-3">
          <input
            className={classeInput}
            value={valor.endereco}
            maxLength={150}
            onChange={(e) => onChange('endereco', e.target.value)}
            required
          />
        </Campo>
        <Campo rotulo="Número" obrigatorio className="md:col-span-1">
          <input
            type="number"
            min={0}
            className={classeInput}
            value={valor.numero}
            onChange={(e) => onChange('numero', e.target.value)}
            required
          />
        </Campo>
        <Campo rotulo="Bairro" obrigatorio className="md:col-span-2">
          <input
            className={classeInput}
            value={valor.bairro}
            maxLength={100}
            onChange={(e) => onChange('bairro', e.target.value)}
            required
          />
        </Campo>
        <Campo rotulo="Cidade" obrigatorio className="md:col-span-3">
          <input
            className={classeInput}
            value={valor.cidade}
            maxLength={100}
            onChange={(e) => onChange('cidade', e.target.value)}
            required
          />
        </Campo>
        <Campo rotulo="UF" obrigatorio className="md:col-span-1">
          <select className={classeInput} value={valor.estado} onChange={(e) => onChange('estado', e.target.value)} required>
            <option value="">--</option>
            {ESTADOS_BR.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </select>
        </Campo>
      </div>
    </fieldset>
  );
};
