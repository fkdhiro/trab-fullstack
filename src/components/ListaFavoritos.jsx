import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import ListGroup from 'react-bootstrap/ListGroup';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { usePersonagens } from '../contexts/PersonagensContext.jsx';

function ListaFavoritos({ aberta, aoFechar }) {
  const { favoritos, abrirDetalhes, alternarFavorito } = usePersonagens();

  function verDetalhes(personagem) {
    aoFechar();
    abrirDetalhes(personagem);
  }

  return (
    <Offcanvas show={aberta} onHide={aoFechar} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Meus favoritos</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {favoritos.length === 0 ? (
          <p className="text-muted">
            Você ainda não tem favoritos. Use o botão ☆ Favoritar nos cards.
          </p>
        ) : (
          <ListGroup>
            {favoritos.map((personagem) => (
              <ListGroup.Item key={personagem.id} className="d-flex align-items-center gap-2">
                <Image src={personagem.image} alt="" roundedCircle width={48} height={48} />
                <Button
                  variant="link"
                  className="p-0 text-start flex-grow-1"
                  onClick={() => verDetalhes(personagem)}
                >
                  {personagem.name}
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => alternarFavorito(personagem)}
                  aria-label={`Remover ${personagem.name} dos favoritos`}
                >
                  Remover
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default ListaFavoritos;
