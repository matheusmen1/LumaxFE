import { useState } from 'react';
import { Campo } from '../../../components/ui/Campo';
import { CamposEndereco, type Endereco } from '../../../components/ui/CamposEndereco';
import { FormularioBase } from '../../../components/ui/FormularioBase';
import { classeInput } from '../../../components/ui/estilos';
import { mascaraCnpj, mascaraTelefone, somenteDigitos } from '../../../utils/masks';
import type { Fornecedor } from '../types/fornecedor';

interface Props {
  entidadeParaAlterar?: Fornecedor | null;
  onCancelar: () => void;
  onSalvar: (fornecedor: Fornecedor) => Promise<void>;
}

export const FormFornecedor = ({ entidadeParaAlterar, onCancelar, onSalvar }: Props) => {
  const [razaoSocial, setRazaoSocial] = useState(entidadeParaAlterar?.razaoSocial ?? '');
  const [cnpj, setCnpj] = useState(entidadeParaAlterar?.cnpj ?? '');
  const [telefone, setTelefone] = useState(entidadeParaAlterar?.telefone ?? '');
  const [email, setEmail] = useState(entidadeParaAlterar?.email ?? '');
  const [endereco, setEndereco] = useState<Endereco>({
    endereco: entidadeParaAlterar?.endereco ?? '',
    numero: entidadeParaAlterar?.numero != null ? String(entidadeParaAlterar.numero) : '',
    bairro: entidadeParaAlterar?.bairro ?? '',
    cidade: entidadeParaAlterar?.cidade ?? '',
    estado: entidadeParaAlterar?.estado ?? '',
    cep: entidadeParaAlterar?.cep ?? '',
  });

  const handleSubmit = async () => {
    // for_cnpj é VARCHAR(14) no banco: enviar apenas os dígitos.
    if (somenteDigitos(cnpj).length !== 14) throw new Error('CNPJ inválido: informe os 14 dígitos.');
    if (somenteDigitos(telefone).length < 10) throw new Error('Telefone inválido.');
    if (somenteDigitos(endereco.cep).length !== 8) throw new Error('CEP inválido.');

    await onSalvar({
      id: entidadeParaAlterar?.id,
      razaoSocial: razaoSocial.trim(),
      cnpj: somenteDigitos(cnpj),
      telefone: somenteDigitos(telefone),
      email: email.trim(),
      endereco: endereco.endereco.trim(),
      numero: Number(endereco.numero),
      bairro: endereco.bairro.trim(),
      cidade: endereco.cidade.trim(),
      estado: endereco.estado,
      cep: somenteDigitos(endereco.cep),
    });
  };

  return (
    <FormularioBase
      titulo={entidadeParaAlterar ? 'Alterar Fornecedor' : 'Novo Fornecedor'}
      onCancelar={onCancelar}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Campo rotulo="Razão Social" obrigatorio className="md:col-span-2">
          <input
            className={classeInput}
            value={razaoSocial}
            maxLength={150}
            onChange={(e) => setRazaoSocial(e.target.value)}
            required
          />
        </Campo>
        <Campo rotulo="CNPJ" obrigatorio>
          <input
            className={classeInput}
            value={mascaraCnpj(cnpj)}
            onChange={(e) => setCnpj(e.target.value)}
            placeholder="00.000.000/0000-00"
            required
          />
        </Campo>
        <Campo rotulo="Telefone" obrigatorio>
          <input
            className={classeInput}
            value={mascaraTelefone(telefone)}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="(00) 00000-0000"
            required
          />
        </Campo>
        <Campo rotulo="E-mail" obrigatorio className="md:col-span-2">
          <input
            type="email"
            className={classeInput}
            value={email}
            maxLength={100}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Campo>
      </div>

      <CamposEndereco valor={endereco} onChange={(campo, valor) => setEndereco((atual) => ({ ...atual, [campo]: valor }))} />
    </FormularioBase>
  );
};
