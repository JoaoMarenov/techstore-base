import { obterPrecoValido } from './preco.js'

export function formatarPreco(valor) {
  const preco = obterPrecoValido(valor)
  if (preco === null) return 'Preço indisponível'

  return preco.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}
