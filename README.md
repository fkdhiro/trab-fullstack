# Multiverso Rick and Morty

Projeto 1 da disciplina de Programação Web Full Stack: uma SPA em React que consome a API JSON do Rick and Morty para buscar personagens, ver detalhes e episódios e montar uma lista de favoritos.

**Aplicação publicada:** https://fkdhiro.github.io/trab-fullstack/

**Autor:** Willian Hiroshi (trabalho individual)

## Funcionalidades

- Carga inicial com todos os personagens, paginada.
- Busca por nome com filtros de status, espécie e gênero, enviados como parâmetros para a API.
- Validação antes do envio: o nome é obrigatório e precisa ter entre 2 e 40 caracteres.
- Mensagens depois do envio: busca sem resultado, erro HTTP da API e falha de conexão.
- Os quatro estados da tela: carregando, erro, vazio e sucesso.
- Paginação com os botões Anterior e Próxima.
- Detalhes do personagem em um modal, com origem, último local e lista de episódios buscada na API.
- Favoritos: botão em cada card e nos detalhes, contador no cabeçalho, painel lateral com a lista e gravação no `localStorage`.

## API

[The Rick and Morty API](https://rickandmortyapi.com/documentation): pública, sem autenticação, com HTTPS e CORS liberado.

| Método | Endpoint | Parâmetros | Uso |
| --- | --- | --- | --- |
| GET | `/character/` | `page` | Carga inicial e paginação |
| GET | `/character/` | `name`, `status`, `species`, `gender`, `page` | Busca com filtros |
| GET | `/episode/{ids}` | ids separados por vírgula | Episódios do personagem |

A API responde `404` quando a busca não encontra nada. A aplicação trata esse caso como "nenhum resultado", e não como erro.

## Hook escolhido: `useReducer`

Todo o estado da aplicação fica em um reducer, em `src/contexts/PersonagensContext.jsx`: personagens, total, página, carregamento, erro, última busca, personagem selecionado e favoritos. Cada mudança é uma ação:

| Ação | O que faz |
| --- | --- |
| `BUSCA_INICIOU` | Liga o carregamento e limpa o erro |
| `BUSCA_SUCESSO` | Guarda os personagens, o total, a página e os filtros usados |
| `BUSCA_ERRO` | Guarda a mensagem de erro e limpa a lista |
| `DETALHES_ABERTOS` / `DETALHES_FECHADOS` | Abre e fecha o modal de detalhes |
| `FAVORITO_ALTERNADO` | Adiciona ou remove um personagem dos favoritos |

Os favoritos são lidos do `localStorage` pela função de inicialização do `useReducer` (terceiro argumento) e gravados com um `useEffect` sempre que mudam.

## Comunicação entre componentes: Context API

O `PersonagensProvider` envolve a aplicação, e os componentes usam o hook `usePersonagens()`. Nenhum componente recebe dados da API por props. Por exemplo, o `BotaoFavorito` (dentro dos cards e do modal) altera os favoritos, e o `Cabecalho` e a `ListaFavoritos` leem o mesmo estado.

## Biblioteca externa: React Bootstrap

Usada em toda a interface: `Navbar`, `Form`, `Card`, `Badge`, `Alert`, `Spinner`, `Modal`, `Offcanvas`, `ListGroup` e `Button`.

## Estrutura

```
src/
  main.jsx
  App.jsx
  contexts/
    PersonagensContext.jsx
  components/
    Cabecalho.jsx
    FormBusca.jsx
    ListaPersonagens.jsx
    CardPersonagem.jsx
    Paginacao.jsx
    DetalhesPersonagem.jsx
    BotaoFavorito.jsx
    ListaFavoritos.jsx
```

## Como rodar

```bash
npm install
npm run dev
```

A URL da API pode ser trocada no arquivo `.env` (veja `.env.example`). Sem esse arquivo, a aplicação usa `https://rickandmortyapi.com/api`.

## Publicação

```bash
npm run deploy
```

O comando gera a pasta `dist/` e publica no branch `gh-pages`, servido pelo GitHub Pages.

## Ferramentas utilizadas

- Vite, React e React Bootstrap
- VS Code
- Git e GitHub / GitHub Pages
- DevTools do navegador para testar as requisições
