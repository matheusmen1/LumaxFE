import { Campo } from './Campo';
import { classeInput } from './estilos';
import { ESTADOS_BR, mascaraCep } from '../../utils/masks';

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

/** Bloco de endereço compartilhado por Cliente e Fornecedor. */
export const CamposEndereco = ({ valor, onChange }: Props) => (
  <fieldset className="space-y-4">
    <legend className="mb-2 text-sm font-semibold uppercase tracking-wide text-lumax-orange">Endereço</legend>
    <div className="grid gap-4 md:grid-cols-6">
      <Campo rotulo="CEP" obrigatorio className="md:col-span-2">
        <input
          className={classeInput}
          value={mascaraCep(valor.cep)}
          onChange={(e) => onChange('cep', e.target.value)}
          placeholder="00000-000"
          required
        />
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
