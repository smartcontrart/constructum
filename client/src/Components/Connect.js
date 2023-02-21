import React, { Component } from "react";
import Web3 from "web3";
import { Button } from "react-bootstrap";
import { AccountInfoContext } from '../Context/AccountInfo'
import Contract  from "../contracts/Constructum.json";
import ContractMint  from "../contracts/ConstructumMint.json";
import AL from '../AL/signedList.json'
import unsignedAL from '../AL/unsignedList.json'

class Connect extends Component {
  
  static contextType =  AccountInfoContext
  
  componentDidMount = async () => {

    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      this.web3  = new Web3(window.web3.currentProvider);
    }else{
      var provider = `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_PROJECT_ID1}`
      var web3Provider = new Web3.providers.HttpProvider(provider);
      this.web3 = new Web3(web3Provider);
    };
    this.context.updateAccountInfo({web3: this.web3})
    if(this.web3){
      await this.setNetwork();
      await this.getContractsInstances();
      if(window.ethereum || window.web3){
        await this.setAccount();
      }
    }
  }

  async getContractsInstances(){
    this.networkId = await this.web3.eth.getChainId();
    this.context.updateAccountInfo({networkId: this.networkId})
    this.ContractInstance = new this.web3.eth.Contract(
      Contract.abi,
      parseInt(process.env.REACT_APP_MAINNET_CONTRACT_ADDRESS) && process.env.REACT_APP_MAINNET_CONTRACT_ADDRESS
    )
    this.ContractMintInstance = new this.web3.eth.Contract(
      ContractMint.abi,
      parseInt(process.env.REACT_APP_MAINNET_MINT_CONTRACT_ADDRESS) && process.env.REACT_APP_MAINNET_MINT_CONTRACT_ADDRESS
    )

    this.context.updateAccountInfo({ContractInstance: this.ContractInstance})
    this.context.updateAccountInfo({ContractMintInstance: this.ContractMintInstance})
    this.getContractInfo();
    this.getContractMintInfo();
    this.context.updateAccountInfo({instancesLoaded: true})
  }

  async findSignedMessageAL(account){
    let signedMessage = null
    for(let i=0;i<AL.length;i++){
      let key = Object.keys(AL[i])[0]
      if(key.toLowerCase() === account.toLowerCase()){
        signedMessage = AL[i][key]
      }
    }
    return signedMessage
  }

  async findUnsignedData(account){
    let unsignedMessage = null
    let walletsData = unsignedAL.wallets
    for(let i=0;i<walletsData.length;i++){
      if(walletsData[i].address.toLowerCase() === account.toLowerCase()){
        unsignedMessage = walletsData[i]
      }
    }
    return unsignedMessage
  }

  async setAccount(){
    if(this.context.networkId !== null){
      let accounts = await this.web3.eth.getAccounts();
      await this.context.updateAccountInfo({account: accounts[0]});
      if(this.context.account) this.getAccountsData(accounts[0])
    }else{
      this.resetAccountData();
    }
  }

  resetAccountData(){
    this.context.updateAccountInfo({
      account: null,
    })
  }

  async setNetwork(){
    // if(this.web3){
      let networkId = await this.web3.eth.getChainId();
      this.context.updateAccountInfo({networkId: networkId})
    // 
  }

  async getAccountsData(account){
    if(this.context.networkId === parseInt(process.env.REACT_APP_MAINNET_NETWORK) ){
      this.context.updateAccountInfo({walletETHBalance: await this.web3.eth.getBalance(this.context.account)});
      this.context.updateAccountInfo({ALMints: await this.ContractMintInstance.methods._ALTokensMinted(this.context.account).call()});
      this.context.updateAccountInfo({publicMints: await this.ContractMintInstance.methods._publicTokenMinted(this.context.account).call()});
      let signedMessage = await this.findSignedMessageAL(account);
      this.context.updateAccountInfo({signedMessage: signedMessage})
      let unsignedData = await this.findUnsignedData(account);
      this.context.updateAccountInfo({unsignedData: unsignedData})
    }
  }

  async getContractInfo(){
    if(this.context.networkId === parseInt(process.env.REACT_APP_MAINNET_NETWORK) ){
    }
  }

  async getContractMintInfo(){
    if(this.context.networkId === parseInt(process.env.REACT_APP_MAINNET_NETWORK) ){
      this.context.updateAccountInfo({price: parseInt(await this.ContractMintInstance.methods._price().call())})
      this.context.updateAccountInfo({supply: parseInt(await this.ContractMintInstance.methods._supply().call())})
      this.context.updateAccountInfo({maxSupply: parseInt(await this.ContractMintInstance.methods._maxSupply().call())})
      this.context.updateAccountInfo({reservedMints: parseInt(await this.ContractMintInstance.methods._reservedMints().call())})
      this.context.updateAccountInfo({ALMintOpened: await this.ContractMintInstance.methods._ALMintOpened().call()})
      this.context.updateAccountInfo({publicMintOpened: await this.ContractMintInstance.methods._publicMintOpened().call()})
      this.context.updateAccountInfo({limitPerWallet: parseInt(await this.ContractMintInstance.methods._limitPublicMintPerWallet().call())})
    }
  }

  async connectWallet(){
    this.context.updateAccountInfo({transactionInProgress: true})
    try{
      window.ethereum.enable()
    }catch(error){
      console.log(error)
    }
    this.context.updateAccountInfo({transactionInProgress: false})
  }

  getAccountStr(account){
    let response = account.slice(0, 5) +  '...' + account.substring(account.length - 2)
    return response
  }

  renderUserInterface(){
    if(!this.context.account){
      return <Button variant="outline-light" className="interface_button" onClick={() => this.connectWallet()}>Connect</Button>
    }else if(parseInt(this.context.networkId) !== parseInt(process.env.REACT_APP_MAINNET_NETWORK)){
      return <p style={{color: 'white'}}>Please connect to {parseInt(process.env.REACT_APP_MAINNET_NETWORK) === 1 ? "Ethereum Mainnet" : "the GOERLI Network"}</p>
    }else return <Button variant="outline-light" id="interface_connection" className="interface_button">Connected as {this.getAccountStr(this.context.account)}</Button>
  }

  render() {

    if(window.ethereum || window.web3){
      if(this.web3){
        window.ethereum.on('accountsChanged', async () => {
          await this.setAccount()
        })
        window.ethereum.on('chainChanged', async () => {
          await this.setNetwork()
          await this.setAccount();
        });
  
      }
    }
    return this.renderUserInterface()
  }
  
}


export default Connect;
