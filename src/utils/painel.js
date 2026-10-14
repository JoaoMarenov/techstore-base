import { obterPrecoValido } from './preco.js'

const CATEGORIAS = [
  { id: 'roupas', nome: 'Roupas' },
  { id: 'eletronicos', nome: 'Eletrônicos' },
  { id: 'acessorios', nome: 'Acessórios' },
  { id: 'casa', nome: 'Casa' },
]

export function calcularDadosPainel(produtos, avisos) {
  const categorias = CATEGORIAS.map((categoria) => {
    const produtosDaCategoria = produtos.filter((produto) => produto.category === categoria.id)
    let unidadesComPreco = 0
    let unidadesSemPreco = 0
    let valorVendaEstoque = 0
    let quantidadeProdutosSemPreco = 0

    produtosDaCategoria.forEach((produto) => {
      const estoque = Number(produto.estoque)
      const unidades = Number.isFinite(estoque) && estoque > 0 ? estoque : 0
      const preco = obterPrecoValido(produto.price)

      if (preco === null) {
        quantidadeProdutosSemPreco += 1
        unidadesSemPreco += unidades
      } else {
        unidadesComPreco += unidades
        valorVendaEstoque += preco * unidades
      }
    })

    return {
      ...categoria,
      unidadesComPreco,
      unidadesSemPreco,
      quantidadeProdutosSemPreco,
      valorVendaEstoque,
    }
  })

  const produtosSemPreco = produtos.filter(
    (produto) => obterPrecoValido(produto.price) === null
  )
  const produtosEsgotados = new Set(
    produtos
      .filter((produto) => !(Number(produto.estoque) > 0))
      .map((produto) => String(produto.id))
  )
  const avisosAtivos = avisos.filter((aviso) =>
    produtosEsgotados.has(String(aviso.produtoId))
  )
  const clientesAguardando = new Set(
    avisosAtivos.map((aviso) => String(aviso.clienteEmail).trim().toLowerCase())
  )
  const produtosComAvisos = new Set(
    avisosAtivos.map((aviso) => String(aviso.produtoId))
  )

  return {
    categorias,
    produtosSemPreco,
    clientesAguardando: clientesAguardando.size,
    solicitacoesAtivas: avisosAtivos.length,
    produtosEsgotadosAguardando: produtosComAvisos.size,
  }
}
