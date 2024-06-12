import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { type TransactionRequestSuave, getSuaveWallet, getSuaveProvider } from "@flashbots/suave-viem/chains/utils"
import { Hex, custom, http, stringToHex } from '@flashbots/suave-viem'

function App() {
  const [wallet, setWallet] = useState<ReturnType<typeof getSuaveWallet>>()
  const [userInput, setUserInput] = useState<string>()
  const [toggled, setToggled] = useState(false)

  useEffect(() => {
    const suaveProvider = getSuaveProvider(http("https://localhost:8545"))
    console.log(suaveProvider.chain)
    const load = async () => {
      if ('ethereum' in window && !wallet) {
        console.log('ethereum is available')
        // request accounts from window.ethereum
        const eth = window.ethereum as any
        const accounts = await eth.request({ method: 'eth_requestAccounts' });
        console.log(accounts)
        const wallet = getSuaveWallet({
          transport: custom(eth),
          jsonRpcAccount: accounts[0],
        });
        console.log(wallet)
        setWallet(wallet)
      } else {
        console.log('ethereum is not available')
      }
    }
    load()
  }, [wallet])

  const doTxThing = async () => {
    console.log("doing a thing")
    const suaveTx: TransactionRequestSuave = {
      to: "0x0000000000000000000000000000000000000000",
      value: 1n,
      gasPrice: 1n,
      gas: 1n,
      type: "0x43",
      data: stringToHex(userInput || "0x"),
      confidentialInputs: "0x",
      kettleAddress: "0xb5feafbdd752ad52afb7e1bd2e40432a485bbb7f",
    }
    wallet?.signTransaction(suaveTx).then((tx: Hex) => {
      console.log(tx)
    })
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button type="button" onClick={doTxThing}>
          Do a thing
        </button>
        <input disabled={!toggled} type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder='enter something!'/>
        <div>
          {userInput && <p>{userInput}</p>}
        </div>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <button type="button" onClick={() => setToggled(!toggled)}>
        Toggle Me
      </button>
      {toggled ? <p>Toggle me on and off</p> : <p>NOT TOGGLED ANYMORE</p>}
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
