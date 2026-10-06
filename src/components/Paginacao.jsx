import Button from 'react-bootstrap/Button';
import { usePersonagens } from '../contexts/PersonagensContext.jsx';

function Paginacao() {
  const { pagina, totalPaginas, carregando, irParaPagina } = usePersonagens();

  if (totalPaginas <= 1) return null;

  function mudarPagina(novaPagina) {
    irParaPagina(novaPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <nav className="d-flex justify-content-center align-items-center gap-3 my-4">
      <Button
        variant="outline-primary"
        disabled={carregando || pagina === 1}
        onClick={() => mudarPagina(pagina - 1)}
      >
        Anterior
      </Button>
      <span>
        Página {pagina} de {totalPaginas}
      </span>
      <Button
        variant="outline-primary"
        disabled={carregando || pagina === totalPaginas}
        onClick={() => mudarPagina(pagina + 1)}
      >
        Próxima
      </Button>
    </nav>
  );
}

export default Paginacao;
