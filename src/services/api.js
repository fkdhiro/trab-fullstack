const URL_BASE = import.meta.env.VITE_API_URL

export async function buscar(caminho) {
  const resposta = await fetch(`${URL_BASE}${caminho}`)
  if (!resposta.ok) {
    throw new Error(`Erro ${resposta.status} ao buscar ${caminho}`)
  }
  return resposta.json()
}
