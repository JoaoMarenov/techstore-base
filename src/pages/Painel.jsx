import { useState } from 'react'
import { Link } from 'react-router'
import { buscarAvisosReposicao } from '../utils/avisosReposicao'
import { calcularDadosPainel } from '../utils/painel'
import { formatarPreco } from '../utils/formatarPreco'

const nomesCategorias = {
  roupas: 'Roupas',
  eletronicos: 'Eletrônicos',
  acessorios: 'Acessórios',
  casa: 'Casa',
}

export default function Painel({ produtos }) {
  const [avisos] = useState(() => buscarAvisosReposicao())
  const dados = calcularDadosPainel(produtos, avisos)

  return (
    <section className="painel">
      <div className="painel-topo">
        <p className="sobretitulo">Área interna</p>
        <h1>Painel do lojista</h1>
        <p>Acompanhe o valor de venda potencial do estoque e os produtos que precisam de atenção.</p>
      </div>

      <div className="painel-indicadores">
        <article className="painel-indicador">
          <span>Clientes aguardando reposição</span>
          <strong>{dados.clientesAguardando}</strong>
          <small>
            {dados.solicitacoesAtivas} solicitação(ões) em {dados.produtosEsgotadosAguardando} produto(s) esgotado(s)
          </small>
        </article>
        <article className="painel-indicador">
          <span>Produtos sem preço</span>
          <strong>{dados.produtosSemPreco.length}</strong>
          <small>Aguardando definição do time de suprimentos</small>
        </article>
      </div>

      <h2>Valor do estoque por categoria</h2>
      <p className="painel-explicacao">
        O valor de venda potencial soma o preço atual multiplicado pelas unidades em estoque.
        Produtos sem preço ficam fora dessa soma e aparecem na seção abaixo.
      </p>
      <div className="tabela-moldura">
        <table className="tabela tabela-painel">
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Unidades com preço</th>
              <th>Venda potencial</th>
              <th>Produtos sem preço</th>
              <th>Lucro</th>
            </tr>
          </thead>
          <tbody>
            {dados.categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>{categoria.nome}</td>
                <td>{categoria.unidadesComPreco}</td>
                <td>{formatarPreco(categoria.valorVendaEstoque)}</td>
                <td>
                  {categoria.quantidadeProdutosSemPreco} produto(s), {categoria.unidadesSemPreco} unidade(s)
                </td>
                <td>
                  <span className="lucro-indisponivel">Não calculável</span>
                  <small>API sem custo de compra</small>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="painel-explicacao">
        O catálogo não informa o custo de compra dos produtos. Por isso, não é possível calcular
        lucro por categoria sem inventar esse dado.
      </p>

      <h2>Produtos aguardando preço</h2>
      {dados.produtosSemPreco.length === 0 ? (
        <p className="aviso">Não há produtos aguardando definição de preço.</p>
      ) : (
        <div className="tabela-moldura">
          <table className="tabela">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Unidades separadas</th>
              </tr>
            </thead>
            <tbody>
              {dados.produtosSemPreco.map((produto) => (
                <tr key={produto.id}>
                  <td>{produto.title}</td>
                  <td>{nomesCategorias[produto.category] ?? produto.category}</td>
                  <td>{produto.estoque}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="painel-link-estoque">
        <Link to="/estoque" className="botao botao-secundario">Abrir área de estoque</Link>
      </div>
    </section>
  )
}
