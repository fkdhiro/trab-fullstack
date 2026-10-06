import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';

const API_URL = import.meta.env.VITE_API_URL ?? 'https://rickandmortyapi.com/api';
const CHAVE_FAVORITOS = 'favoritos-rick-and-morty';

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
  pagina: 1,
  totalPaginas: 0,
  carregando: false,
  erro: null,
  ultimaBusca: null,
  selecionado: null,
  favoritos: [],
};

function iniciarEstado(estado) {
  try {
    const salvos = JSON.parse(localStorage.getItem(CHAVE_FAVORITOS));
    return Array.isArray(salvos) ? { ...estado, favoritos: salvos } : estado;
  } catch {
    return estado;
  }
}

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
        pagina: acao.pagina,
        totalPaginas: acao.totalPaginas,
        ultimaBusca: acao.filtros,
      };
    case 'BUSCA_ERRO':
      return {
        ...estado,
        carregando: false,
        erro: acao.erro,
        personagens: [],
        total: 0,
        totalPaginas: 0,
      };
    case 'DETALHES_ABERTOS':
      return { ...estado, selecionado: acao.personagem };
    case 'DETALHES_FECHADOS':
      return { ...estado, selecionado: null };
    case 'FAVORITO_ALTERNADO': {
      const jaEraFavorito = estado.favoritos.some((p) => p.id === acao.personagem.id);
      return {
        ...estado,
        favoritos: jaEraFavorito
          ? estado.favoritos.filter((p) => p.id !== acao.personagem.id)
          : [...estado.favoritos, acao.personagem],
      };
    }
    default:
      throw new Error(`Ação desconhecida: ${acao.type}`);
  }
}

function montarParametros(filtros, pagina) {
  const params = new URLSearchParams({ page: pagina });
  if (!filtros) return params;
  params.append('name', filtros.nome);
  if (filtros.status) params.append('status', filtros.status);
  if (filtros.especie) params.append('species', filtros.especie);
  if (filtros.genero) params.append('gender', filtros.genero);
  return params;
}

const PersonagensContext = createContext(null);

export function PersonagensProvider({ children }) {
  const [estado, dispatch] = useReducer(personagensReducer, estadoInicial, iniciarEstado);

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(estado.favoritos));
    } catch {
      return;
    }
  }, [estado.favoritos]);

  const consultar = useCallback(async (filtros, pagina, signal) => {
    dispatch({ type: 'BUSCA_INICIOU' });
    try {
      const params = montarParametros(filtros, pagina);
      const dados = await requisicao(`/character/?${params}`, { signal });
      dispatch({
        type: 'BUSCA_SUCESSO',
        personagens: dados.results,
        total: dados.info.count,
        pagina,
        totalPaginas: dados.info.pages,
        filtros,
      });
    } catch (erro) {
      if (erro.name === 'AbortError') return;
      if (erro.status === 404) {
        dispatch({
          type: 'BUSCA_SUCESSO',
          personagens: [],
          total: 0,
          pagina: 1,
          totalPaginas: 0,
          filtros,
        });
      } else {
        dispatch({ type: 'BUSCA_ERRO', erro: erro.message });
      }
    }
  }, []);

  const carregarPersonagens = useCallback((signal) => consultar(null, 1, signal), [consultar]);

  const buscarPersonagens = useCallback((filtros) => consultar(filtros, 1), [consultar]);

  const irParaPagina = useCallback(
    (pagina) => consultar(estado.ultimaBusca, pagina),
    [consultar, estado.ultimaBusca],
  );

  const abrirDetalhes = useCallback(
    (personagem) => dispatch({ type: 'DETALHES_ABERTOS', personagem }),
    [],
  );

  const fecharDetalhes = useCallback(() => dispatch({ type: 'DETALHES_FECHADOS' }), []);

  const buscarEpisodios = useCallback(async (personagem, signal) => {
    const ids = personagem.episode.map((url) => url.split('/').pop());
    if (ids.length === 0) return [];
    const dados = await requisicao(`/episode/${ids.join(',')}`, { signal });
    return Array.isArray(dados) ? dados : [dados];
  }, []);

  const alternarFavorito = useCallback(
    (personagem) => dispatch({ type: 'FAVORITO_ALTERNADO', personagem }),
    [],
  );

  const ehFavorito = useCallback(
    (id) => estado.favoritos.some((p) => p.id === id),
    [estado.favoritos],
  );

  const valor = useMemo(
    () => ({
      ...estado,
      carregarPersonagens,
      buscarPersonagens,
      irParaPagina,
      abrirDetalhes,
      fecharDetalhes,
      buscarEpisodios,
      alternarFavorito,
      ehFavorito,
    }),
    [
      estado,
      carregarPersonagens,
      buscarPersonagens,
      irParaPagina,
      abrirDetalhes,
      fecharDetalhes,
      buscarEpisodios,
      alternarFavorito,
      ehFavorito,
    ],
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
