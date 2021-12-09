import "./App.css";
import {
  useEffect, useState
} from "react";
import Web3 from "web3";

function App() {
  const [web3Api, setWeb3Api] = useState({ provider: null, web3: null });
  const [account, setAccount] = useState(null);
  useEffect(() => {
    const loadProvider = async () => {
      let provider = null;
      if (window.ethereum) {
        provider = window.ethereum;
        try {
          await provider.request({ method: "eth_requestAccounts" });
        }
        catch {
          console.error("user denied access to account");
        }
      } else if (window.web3) {
        provider = window.web3.currentProvider;
      } else if (!process.env.production) {
        provider = new Web3.providers.HttpProvider("http://localhost:7545");
      }
      setWeb3Api({
        web3: new Web3(provider),
        provider
      })
    }
    loadProvider()
  }, []);
  // console.log(web3Api.web3);

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
        <span>
          <strong>Account:</strong>
        </span>
        <h1>{account ? account : "Not connected"}</h1>
        <div className="balance-view is-size-2">
          Current Balance <strong>10</strong> ETH
        </div>
        <button className="btn mr-2">Donate</button>
        <button className="btn">Withdraw</button>
        {/* <button className="btn" onClick={async () => {
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          console.log(accounts);
        }}>Enable Ethereum</button> */}
      </div>
    </div>

  );
}

export default App;
