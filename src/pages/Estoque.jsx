import { useState } from 'react'
import { buscarAvisosReposicao } from '../utils/avisosReposicao'

// Página usada pelo time de estoque para acompanhar a quantidade de cada produto
export default function Estoque({ produtos }) {
  const [avisos] = useState(() => buscarAvisosReposicao())
  // slice cria uma cópia, para o sort não alterar a lista original
  const ordenados = produtos.slice().sort((a, b) => a.estoque - b.estoque)
  const grupos = avisos.reduce((resultado, aviso) => {
    const produtoId = String(aviso.produtoId)
    if (!resultado[produtoId]) resultado[produtoId] = []
    resultado[produtoId].push(aviso)
    return resultado
  }, {})
  const produtosAguardados = Object.entries(grupos).map(([produtoId, pessoas]) => {
    const produto = produtos.find((item) => String(item.id) === produtoId)
    return { id: produtoId, nome: produto ? produto.title : pessoas[0].produtoNome, pessoas }
  })

  return (
    <section>
      <p className="sobretitulo">Área interna</p>
      <h1>Estoque</h1>
      <p className="aviso">Produtos com menos de 5 unidades precisam de reposição.</p>

      <div className="tabela-moldura">
        <table className="tabela">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Unidades</th>
              <th>Situação</th>
            </tr>
          </thead>
          <tbody>
            {ordenados.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.title}</td>
                <td>{produto.category}</td>
                <td>{produto.estoque}</td>
                <td>
                  {produto.estoque === 0 && <span className="selo selo-esgotado">Esgotado</span>}
                  {produto.estoque > 0 && produto.estoque < 5 && (
                    <span className="selo selo-alerta">Repor</span>
                  )}
                  {produto.estoque >= 5 && <span className="selo selo-ok">OK</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="secao-interessados">
        <h2>Clientes aguardando reposição</h2>
        {produtosAguardados.length === 0 ? (
          <p className="aviso">Ainda não existem clientes aguardando reposição.</p>
        ) : (
          <div className="lista-interessados">
            {produtosAguardados.map((grupo) => (
              <article className="grupo-interessados" key={grupo.id}>
                <h3>{grupo.nome}</h3>
                <p>{grupo.pessoas.length} pessoa(s) aguardando</p>
                <ul>
                  {grupo.pessoas.map((pessoa, indice) => (
                    <li key={`${pessoa.clienteEmail}-${indice}`}>
                      <strong>{pessoa.clienteNome}</strong> · {pessoa.clienteEmail}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  )
}
