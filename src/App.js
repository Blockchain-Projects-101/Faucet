import "./App.css";
import {
  useEffect, useState
} from "react";
import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider';
import { loadContract } from "./utils/load-contract";


function App() {
  const [web3Api, setWeb3Api] = useState({ provider: null, web3: null, contract: null });
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  useEffect(() => {
    const loadProvider = async () => {

      const provider = await detectEthereumProvider();
      const contract = await loadContract("Faucet", provider);
      if (provider) {
        // provider.request({method:"eth_requestAccounts"})
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract
        })
      } else {
        console.log("Please install Metamask.");
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
      setBalance(web3.utils.fromWei(balance,"ether"))
    }
    web3Api.contract && loadBalance()
  }, [web3Api])


  useEffect(() => {
    const getAccount = async () => {

      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
    }
    web3Api.web3 && getAccount();
  }, [web3Api.web3]);

  return (
    <div className="faucet-wrapper">
      <div className="faucet">
        <div className="is-flex">
          <span>
            <strong className="mr-2">Account:</strong>
          </span>
          <h1>{account ?
            account :
            <button className="button ml-2 is-small"
              onClick={() => {
                web3Api.provider.request({ method: "eth_requestAccounts" })
              }}
            >Connect wallet</button>
          }
          </h1>
        </div>
        <div className="balance-view is-size-2 mb-4">
          Current Balance <strong>{balance}</strong> ETH
        </div>
        <button className="button is-link mr-2 is-small">Donate</button>
        <button className="button is-primary is-small">Withdraw</button>
        {/* <button className="btn" onClick={async () => {
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          console.log(accounts);
        }}>Enable Ethereum</button> */}
      </div>
    </div >

  );
}

export default App;
