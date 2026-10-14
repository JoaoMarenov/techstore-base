const CHAVE_AVISOS = 'techstore_avisos_reposicao'

export function buscarAvisosReposicao() {
  try {
    const dados = localStorage.getItem(CHAVE_AVISOS)
    const avisos = dados ? JSON.parse(dados) : []
    return Array.isArray(avisos) ? avisos : []
  } catch {
    return []
  }
}

export function registrarAvisoReposicao(produto, nome, email) {
  const avisos = buscarAvisosReposicao()
  const emailNormalizado = email.trim().toLowerCase()
  const duplicado = avisos.some(
    (aviso) =>
      String(aviso.produtoId) === String(produto.id) &&
      String(aviso.clienteEmail).trim().toLowerCase() === emailNormalizado
  )

  if (duplicado) return { sucesso: false, duplicado: true }

  const novoAviso = {
    produtoId: String(produto.id),
    produtoNome: produto.title,
    clienteNome: nome.trim(),
    clienteEmail: email.trim(),
  }

  try {
    localStorage.setItem(CHAVE_AVISOS, JSON.stringify([...avisos, novoAviso]))
    return { sucesso: true }
  } catch {
    return { sucesso: false, erro: true }
  }
}
