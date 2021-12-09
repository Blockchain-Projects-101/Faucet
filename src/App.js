import "./App.css";
import {
  useEffect
} from "react";

function App() {

  useEffect(() => {
    const loadProvider = async () => {
      /*
      1. with meta mask we have access to window.ethereum and window.web3
      2.metamask injects a global API to the website
      3.this API allows websites to request users, accounts,read data from blockchain,sign messages 
      and transactions.

      */
      console.log(window.ethereum);
      console.log(window.web3);
    }
    loadProvider()
  }, []);
  return (
    <div className="faucet-wrapper">
      <div className="faucet">
        <div className="balance-view is-size-2">
          Current Balance <strong>10</strong> ETH
        </div>
        <button className="btn mr-2">Donate</button>
        <button className="btn">Withdraw</button>
        <button className="btn" onClick={async ()=>{
          const accounts = await window.ethereum.request({method:"eth_requestAccounts"});
          console.log(accounts); 
        }}>Enable Ethereum</button>
      </div>
    </div>

  );
}

export default App;
