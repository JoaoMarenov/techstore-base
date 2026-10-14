import { useEffect, useRef, useState } from 'react'
import { Routes, Route } from 'react-router'
import Header from './components/Header'
import Footer from './components/Footer'
import RolarParaTopo from './components/RolarParaTopo'
import Loja from './pages/Loja'
import PaginaProduto from './pages/PaginaProduto'
import Carrinho from './pages/Carrinho'
import Estoque from './pages/Estoque'
import Painel from './pages/Painel'
import { buscarProdutos } from './services/produtos'
import { buscarClientes } from './services/clientes'
import { produtoTemPreco } from './utils/preco'

export default function App() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [carrinho, setCarrinho] = useState([])
  const [clientes, setClientes] = useState([])
  const [clienteAtualId, setClienteAtualId] = useState(null)
  const ultimosAdicionados = useRef({})

  useEffect(() => {
    buscarProdutos()
      .then((dados) => setProdutos(dados))
      .catch(() => setErro('Não foi possível carregar os produtos.'))
      .finally(() => setCarregando(false))

    buscarClientes().then((dados) => {
      setClientes(dados)
      if (dados.length > 0) setClienteAtualId(dados[0].id)
    })
  }, [])

  function adicionarAoCarrinho(produto) {
    if (!produtoTemPreco(produto) || !(Number(produto?.estoque) > 0)) return false

    const agora = Date.now()
    const ultimaAdicao = ultimosAdicionados.current[produto.id] || 0
    if (agora - ultimaAdicao < 800) return false

    ultimosAdicionados.current[produto.id] = agora
    setCarrinho((itens) => itens.concat(produto))
    return true
  }

  function removerUmaUnidade(produtoId) {
    setCarrinho((itens) => {
      // Remove só a primeira unidade encontrada do produto.
      let removido = false
      return itens.filter((produto) => {
        if (!removido && produto.id === produtoId) {
          removido = true
          return false
        }
        return true
      })
    })
  }

  const clienteAtual = clientes.find((cliente) => cliente.id === clienteAtualId)

  return (
    <div className="app">
      <RolarParaTopo />
      <Header carrinho={carrinho} clienteAtual={clienteAtual} />

      <main className="conteudo">
        {carregando && <p className="aviso">Carregando produtos...</p>}
        {erro && <p className="aviso aviso-erro">{erro}</p>}

        {!carregando && !erro && (
          <Routes>
            <Route
              path="/"
              element={<Loja produtos={produtos} onAdicionar={adicionarAoCarrinho} />}
            />
            <Route
              path="/produto/:id"
              element={<PaginaProduto produtos={produtos} onAdicionar={adicionarAoCarrinho} />}
            />
            <Route
              path="/carrinho"
              element={
                <Carrinho
                  carrinho={carrinho}
                  produtos={produtos}
                  clienteAtual={clienteAtual}
                  onAdicionar={adicionarAoCarrinho}
                  onRemover={removerUmaUnidade}
                />
              }
            />
            <Route path="/estoque" element={<Estoque produtos={produtos} />} />
            <Route path="/painel" element={<Painel produtos={produtos} />} />
          </Routes>
        )}
      </main>

      <Footer
        clientes={clientes}
        clienteAtualId={clienteAtualId}
        onTrocarCliente={setClienteAtualId}
      />
    </div>
  )
}
