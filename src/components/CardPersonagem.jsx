import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { ESPECIES, STATUS, usePersonagens } from '../contexts/PersonagensContext.jsx';

const CORES_STATUS = { alive: 'success', dead: 'danger', unknown: 'secondary' };

function CardPersonagem({ personagem }) {
  const { abrirDetalhes } = usePersonagens();
  const status = personagem.status.toLowerCase();

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img variant="top" src={personagem.image} alt={personagem.name} loading="lazy" />
      <Card.Body>
        <Card.Title>{personagem.name}</Card.Title>
        <Card.Subtitle className="text-muted mb-2">
          {ESPECIES[personagem.species] ?? personagem.species}
        </Card.Subtitle>
        <Badge bg={CORES_STATUS[status] ?? 'secondary'}>{STATUS[status] ?? personagem.status}</Badge>
        <Card.Text className="small mt-2 mb-0">
          Visto por último em: {personagem.location?.name ?? 'desconhecido'}
        </Card.Text>
      </Card.Body>
      <Card.Footer className="bg-transparent border-0 pt-0 pb-3">
        <Button variant="primary" size="sm" onClick={() => abrirDetalhes(personagem)}>
          Ver detalhes
        </Button>
      </Card.Footer>
    </Card>
  );
}

export default CardPersonagem;
