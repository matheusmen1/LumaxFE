import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { CrudService } from '../services/crudService';
import { extrairMensagemErro } from '../services/api';

type Modo = 'lista' | 'formulario';

/**
 * Concentra o comportamento padrão das telas "Gerenciar ...":
 * carregar no useEffect, buscar, alternar lista/formulário, salvar e excluir recarregando a lista.
 */
export function useCrud<T extends { id?: number }>(service: CrudService<T>, nomeEntidade: string) {
  const [lista, setLista] = useState<T[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [termoBusca, setTermoBusca] = useState('');
  const [modo, setModo] = useState<Modo>('lista');
  const [entidadeParaAlterar, setEntidadeParaAlterar] = useState<T | null>(null);

  const carregar = useCallback(
    async (filtro = '') => {
      try {
        const dados = filtro.trim() ? await service.buscarPorNome(filtro) : await service.listar();
        setLista(dados);
        setErro(null);
      } catch (e) {
        setLista([]);
        setErro(extrairMensagemErro(e, `Erro ao carregar ${nomeEntidade}.`));
        toast.error(extrairMensagemErro(e, `Erro ao carregar ${nomeEntidade}.`));
      } finally {
        setCarregando(false);
      }
    },
    [service, nomeEntidade],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void carregar();
  }, [carregar]);

  const buscar = () => {
    setCarregando(true);
    void carregar(termoBusca);
  };

  const novo = () => {
    setEntidadeParaAlterar(null);
    setModo('formulario');
  };

  const alterar = (entidade: T) => {
    setEntidadeParaAlterar(entidade);
    setModo('formulario');
  };

  const cancelar = () => {
    setEntidadeParaAlterar(null);
    setModo('lista');
  };

  /** Lança o erro para que o formulário exiba a mensagem. */
  const salvar = async (entidade: T) => {
    if (entidade.id) await service.atualizar(entidade);
    else await service.criar(entidade);
    toast.success(`${nomeEntidade.charAt(0).toUpperCase() + nomeEntidade.slice(1)} salvo com sucesso!`);
    cancelar();
    await carregar(termoBusca);
  };

  const excluir = async (entidade: T) => {
    if (!entidade.id) return;
    try {
      await service.excluir(entidade.id);
      toast.success(`${nomeEntidade.charAt(0).toUpperCase() + nomeEntidade.slice(1)} excluído com sucesso!`);
      await carregar(termoBusca);
    } catch (e) {
      toast.error(extrairMensagemErro(e, `Erro ao excluir ${nomeEntidade}.`));
    }
  };

  return {
    lista,
    carregando,
    erro,
    termoBusca,
    setTermoBusca,
    buscar,
    modo,
    entidadeParaAlterar,
    novo,
    alterar,
    cancelar,
    salvar,
    excluir,
  };
}
