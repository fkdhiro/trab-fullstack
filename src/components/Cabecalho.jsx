import { NavLink } from 'react-router-dom'

export default function Cabecalho() {
  return (
    <header className="cabecalho">
      <h1>Projeto 1</h1>
      <nav>
        <NavLink to="/">Início</NavLink>
        <NavLink to="/sobre">Sobre</NavLink>
      </nav>
    </header>
  )
}
