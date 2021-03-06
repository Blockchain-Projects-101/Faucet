import "./App.css";
import {
  useEffect, useState, useCallback
} from "react";
import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider';
import { loadContract } from "./utils/load-contract";


function App() {
  const [web3Api, setWeb3Api] = useState(
    { provider: null, web3: null, contract: null, isProviderLoaded: false }
  );
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [shouldReload, reload] = useState(false);
  const canConnectToContract = account && web3Api.contract


  const reloadEffect = useCallback(() => reload(!shouldReload), [shouldReload]);
  const setAccountListener = provider => {
    provider.on("accountsChanged", _ => window.location.reload())
    provider.on("chainChanged", _ => window.location.reload())


    // Low level method call to detect the meta account lock change status

    // provider._jsonRpcConnection.events.on("notification",payload=>{
    //   const {method} = payload
    //   if(method === "metamask_unblockStateChanged"){
    //     setAccount(null)
    //   }
    // })

  }
  useEffect(() => {
    const loadProvider = async () => {

      const provider = await detectEthereumProvider();
      if (provider) {
        const contract = await loadContract("Faucet", provider);

        setAccountListener(provider);
        // provider.request({method:"eth_requestAccounts"})
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract,
          isProviderLoaded: true
        })
      } else {
        setWeb3Api((api)=>{
          return {
            ...api,
            isProviderLoaded:true
          }
        })
        console.error("Please install metamask")
      }

    }
    loadProvider()
  }, []);
  // console.log(web3Api.web3);
  // Load the contract balance

  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api
      const balance = await web3.eth.getBalance(contract.address)
      setBalance(web3.utils.fromWei(balance, "ether"))
    }
    web3Api.contract && loadBalance()
  }, [web3Api, shouldReload])


  useEffect(() => {
    const getAccount = async () => {

      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
    }
    web3Api.web3 && getAccount();
  }, [web3Api.web3]);

  // Add functions to add funds to the contract

  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3Api

    await contract.addFunds({
      from: account,
      value: web3.utils.toWei("1", "ether")
    })
    reloadEffect()
  }, [web3Api, account, reloadEffect]);

  // Add the withdraw funds function

  const withdraw = async () => {
    const { contract, web3 } = web3Api
    const withdrawAmount = web3.utils.toWei("0.1", "ether")
    await contract.withdraw(withdrawAmount, {
      from: account

    })
    reloadEffect()
  }

  return (
    <div className="faucet-wrapper">
      <div className="faucet">
        {web3Api.isProviderLoaded ?
          <div className="is-flex">
            <span>
              <strong className="mr-2">Account:</strong>
            </span>
            <h1>{account ?
              account : !web3Api.provider ?
                <>
                  <span className="notification is-small is-warning is-rounded">Wallet is not detected! &nbsp;
                    <a href="https://docs.metamask.io" target="_blank" rel="noreferrer">Install Metamask</a>
                  </span>
                </> :
                <button className="button ml-2 is-small"
                  onClick={() => {
                    web3Api.provider.request({ method: "eth_requestAccounts" })
                  }}
                >Connect wallet</button>
            }
            </h1>
          </div>
          :
          <span>Looking for web3...</span>

        }
        <div className="balance-view is-size-2 mb-4">
          Current Balance <strong>{balance}</strong> ETH
        </div>
        {!canConnectToContract && <i className="is-block">Please connect to ganache network</i>}
        <button className="button is-link mr-2 is-small" disabled={!canConnectToContract}
          onClick={addFunds}>Donate 1 eth</button>
        <button className="button is-primary is-small" disabled={!canConnectToContract}
          onClick={withdraw}>Withdraw 0.1 eth</button>
        {/* <button className="btn" onClick={async () => {
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          console.log(accounts);
        }}>Enable Ethereum</button> */}
      </div>
    </div >

  );
}

export default App;
