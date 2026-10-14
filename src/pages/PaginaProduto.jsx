import { useState } from 'react'
import { Link, useParams } from 'react-router'
import BotaoAdicionar from '../components/BotaoAdicionar'
import ProdutoCard from '../components/ProdutoCard'
import { registrarAvisoReposicao } from '../utils/avisosReposicao'
import { formatarPreco } from '../utils/formatarPreco'
import { obterPrecoValido } from '../utils/preco'
import { filtrarProdutosEmEstoque } from '../utils/produtos'

export default function PaginaProduto({ produtos, onAdicionar }) {
  const { id } = useParams()
  const produto = produtos.find((item) => item.id === id)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagemAviso, setMensagemAviso] = useState('')
  const [tipoMensagem, setTipoMensagem] = useState('')

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const esgotado = !(Number(produto.estoque) > 0)
  const preco = obterPrecoValido(produto.price)
  const relacionados = filtrarProdutosEmEstoque(produtos)
    .filter((item) => item.category === produto.category && item.id !== produto.id)
    .slice(0, 4)

  function solicitarAviso(evento) {
    evento.preventDefault()
    const nomeLimpo = nome.trim()
    const emailLimpo = email.trim()
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo)

    if (!nomeLimpo || !emailValido) {
      setTipoMensagem('erro')
      setMensagemAviso('Informe um nome e um e-mail válido.')
      return
    }

    const resultado = registrarAvisoReposicao(produto, nomeLimpo, emailLimpo)
    if (resultado.sucesso) {
      setTipoMensagem('sucesso')
      setMensagemAviso('Solicitação registrada neste navegador.')
      setNome('')
      setEmail('')
    } else if (resultado.duplicado) {
      setTipoMensagem('erro')
      setMensagemAviso('Este e-mail já está aguardando este produto.')
    } else {
      setTipoMensagem('erro')
      setMensagemAviso('Não foi possível salvar o pedido neste navegador.')
    }
  }

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          {produto.rating && produto.rating.count > 0 && (
            <p className="card-avaliacao">
              ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
            </p>
          )}
          <p className="detalhe-preco">
            {preco === null ? 'Preço indisponível' : formatarPreco(preco)}
          </p>
          <p className="detalhe-descricao">{produto.description}</p>
          <p className={esgotado ? 'detalhe-estoque indisponivel' : 'detalhe-estoque'}>
            {esgotado ? 'Produto esgotado no momento.' : `${produto.estoque} unidades disponíveis`}
          </p>

          <BotaoAdicionar
            key={produto.id}
            produto={produto}
            onAdicionar={onAdicionar}
            className="botao botao-grande"
          />

          {esgotado && (
            <form className="formulario-aviso" onSubmit={solicitarAviso}>
              <h2>Avise-me quando voltar</h2>
              <p>Informe seu nome e e-mail. A solicitação fica salva neste navegador.</p>
              <label className="rotulo" htmlFor="nome-aviso">Nome</label>
              <input
                id="nome-aviso"
                value={nome}
                onChange={(evento) => setNome(evento.target.value)}
                autoComplete="name"
                required
              />
              <label className="rotulo" htmlFor="email-aviso">E-mail</label>
              <input
                id="email-aviso"
                type="email"
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
                autoComplete="email"
                required
              />
              <button className="botao botao-secundario" type="submit">
                Solicitar aviso
              </button>
              {mensagemAviso && (
                <p className={tipoMensagem === 'erro' ? 'mensagem-formulario erro' : 'mensagem-formulario'} role="status">
                  {mensagemAviso}
                </p>
              )}
            </form>
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => (
          <ProdutoCard key={item.id} produto={item} onAdicionar={onAdicionar} />
        ))}
      </div>
    </section>
  )
}
