export function obterPrecoValido(valor) {
  if (typeof valor !== 'number' && typeof valor !== 'string') return null
  if (typeof valor === 'string' && valor.trim() === '') return null

  const preco = Number(valor)
  if (!Number.isFinite(preco) || preco < 0) return null

  return preco
}

export function produtoTemPreco(produto) {
  return obterPrecoValido(produto?.price) !== null
}
