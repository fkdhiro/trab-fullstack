import Container from 'react-bootstrap/Container';
import Cabecalho from './components/Cabecalho.jsx';
import DetalhesPersonagem from './components/DetalhesPersonagem.jsx';
import FormBusca from './components/FormBusca.jsx';
import ListaPersonagens from './components/ListaPersonagens.jsx';
import Paginacao from './components/Paginacao.jsx';

function App() {
  return (
    <>
      <Cabecalho />
      <Container as="main" className="my-4">
        <FormBusca />
        <ListaPersonagens />
        <Paginacao />
      </Container>
      <DetalhesPersonagem />
    </>
  );
}

export default App;
