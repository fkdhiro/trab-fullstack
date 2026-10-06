import { useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { usePersonagens } from '../contexts/PersonagensContext.jsx';
import CardPersonagem from './CardPersonagem.jsx';

function ListaPersonagens() {
  const { personagens, total, carregando, erro, ultimaBusca, carregarPersonagens } =
    usePersonagens();

  useEffect(() => {
    const controlador = new AbortController();
    carregarPersonagens(controlador.signal);
    return () => controlador.abort();
  }, [carregarPersonagens]);

  if (carregando) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" aria-label="Carregando" />
      </div>
    );
  }

  if (erro) {
    return (
      <Alert variant="danger" className="my-4">
        <strong>Não foi possível concluir a busca.</strong> {erro}
      </Alert>
    );
  }

  if (personagens.length === 0) {
    return (
      <Alert variant="warning" className="my-4">
        Nenhum personagem encontrado{ultimaBusca ? ` para "${ultimaBusca.nome}"` : ''}.
      </Alert>
    );
  }

  return (
    <section className="my-4">
      <p className="text-muted">
        {ultimaBusca
          ? `${total} personagem(ns) encontrado(s) para "${ultimaBusca.nome}".`
          : `Todos os personagens do multiverso (${total} no total).`}
      </p>
      <Row xs={1} sm={2} md={3} lg={4} className="g-3">
        {personagens.map((personagem) => (
          <Col key={personagem.id}>
            <CardPersonagem personagem={personagem} />
          </Col>
        ))}
      </Row>
    </section>
  );
}

export default ListaPersonagens;
