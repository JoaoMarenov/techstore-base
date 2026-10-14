import { useEffect, useRef, useState } from 'react'
import { produtoTemPreco } from '../utils/preco'

export default function BotaoAdicionar({ produto, onAdicionar, className = 'botao' }) {
  const [emEspera, setEmEspera] = useState(false)
  const [adicionado, setAdicionado] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const temporizador = useRef(null)
  const precoDisponivel = produtoTemPreco(produto)
  const temEstoque = Number(produto.estoque) > 0

  useEffect(() => () => clearTimeout(temporizador.current), [])

  function mostrarResultado(resultado) {
    setEmEspera(true)
    setAdicionado(resultado)
    setMensagem(resultado ? '' : 'Aguarde um instante antes de adicionar novamente.')
    clearTimeout(temporizador.current)
    temporizador.current = setTimeout(() => {
      setEmEspera(false)
      setAdicionado(false)
      setMensagem('')
    }, 800)
  }

  function lidarComClique() {
    if (emEspera) return
    mostrarResultado(Boolean(onAdicionar(produto)))
  }

  let texto = 'Adicionar ao carrinho'
  if (!temEstoque) texto = 'Esgotado'
  else if (!precoDisponivel) texto = 'Preço indisponível'
  else if (adicionado) texto = 'Adicionado ✓'

  return (
    <>
      <button
        className={className}
        onClick={lidarComClique}
        disabled={!temEstoque || !precoDisponivel || emEspera}
        type="button"
      >
        {texto}
      </button>
      {mensagem && <span className="mensagem-adicao" aria-live="polite">{mensagem}</span>}
    </>
  )
}
