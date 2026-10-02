import { Link } from 'react-router-dom'

export default function NaoEncontrada() {
  return (
    <section>
      <h2>Página não encontrada</h2>
      <Link to="/">Voltar para o início</Link>
    </section>
  )
}
