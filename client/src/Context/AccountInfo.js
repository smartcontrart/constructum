import React, { Component, createContext } from 'react';

export const AccountInfoContext = createContext();

class AccountInfoProvider extends Component {
    state = {
        ashAddress: process.env.REACT_APP_MAINNET_CONTRACT_ASH_ADDRESS,
        fomoAddress: process.env.REACT_APP_MAINNET_CONTRACT_FOMO_ADDRESS,
        act1Address: process.env.REACT_APP_MAINNET_CONTRACT_ACT1_ADDRESS,
        act1MintAddress: process.env.REACT_APP_MAINNET_CONTRACT_ACT1MINT_ADDRESS,
        act2Address: process.env.REACT_APP_MAINNET_CONTRACT_ACT2_ADDRESS,
        act2MintAddress: process.env.REACT_APP_MAINNET_CONTRACT_ACT2MINT_ADDRESS,
        act3Address: process.env.REACT_APP_MAINNET_CONTRACT_ACT3_ADDRESS,
        act3MintAddress: process.env.REACT_APP_MAINNET_CONTRACT_ACT3MINT_ADDRESS,
        birdblotterInstance: null,
        account: null,
        networkId: null,
        transactionInProgress: false,
        userFeedback: null,
        contractNetwork: process.env.REACT_APP_MAINNET_NETWORK,
        walletETHBalance: 0,
        mintPrice: 0,
        signedMessage: null,
        loadedNFTs: false,
        dropOpened: false,
        connectWallet: null,
        hasMinted: null,
        instancesLoaded: false
    }

    updateAccountInfo = (updatedData) =>{
        for (const [key, value] of Object.entries(updatedData)) {
            this.setState(prevState=>({
                ...prevState,
                [key]: value
            }))
        }
    }

    render(){
        return(
            <AccountInfoContext.Provider 
                value={{
                    ...this.state, 
                    updateAccountInfo: this.updateAccountInfo,
                    }}>
                {this.props.children}
            </AccountInfoContext.Provider>
        )
    }

}
export default AccountInfoProvider;