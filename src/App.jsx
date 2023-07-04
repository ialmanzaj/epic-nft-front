import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './styles/App.css';
import {useToast} from  '@chakra-ui/react';
import myEpicNFT from './myEpicNFT.json';

// Constants
const OPENSEA_LINK = 'https://testnets.opensea.io/';
const TOTAL_MINT_COUNT = 50;
const CONTRACT_ADDRESS = "0x712a7bF3d4EF3f7672cb508cCD65557Bf363FA99";
const contractABI = myEpicNFT.abi;


const App = () => {

    /*
  * Just a state variable we use to store our user's public wallet. Don't forget to import useState.
  */
  const [currentAccount, setCurrentAccount] = useState("");
  const [chainIdOk, setChainIdOk] = useState(false);
  const toast = useToast();

  const checkIfChainIsCorrect = async () => {
    try {
      const { ethereum } = window
      // > Comprobamos si estamos en la red correcta
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);
      const sepoliaChainId = '0xaa36a7'
      if (chainId !== sepoliaChainId) {
        //setChainIdOk(false)
        toast({
          title: 'Red incorrecta.',
          description: 'You are not connected the sepolia test network!',
          status: 'error',
          duration: 9000,
          isClosable: true
        })
        //change the network
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: sepoliaChainId }],
        });
      } else {
        //setChainIdOk(true)
        toast({
          title: 'Red correcta.',
          description: 'You are connected the sepolia test network!',
          status: 'success',
          duration: 9000,
          isClosable: true
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  
  /*
  * Gotta make sure this is async.
  */
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
        console.log("Make sure you have metamask!");
        toast({
          title: 'Wallet not found',
          description: 'Make sure you have wallet!',
          status: 'error',
          duration: 9000,
          isClosable: true
        })
        return;
    } else {
        console.log("We have the ethereum object", ethereum);
    }

    /*
    * Check if we're authorized to access the user's wallet
    */
    const accounts = await ethereum.request({ method: 'eth_accounts' });

    /*
    * User can have multiple authorized accounts, we grab the first one if its there!
    */
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
      checkIfChainIsCorrect();
    } else {
      console.log("No authorized account found");
    }
  }

   /*
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      /*
      * Fancy method to request access to account.
      */
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      /*
      * Boom! This should print out public address once we authorize Metamask.
      */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error);
    }
  }

  const askContractToMintNft = async () => {


  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS,contractABI, signer);

      console.log("Going to pop wallet now to pay gas...")
      let nftTxn = await connectedContract.makeAnEpicNFT();

      console.log("Mining...please wait.")
      await nftTxn.wait();
      
      console.log(`Mined, see transaction: https://sepolia.etherscan.io/tx/${nftTxn.hash}`);

      toast({
        title: 'Minteado exitoso',
        description: 'Has minteado tu nuevo NFT!',
        status: 'success',
        duration: 9000,
        isClosable: true
      })

    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error)
  }
}
  
  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} 
 className="cta-button connect-wallet-button">
      Conecta tu Wallet
    </button>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">NFTs  de Isaac </p>
          <p className="sub-text">
            Un nuevo arte todos los dias
          </p>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <button  onClick={askContractToMintNft} className="cta-button connect-wallet-button">
              Mint NFT
            </button>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default App;