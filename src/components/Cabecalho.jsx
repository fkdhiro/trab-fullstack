import { useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { usePersonagens } from '../contexts/PersonagensContext.jsx';
import ListaFavoritos from './ListaFavoritos.jsx';

function Cabecalho() {
  const { favoritos } = usePersonagens();
  const [favoritosAbertos, setFavoritosAbertos] = useState(false);

  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand>Multiverso Rick and Morty</Navbar.Brand>
        <Button variant="outline-warning" onClick={() => setFavoritosAbertos(true)}>
          ★ Favoritos <Badge bg="warning" text="dark">{favoritos.length}</Badge>
        </Button>
      </Container>
      <ListaFavoritos aberta={favoritosAbertos} aoFechar={() => setFavoritosAbertos(false)} />
    </Navbar>
  );
}

export default Cabecalho;
