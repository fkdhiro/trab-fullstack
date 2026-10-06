import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { ESPECIES, GENEROS, STATUS, usePersonagens } from '../contexts/PersonagensContext.jsx';

const VAZIO = { nome: '', status: '', especie: '', genero: '' };

function validarBusca({ nome }) {
  const erros = {};
  if (nome.trim() === '') {
    erros.nome = 'Informe o nome do personagem.';
  } else if (nome.trim().length < 2) {
    erros.nome = 'Digite pelo menos 2 caracteres.';
  } else if (nome.trim().length > 40) {
    erros.nome = 'Digite no máximo 40 caracteres.';
  }
  return erros;
}

function FormBusca() {
  const { buscarPersonagens, carregando } = usePersonagens();
  const [filtros, setFiltros] = useState(VAZIO);
  const [erros, setErros] = useState({});

  function handleChange(evento) {
    const { name, value } = evento.target;
    setFiltros((anterior) => ({ ...anterior, [name]: value }));
  }

  function handleSubmit(evento) {
    evento.preventDefault();
    const errosEncontrados = validarBusca(filtros);
    setErros(errosEncontrados);
    if (Object.keys(errosEncontrados).length > 0) return;
    buscarPersonagens({ ...filtros, nome: filtros.nome.trim() });
  }

  return (
    <Form className="card card-body" onSubmit={handleSubmit} noValidate>
      <Row className="g-3 align-items-start">
        <Col md={4}>
          <Form.Group controlId="nome">
            <Form.Label>Nome *</Form.Label>
            <Form.Control
              name="nome"
              placeholder="ex.: Rick, Morty, Summer"
              value={filtros.nome}
              onChange={handleChange}
              isInvalid={Boolean(erros.nome)}
            />
            <Form.Control.Feedback type="invalid">{erros.nome}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={4} md={2}>
          <Form.Group controlId="status">
            <Form.Label>Status</Form.Label>
            <Form.Select name="status" value={filtros.status} onChange={handleChange}>
              <option value="">Todos</option>
              {Object.entries(STATUS).map(([valor, texto]) => (
                <option key={valor} value={valor}>{texto}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col sm={4} md={2}>
          <Form.Group controlId="especie">
            <Form.Label>Espécie</Form.Label>
            <Form.Select name="especie" value={filtros.especie} onChange={handleChange}>
              <option value="">Todas</option>
              {Object.entries(ESPECIES).map(([valor, texto]) => (
                <option key={valor} value={valor}>{texto}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col sm={4} md={2}>
          <Form.Group controlId="genero">
            <Form.Label>Gênero</Form.Label>
            <Form.Select name="genero" value={filtros.genero} onChange={handleChange}>
              <option value="">Todos</option>
              {Object.entries(GENEROS).map(([valor, texto]) => (
                <option key={valor} value={valor}>{texto}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={2} className="d-grid">
          <Form.Label className="invisible d-none d-md-block">Buscar</Form.Label>
          <Button type="submit" disabled={carregando}>
            {carregando ? 'Buscando...' : 'Buscar'}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default FormBusca;
