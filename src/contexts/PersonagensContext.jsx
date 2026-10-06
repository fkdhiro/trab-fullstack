import { createContext, useCallback, useContext, useMemo, useReducer } from 'react';

const API_URL = import.meta.env.VITE_API_URL ?? 'https://rickandmortyapi.com/api';

class ErroApi extends Error {
  constructor(mensagem, status) {
    super(mensagem);
    this.status = status;
  }
}

async function requisicao(caminho, opcoes = {}) {
  let resposta;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, opcoes);
  } catch (erro) {
    if (erro.name === 'AbortError') throw erro;
    throw new ErroApi('Não foi possível conectar à API. Verifique sua conexão.', 0);
  }
  const dados = await resposta.json().catch(() => null);
  if (!resposta.ok) {
    throw new ErroApi(`A API respondeu com erro ${resposta.status}.`, resposta.status);
  }
  return dados;
}

export const STATUS = { alive: 'Vivo', dead: 'Morto', unknown: 'Desconhecido' };

export const GENEROS = {
  female: 'Feminino',
  male: 'Masculino',
  genderless: 'Sem gênero',
  unknown: 'Desconhecido',
};

export const ESPECIES = {
  Human: 'Humano',
  Alien: 'Alienígena',
  Humanoid: 'Humanoide',
  Robot: 'Robô',
  Animal: 'Animal',
  'Mythological Creature': 'Criatura mitológica',
  Poopybutthole: 'Poopybutthole',
  Cronenberg: 'Cronenberg',
  Disease: 'Doença',
  unknown: 'Desconhecida',
};

const estadoInicial = {
  personagens: [],
  total: 0,
  carregando: false,
  erro: null,
  ultimaBusca: null,
};

function personagensReducer(estado, acao) {
  switch (acao.type) {
    case 'BUSCA_INICIOU':
      return { ...estado, carregando: true, erro: null };
    case 'BUSCA_SUCESSO':
      return {
        ...estado,
        carregando: false,
        personagens: acao.personagens,
        total: acao.total,
        ultimaBusca: acao.filtros,
      };
    case 'BUSCA_ERRO':
      return { ...estado, carregando: false, erro: acao.erro, personagens: [], total: 0 };
    default:
      throw new Error(`Ação desconhecida: ${acao.type}`);
  }
}

const PersonagensContext = createContext(null);

export function PersonagensProvider({ children }) {
  const [estado, dispatch] = useReducer(personagensReducer, estadoInicial);

  const carregarPersonagens = useCallback(async (signal) => {
    dispatch({ type: 'BUSCA_INICIOU' });
    try {
      const dados = await requisicao('/character', { signal });
      dispatch({
        type: 'BUSCA_SUCESSO',
        personagens: dados.results,
        total: dados.info.count,
        filtros: null,
      });
    } catch (erro) {
      if (erro.name !== 'AbortError') dispatch({ type: 'BUSCA_ERRO', erro: erro.message });
    }
  }, []);

  const buscarPersonagens = useCallback(async (filtros) => {
    dispatch({ type: 'BUSCA_INICIOU' });
    const params = new URLSearchParams({ name: filtros.nome });
    if (filtros.status) params.append('status', filtros.status);
    if (filtros.especie) params.append('species', filtros.especie);
    if (filtros.genero) params.append('gender', filtros.genero);
    try {
      const dados = await requisicao(`/character/?${params}`);
      dispatch({
        type: 'BUSCA_SUCESSO',
        personagens: dados.results,
        total: dados.info.count,
        filtros,
      });
    } catch (erro) {
      if (erro.status === 404) {
        dispatch({ type: 'BUSCA_SUCESSO', personagens: [], total: 0, filtros });
      } else {
        dispatch({ type: 'BUSCA_ERRO', erro: erro.message });
      }
    }
  }, []);

  const valor = useMemo(
    () => ({ ...estado, carregarPersonagens, buscarPersonagens }),
    [estado, carregarPersonagens, buscarPersonagens],
  );

  return <PersonagensContext.Provider value={valor}>{children}</PersonagensContext.Provider>;
}

export function usePersonagens() {
  const contexto = useContext(PersonagensContext);
  if (!contexto) {
    throw new Error('usePersonagens deve ser usado dentro de <PersonagensProvider>.');
  }
  return contexto;
}
