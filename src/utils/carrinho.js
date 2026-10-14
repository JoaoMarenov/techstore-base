import { obterPrecoValido } from './preco.js'

// O carrinho guarda uma entrada por unidade adicionada.
// Ex.: duas camisetas iguais = o mesmo produto duas vezes no array.

export function calcularTotal(carrinho) {
  return carrinho.reduce((total, produto) => {
    const preco = obterPrecoValido(produto.price)
    return total + (preco === null ? 0 : preco)
  }, 0)
}

export function calcularDesconto(subtotal, taxa) {
  return Math.round((subtotal * taxa + Number.EPSILON) * 100) / 100
}

export function calcularTotalFinal(subtotal, desconto) {
  return Math.max(0, Math.round((subtotal - desconto + Number.EPSILON) * 100) / 100)
}

export function calcularFreteGratis(totalFinal) {
  const totalEmCentavos = Math.round(totalFinal * 100)
  return {
    liberado: totalEmCentavos > 20000,
    falta: Math.max(0, (20001 - totalEmCentavos) / 100),
  }
}

export function agruparItens(carrinho) {
  const itens = []
  carrinho.forEach((produto) => {
    const existente = itens.find((item) => item.produto.id === produto.id)
    if (existente) {
      existente.quantidade += 1
    } else {
      itens.push({ produto, quantidade: 1 })
    }
  })
  return itens
}
