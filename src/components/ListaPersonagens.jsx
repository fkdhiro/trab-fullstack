import { useEffect } from 'react';
import { usePersonagens } from '../contexts/PersonagensContext.jsx';

function ListaPersonagens() {
  const { personagens, total, carregando, erro, carregarPersonagens } = usePersonagens();

  useEffect(() => {
    const controlador = new AbortController();
    carregarPersonagens(controlador.signal);
    return () => controlador.abort();
  }, [carregarPersonagens]);

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p className="text-danger">{erro}</p>;

  return (
    <section className="my-4">
      <p className="text-muted">{total} personagens no total.</p>
      <ul>
        {personagens.map((personagem) => (
          <li key={personagem.id}>{personagem.name}</li>
        ))}
      </ul>
    </section>
  );
}

export default ListaPersonagens;
