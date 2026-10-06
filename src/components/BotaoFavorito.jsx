import Button from 'react-bootstrap/Button';
import { usePersonagens } from '../contexts/PersonagensContext.jsx';

function BotaoFavorito({ personagem, size }) {
  const { ehFavorito, alternarFavorito } = usePersonagens();
  const ativo = ehFavorito(personagem.id);

  return (
    <Button
      variant={ativo ? 'warning' : 'outline-warning'}
      size={size}
      onClick={() => alternarFavorito(personagem)}
      aria-pressed={ativo}
    >
      {ativo ? '★ Favorito' : '☆ Favoritar'}
    </Button>
  );
}

export default BotaoFavorito;
