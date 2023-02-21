import React, {useState, useContext} from "react";
import Connect from "./Connect.js"
import {Container, Row, Col, Alert, Button} from 'react-bootstrap'
import { AccountInfoContext } from "../Context/AccountInfo";
import Contract  from "../contracts/Constructum.json";


import '../App.css'

function Deploy() {
    let accountInfo = useContext(AccountInfoContext)
    const [alert, setAlert] = useState({active: false, content: null, variant: null})

    function displayAlert( message, variant){
        setAlert({active: true, content: message, variant: variant})
        setTimeout(function() { setAlert({active: false, content: null, variant: null}); }, 100000);
    }

    function renderAlert(){
        if(alert.active){
            return(
            <Col className='m-'>
                <br/><br/>
                <Alert variant={alert.variant}>{alert.content}</Alert>
            </Col>
            )
        }
    }

    async function deploy(){
        let ABI = Contract.abi
        let bytecode = Contract.bytecode
        let contract = new accountInfo.web3.eth.Contract(ABI);
        contract
        .deploy({ data: bytecode })
        .send({ from: accountInfo.account})
        .on("receipt", (receipt) => {
            displayAlert(`Your contract successfully deployed. Contract Address: ${receipt.contractAddress}`)
        })
    }

    function renderDeployButton(){
        return(
            <Container>
                <Row>
                    <Col className="d-flex align-items-left justify-content-center m-2">
                    <Button variant="light" id="mint_button" onClick={()=>deploy()}>{`Deploy`}</Button>
                    </Col>
                </Row>
            </Container>
        )
    }

    function renderUserInterface(){
        if(!window.ethereum || !accountInfo.account){
            return <div>Please connect your wallet</div>
        }else{
            return renderDeployButton()
        }
    }

    
    return ( 
        <Container className="mb-5">
            <Row style={{fontWeight: 'bold'}}>
            <Col className="title_font"><span>Welcome, Simply Anders.<br/>are you ready to deploy?</span></Col>
            </Row>
            <Row className="d-flex xs_center">
                {renderUserInterface()}
            </Row>
            <Row className="d-flex xs_center">
                {renderAlert()}
            </Row>
            <Row>
                <Col className="d-flex align-items-center justify-content-center">
                    <Connect/>
                </Col>
            </Row>
        </Container>
     );
}

export default Deploy;


