export function filtrarProdutosEmEstoque(produtos) {
  return produtos.filter((produto) => Number(produto.estoque) > 0)
}
