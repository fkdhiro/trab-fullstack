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

const estadoInicial = {
  personagens: [],
  total: 0,
  carregando: false,
  erro: null,
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
      dispatch({ type: 'BUSCA_SUCESSO', personagens: dados.results, total: dados.info.count });
    } catch (erro) {
      if (erro.name !== 'AbortError') dispatch({ type: 'BUSCA_ERRO', erro: erro.message });
    }
  }, []);

  const valor = useMemo(
    () => ({ ...estado, carregarPersonagens }),
    [estado, carregarPersonagens],
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
