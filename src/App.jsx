import Container from 'react-bootstrap/Container';
import Cabecalho from './components/Cabecalho.jsx';

function App() {
  return (
    <>
      <Cabecalho />
      <Container as="main" className="my-4">
        <p className="text-muted">Em construção.</p>
      </Container>
    </>
  );
}

export default App;
