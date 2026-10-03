import { useState } from 'react';
import { Campo } from '../../../components/ui/Campo';
import { CamposEndereco, type Endereco } from '../../../components/ui/CamposEndereco';
import { FormularioBase } from '../../../components/ui/FormularioBase';
import { classeInput } from '../../../components/ui/estilos';
import { mascaraCpf, mascaraTelefone, somenteDigitos } from '../../../utils/masks';
import type { Cliente } from '../types/cliente';

interface Props {
  entidadeParaAlterar?: Cliente | null;
  onCancelar: () => void;
  onSalvar: (cliente: Cliente) => Promise<void>;
}

export const FormCliente = ({ entidadeParaAlterar, onCancelar, onSalvar }: Props) => {
  const [nome, setNome] = useState(entidadeParaAlterar?.nome ?? '');
  const [cpf, setCpf] = useState(entidadeParaAlterar?.cpf ?? '');
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
    if (somenteDigitos(cpf).length !== 11) throw new Error('CPF inválido: informe os 11 dígitos.');
    if (somenteDigitos(telefone).length < 10) throw new Error('Telefone inválido.');
    if (somenteDigitos(endereco.cep).length !== 8) throw new Error('CEP inválido.');

    await onSalvar({
      id: entidadeParaAlterar?.id,
      nome: nome.trim(),
      cpf: somenteDigitos(cpf),
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
      titulo={entidadeParaAlterar ? 'Alterar Cliente' : 'Novo Cliente'}
      onCancelar={onCancelar}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Campo rotulo="Nome" obrigatorio className="md:col-span-2">
          <input className={classeInput} value={nome} maxLength={150} onChange={(e) => setNome(e.target.value)} required />
        </Campo>
        <Campo rotulo="CPF" obrigatorio>
          <input
            className={classeInput}
            value={mascaraCpf(cpf)}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="000.000.000-00"
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
