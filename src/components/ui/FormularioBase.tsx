import { useState, type FormEvent, type ReactNode } from 'react';
import { Save, X } from 'lucide-react';
import { classeBotaoPrimario, classeBotaoSecundario } from './estilos';
import { extrairMensagemErro } from '../../services/api';

interface FormularioBaseProps {
  titulo: string;
  onCancelar: () => void;
  /** Executado no submit; erros lançados aqui são exibidos no topo do formulário. */
  onSubmit: () => Promise<void>;
  children: ReactNode;
}

export const FormularioBase = ({ titulo, onCancelar, onSubmit, children }: FormularioBaseProps) => {
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    try {
      await onSubmit();
    } catch (err) {
      setErro(err instanceof Error && !('isAxiosError' in err) ? err.message : extrairMensagemErro(err, 'Erro ao salvar.'));
      setSalvando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-lumax-blue">{titulo}</h3>
      </div>

      <div className="space-y-5 p-6">
        {erro && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</div>
        )}
        {children}
      </div>

      <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
        <button type="button" onClick={onCancelar} className={classeBotaoSecundario}>
          <X size={16} /> Cancelar
        </button>
        <button type="submit" disabled={salvando} className={classeBotaoPrimario}>
          <Save size={16} /> {salvando ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
};
