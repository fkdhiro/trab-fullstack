import { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Image from 'react-bootstrap/Image';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import { ESPECIES, GENEROS, STATUS, usePersonagens } from '../contexts/PersonagensContext.jsx';
import BotaoFavorito from './BotaoFavorito.jsx';

function ConteudoDetalhes({ selecionado }) {
  const { fecharDetalhes, buscarEpisodios } = usePersonagens();
  const [episodios, setEpisodios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const controlador = new AbortController();
    buscarEpisodios(selecionado, controlador.signal)
      .then(setEpisodios)
      .catch((e) => {
        if (e.name !== 'AbortError') setErro(e.message);
      })
      .finally(() => {
        if (!controlador.signal.aborted) setCarregando(false);
      });
    return () => controlador.abort();
  }, [selecionado, buscarEpisodios]);

  const status = selecionado.status.toLowerCase();
  const genero = selecionado.gender.toLowerCase();

  return (
    <Modal show onHide={fecharDetalhes} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>{selecionado.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column flex-sm-row gap-3 mb-3">
          <Image src={selecionado.image} alt={selecionado.name} rounded width={180} height={180} />
          <dl className="mb-0">
            <dt>Status</dt>
            <dd>{STATUS[status] ?? selecionado.status}</dd>
            <dt>Espécie</dt>
            <dd>
              {ESPECIES[selecionado.species] ?? selecionado.species}
              {selecionado.type && ` (${selecionado.type})`}
            </dd>
            <dt>Gênero</dt>
            <dd>{GENEROS[genero] ?? selecionado.gender}</dd>
            <dt>Origem</dt>
            <dd>{selecionado.origin?.name ?? 'Desconhecida'}</dd>
            <dt>Último local conhecido</dt>
            <dd>{selecionado.location?.name ?? 'Desconhecido'}</dd>
          </dl>
        </div>
        <div className="mb-3">
          <BotaoFavorito personagem={selecionado} />
        </div>

        <h2 className="h6">Episódios ({selecionado.episode.length})</h2>
        {carregando && (
          <div className="text-center my-3">
            <Spinner animation="border" size="sm" role="status" aria-label="Carregando episódios" />
          </div>
        )}
        {erro && (
          <Alert variant="danger">
            Não foi possível carregar os episódios. {erro}
          </Alert>
        )}
        {!carregando && !erro && episodios.length > 0 && (
          <ListGroup variant="flush">
            {episodios.map((episodio) => (
              <ListGroup.Item key={episodio.id} className="d-flex justify-content-between gap-2">
                <span>
                  <strong>{episodio.episode}</strong> {episodio.name}
                </span>
                <span className="text-muted small text-nowrap">{episodio.air_date}</span>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
    </Modal>
  );
}

function DetalhesPersonagem() {
  const { selecionado } = usePersonagens();
  if (!selecionado) return null;
  return <ConteudoDetalhes key={selecionado.id} selecionado={selecionado} />;
}

export default DetalhesPersonagem;
