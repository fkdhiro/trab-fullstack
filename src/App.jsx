import { Routes, Route } from 'react-router-dom'
import Cabecalho from './components/Cabecalho.jsx'
import Inicio from './pages/Inicio.jsx'
import Sobre from './pages/Sobre.jsx'
import NaoEncontrada from './pages/NaoEncontrada.jsx'

export default function App() {
  return (
    <>
      <Cabecalho />
      <main className="conteudo">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="*" element={<NaoEncontrada />} />
        </Routes>
      </main>
    </>
  )
}
