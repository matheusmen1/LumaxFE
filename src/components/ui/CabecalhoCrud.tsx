import type { FormEvent } from 'react';
import { Plus, Search } from 'lucide-react';
import { classeBotaoDestaque, classeBotaoPrimario, classeInput } from './estilos';

interface CabecalhoCrudProps {
  titulo: string;
  subtitulo?: string;
  termoBusca: string;
  placeholderBusca?: string;
  onTermoBuscaChange: (valor: string) => void;
  onBuscar: () => void;
  onNovo: () => void;
}

export const CabecalhoCrud = ({
  titulo,
  subtitulo,
  termoBusca,
  placeholderBusca = 'Buscar por nome...',
  onTermoBuscaChange,
  onBuscar,
  onNovo,
}: CabecalhoCrudProps) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onBuscar();
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-lumax-blue">{titulo}</h2>
          {subtitulo && <p className="text-sm text-gray-500">{subtitulo}</p>}
        </div>
        <button type="button" onClick={onNovo} className={classeBotaoDestaque}>
          <Plus size={18} /> Novo
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={termoBusca}
          onChange={(e) => onTermoBuscaChange(e.target.value)}
          placeholder={placeholderBusca}
          className={`${classeInput} max-w-md`}
        />
        <button type="submit" className={classeBotaoPrimario}>
          <Search size={16} /> Buscar
        </button>
      </form>
    </div>
  );
};
