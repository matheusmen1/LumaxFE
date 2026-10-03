import { useState } from 'react';
import { Campo } from './Campo';
import { FormularioBase } from './FormularioBase';
import { classeInput } from './estilos';

export interface EntidadeNomeDescricao {
  id?: number;
  nome: string;
  descricao?: string;
}

interface Props<T extends EntidadeNomeDescricao> {
  rotuloEntidade: string;
  entidadeParaAlterar?: T | null;
  onCancelar: () => void;
  onSalvar: (entidade: T) => Promise<void>;
}

/** Formulário reaproveitado pelas entidades que possuem apenas nome e descrição. */
export function FormNomeDescricao<T extends EntidadeNomeDescricao>({
  rotuloEntidade,
  entidadeParaAlterar,
  onCancelar,
  onSalvar,
}: Props<T>) {
  const [nome, setNome] = useState(entidadeParaAlterar?.nome ?? '');
  const [descricao, setDescricao] = useState(entidadeParaAlterar?.descricao ?? '');

  const handleSubmit = async () => {
    if (!nome.trim()) throw new Error('Informe o nome.');
    await onSalvar({
      ...(entidadeParaAlterar ?? {}),
      id: entidadeParaAlterar?.id,
      nome: nome.trim(),
      descricao: descricao.trim() || undefined,
    } as T);
  };

  return (
    <FormularioBase
      titulo={entidadeParaAlterar ? `Alterar ${rotuloEntidade}` : `Novo(a) ${rotuloEntidade}`}
      onCancelar={onCancelar}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Campo rotulo="Nome" obrigatorio>
          <input className={classeInput} value={nome} maxLength={100} onChange={(e) => setNome(e.target.value)} required />
        </Campo>
        <Campo rotulo="Descrição">
          <input className={classeInput} value={descricao} maxLength={100} onChange={(e) => setDescricao(e.target.value)} />
        </Campo>
      </div>
    </FormularioBase>
  );
}
