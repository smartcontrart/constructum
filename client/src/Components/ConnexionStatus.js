import React from "react";

function ConnexionStatus() {
        return(
            <React.Fragment>
                <span id='connexion_info'><small>Contract address <b><a className="etherscan_link" href={"https://etherscan.io/address/"+process.env.REACT_APP_MAINNET_CONTRACT_ADDRESS}>{process.env.REACT_APP_MAINNET_CONTRACT_ADDRESS}</a></b></small></span><br/>
                <span id='connexion_info'><small>Minting contract address <b><a className="etherscan_link" href={"https://etherscan.io/address/"+process.env.REACT_APP_MAINNET_MINT_CONTRACT_ADDRESS}>{process.env.REACT_APP_MAINNET_MINT_CONTRACT_ADDRESS}</a></b></small></span><br/>
            </React.Fragment>
        )
}

export default ConnexionStatus;