import { Link } from 'react-router'
import BotaoAdicionar from './BotaoAdicionar'
import { formatarPreco } from '../utils/formatarPreco'
import { obterPrecoValido } from '../utils/preco'

export default function ProdutoCard({ produto, onAdicionar }) {
  const preco = obterPrecoValido(produto.price)
  const precoOriginal = obterPrecoValido(produto.precoOriginal)
  const temPromocao = precoOriginal !== null && preco !== null && precoOriginal > preco
  const temAvaliacao = produto.rating && produto.rating.count > 0

  return (
    <article className="card">
      <Link to={`/produto/${produto.id}`} className="card-link">
        <div className="card-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="card-imagem" />
        </div>
        <h3 className="card-titulo">{produto.title}</h3>
      </Link>

      {temAvaliacao && (
        <p className="card-avaliacao">
          ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
        </p>
      )}

      <div className="card-precos">
        {temPromocao && (
          <span className="preco-original">{formatarPreco(produto.precoOriginal)}</span>
        )}
        {preco === null ? (
          <span className="preco indisponivel">Preço indisponível</span>
        ) : (
          <span className="preco">{formatarPreco(preco)}</span>
        )}
      </div>

      <div className="card-selos">
        {produto.price > 100 && <span className="selo selo-frete">Frete grátis</span>}
        {Number(produto.estoque) <= 0 && <span className="selo selo-esgotado">Esgotado</span>}
      </div>

      <BotaoAdicionar key={produto.id} produto={produto} onAdicionar={onAdicionar} />
    </article>
  )
}
