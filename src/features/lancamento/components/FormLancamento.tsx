import { useEffect, useState } from 'react';
import { Campo } from '../../../components/ui/Campo';
import { FormularioBase } from '../../../components/ui/FormularioBase';
import { classeInput } from '../../../components/ui/estilos';
import { tipoDespesaService } from '../../../services/tipoDespesaService';
import type { TipoDespesa } from '../../tipoDespesa/types/tipoDespesa';
import type { Lancamento } from '../types/lancamento';

interface Props {
  entidadeParaAlterar?: Lancamento | null;
  onCancelar: () => void;
  onSalvar: (lancamento: Lancamento) => Promise<void>;
}

const formatarParaInputDateTime = (valor?: string | number[] | null): string => {
  if (!valor) {
    const agora = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${agora.getFullYear()}-${pad(agora.getMonth() + 1)}-${pad(agora.getDate())}T${pad(agora.getHours())}:${pad(agora.getMinutes())}`;
  }
  const d = Array.isArray(valor)
    ? new Date(valor[0], (valor[1] ?? 1) - 1, valor[2] ?? 1, valor[3] ?? 0, valor[4] ?? 0, valor[5] ?? 0)
    : new Date(valor);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const FormLancamento = ({ entidadeParaAlterar, onCancelar, onSalvar }: Props) => {
  const [tipoDespesaId, setTipoDespesaId] = useState(
    entidadeParaAlterar?.tipoDespesa?.id ? String(entidadeParaAlterar.tipoDespesa.id) : '',
  );
  const [valorTotal, setValorTotal] = useState(
    entidadeParaAlterar?.valorTotal != null ? String(entidadeParaAlterar.valorTotal) : '',
  );
  const [observacao, setObservacao] = useState(entidadeParaAlterar?.observacao ?? '');
  const [dataHora, setDataHora] = useState(formatarParaInputDateTime(entidadeParaAlterar?.dataHora));

  const [tiposDespesa, setTiposDespesa] = useState<TipoDespesa[]>([]);
  const [carregandoOpcoes, setCarregandoOpcoes] = useState(true);
  const [erroOpcoes, setErroOpcoes] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    tipoDespesaService
      .listar()
      .then((lista) => {
        if (!ativo) return;
        setTiposDespesa(lista);
        if (!entidadeParaAlterar && lista.length === 1 && lista[0].id) {
          setTipoDespesaId(String(lista[0].id));
        }
      })
      .catch(() => {
        if (ativo) setErroOpcoes('Não foi possível carregar os tipos de despesa.');
      })
      .finally(() => {
        if (ativo) setCarregandoOpcoes(false);
      });
    return () => {
      ativo = false;
    };
  }, [entidadeParaAlterar]);

  const handleSubmit = async () => {
    if (!tipoDespesaId) throw new Error('Selecione o tipo de despesa.');
    const valorNumero = Number(valorTotal);
    if (!(valorNumero > 0)) throw new Error('Informe um valor maior que zero.');

    const payload: unknown = {
      id: entidadeParaAlterar?.id,
      tipoDespesaId: Number(tipoDespesaId),
      tipoDespesa: { id: Number(tipoDespesaId) },
      valorTotal: valorNumero,
      observacao: observacao.trim() || null,
      dataHora: dataHora ? `${dataHora}:00` : null,
      usuario: entidadeParaAlterar?.usuario,
    };

    await onSalvar(payload as Lancamento);
  };

  const semTipos = !carregandoOpcoes && tiposDespesa.length === 0;

  return (
    <FormularioBase
      titulo={entidadeParaAlterar ? 'Alterar Lançamento de Despesa' : 'Novo Lançamento de Despesa'}
      onCancelar={onCancelar}
      onSubmit={handleSubmit}
    >
      {erroOpcoes && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{erroOpcoes}</div>
      )}
      {semTipos && !erroOpcoes && (
        <div className="rounded-lg border border-lumax-yellow/50 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          Para realizar um lançamento é necessário ter ao menos um tipo de despesa cadastrado no sistema.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Campo rotulo="Tipo de Despesa" obrigatorio>
          <select
            className={classeInput}
            value={tipoDespesaId}
            onChange={(e) => setTipoDespesaId(e.target.value)}
            disabled={carregandoOpcoes || semTipos}
            required
          >
            <option value="">{carregandoOpcoes ? 'Carregando...' : 'Selecione...'}</option>
            {tiposDespesa.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nome}
              </option>
            ))}
          </select>
        </Campo>

        <Campo rotulo="Valor Total (R$)" obrigatorio>
          <input
            type="number"
            step="0.01"
            min="0.01"
            className={classeInput}
            value={valorTotal}
            onChange={(e) => setValorTotal(e.target.value)}
            placeholder="0,00"
            required
          />
        </Campo>

        <Campo rotulo="Data e Hora" obrigatorio>
          <input
            type="datetime-local"
            className={classeInput}
            value={dataHora}
            onChange={(e) => setDataHora(e.target.value)}
            required
          />
        </Campo>

        <Campo rotulo={`Observação (${observacao.length}/100)`} className="md:col-span-2">
          <input
            type="text"
            className={classeInput}
            value={observacao}
            maxLength={100}
            onChange={(e) => setObservacao(e.target.value)}
            placeholder="Detalhes ou justificativa da despesa (opcional)"
          />
        </Campo>
      </div>
    </FormularioBase>
  );
};
