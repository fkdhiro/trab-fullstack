import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function Cabecalho() {
  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand>Multiverso Rick and Morty</Navbar.Brand>
        <Navbar.Text className="small">Dados: The Rick and Morty API</Navbar.Text>
      </Container>
    </Navbar>
  );
}

export default Cabecalho;
