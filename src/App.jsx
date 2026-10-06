import Container from 'react-bootstrap/Container';
import Cabecalho from './components/Cabecalho.jsx';
import FormBusca from './components/FormBusca.jsx';
import ListaPersonagens from './components/ListaPersonagens.jsx';

function App() {
  return (
    <>
      <Cabecalho />
      <Container as="main" className="my-4">
        <FormBusca />
        <ListaPersonagens />
      </Container>
    </>
  );
}

export default App;
