import React, {useState, useContext} from "react";
import Connect from "./Connect.js"
import {Container, Row, Col, Alert, Button} from 'react-bootstrap'
import { AccountInfoContext } from "../Context/AccountInfo";
import { colors, outers, decorations, complete} from '../images.js'

import '../App.css'

function Mint() {
    let accountInfo = useContext(AccountInfoContext)
    const [alert, setAlert] = useState({active: false, content: null, variant: null})
    const [color, setColor] = useState(null)
    const [decoration, setDecoration] = useState(null)
    const [outer, setOuter] = useState(null)
    const [colorsBorderStyles, setColorsBorderStyles] = useState(new Array(5))
    const [decorationsBorderStyles, setDecorationsBorderStyles] = useState(new Array(5))
    const [outersBorderStyles, setOutersBorderStyles] = useState(new Array(5))

    function displayAlert( message, variant){
        setAlert({active: true, content: message, variant: variant})
        setTimeout(function() { setAlert({active: false, content: null, variant: null}); }, 10000);
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

    // COLOR HANDLING

    function renderColorRow(){
        if(accountInfo.account){
            return(
                <React.Fragment>
                    <Col xs ={12} className='mt-2'><h2>Choose a color</h2></Col>
                    <Col xs ={12}>
                        {renderColorOptions()}
                    </Col>
                </React.Fragment>
            )
        }else{
            return null
        }
    }

    function renderColorOptions(){
        return(
            colors.map((color, key)=>{
                return(
                    <img
                    className="m-2"
                    src={color}
                    height='200px'
                    alt={`color${key}`}
                    key={key}
                    style = {colorsBorderStyles[key]}
                    onClick={()=>{setColor(key); highlightColor(key)}}></img>
                )
            })
        )
    }

    function highlightColor(key){
        let updatedBorder = new Array(5)
        updatedBorder[key] = {border: `solid 5px white`}
        setColorsBorderStyles(updatedBorder);
    }

    // DECORATION HANLDING

    function renderDecorationRow(){
        if(color === null){
            return null
        }else{
            return(
                <React.Fragment>
                    <Col xs ={12} className='mt-2'><h2>Choose a decoration</h2></Col>
                    <Col xs ={12}>
                        {renderDecorationsOptions()}
                    </Col>
                </React.Fragment>
            )
        }
    }

    function renderDecorationsOptions(){
        return(
            decorations.map((decoration, key)=>{
                return(
                    <img
                    className="m-2"
                    src={decoration}
                    height='200px'
                    alt={`decoration${key}`}
                    key={key}
                    style = {decorationsBorderStyles[key]}
                    onClick={()=>{setDecoration(key); highlightDecoration(key)}}></img>
                )
            })
        )
    }

    function highlightDecoration(key){
        let updatedBorder = new Array(5)
        updatedBorder[key] = {border: `solid 5px white`}
        setDecorationsBorderStyles(updatedBorder);
    }

    // OUTER HANLDING

    function renderOuterRow(){
        if(color === null || decoration === null){
            return null
        }else{
            return(
                <React.Fragment>
                    <Col xs ={12} className='mt-2'><h2>Choose an Outer</h2></Col>
                    <Col xs ={12}>
                        {renderOutersOptions()}
                    </Col>
                </React.Fragment>
            )
        }
    }

    function renderOutersOptions(){
        let outersMap = color === null ? outers[0] : outers[color]
        return(
            outersMap.map((outer, key)=>{
                return(
                    <img
                    className="m-2"
                    src={outer}
                    height='200px'
                    alt={`outer${key}`}
                    key={key}
                    style = {outersBorderStyles[key]}
                    onClick={()=>{setOuter(key); highlightOuter(key)}}></img>
                )
            })
        )
    }

    function highlightOuter(key){
        let updatedBorder = new Array(5)
        updatedBorder[key] = {border: `solid 5px white`}
        setOutersBorderStyles(updatedBorder);
    }

    // SELECTION HANDLING

    function renderSelection(){
        let mapping  = {0: 'a', 1: 'b', 2: 'c', 3: 'd', 4: 'e' }
        if(color !== null && decoration !== null && outer !== null){
            let src = mapping[color] + mapping[outer] + mapping[decoration]
            return(
                <React.Fragment>
                    <Col xs ={12} className='mt-2'><h2>Your selection</h2></Col>
                    <Col xs ={12}>
                    <img
                        className="m-2 selection_visual"
                        src={complete[src]}
                        alt={`selection`}></img>
                    </Col>
                </React.Fragment>
            )
        }else{
            return null
        }
    }

    async function handleMint(){
        let price = accountInfo.price
        if(accountInfo.publicMintOpened || accountInfo.ALMintOpened){
            if(accountInfo.walletETHBalance < price) displayAlert('ETH balance insufficient', 'warning')
        }
        if(accountInfo.publicMintOpened){
            let pubMints = parseInt(await accountInfo.ContractMintInstance.methods._publicTokenMinted(accountInfo.account).call())
            if(pubMints >= accountInfo.limitPerWallet){
                displayAlert('You already minted the maximum amount of tokens', 'warning')
            }else{
                try{
                    await accountInfo.ContractMintInstance.methods.mint(color, outer, decoration).send({from: accountInfo.account, value: price});
                    displayAlert('Mint successful!', 'success')
                }catch(error){
                    displayAlert(error.message, 'warning')
                }
            }
        }else{
            if(accountInfo.ALMintOpened){
                if(accountInfo.signedMessage){
                    let ALMints = parseInt(await accountInfo.ContractMintInstance.methods._ALTokensMinted(accountInfo.account).call())
                    if(ALMints >= accountInfo.unsignedData.maxQuantity){
                        displayAlert('You already minted the maximum amount of tokens during the Allow List phase, come back for the public mint.', 'warning')
                    }else{
                        try{
                            if(accountInfo.unsignedData.isReservedMint) {price = 0}
                            await accountInfo.ContractMintInstance.methods.ALMint(
                                accountInfo.signedMessage.v, 
                                accountInfo.signedMessage.r, 
                                accountInfo.signedMessage.s, 
                                accountInfo.unsignedData.maxQuantity, 
                                accountInfo.unsignedData.isReservedMint,
                                color, 
                                outer, 
                                decoration
                            ).send({from: accountInfo.account, value: price});
                            displayAlert('Mint successful!', 'success')
                        }catch(error){
                            displayAlert(error.message, 'warning')
                        }
                    }
                }else{
                    displayAlert('You are not on the Allow List, please come back during the public sale')
                }
            }
        }
    }

    function renderMintButton(){
        return(
            <Container>
                <Row>
                    <Col className="d-flex align-items-left justify-content-center m-2">
                    <Button variant="light" id="mint_button" onClick={()=>handleMint()}>{`Mint`}</Button>
                    </Col>
                </Row>
            </Container>
        )
    }

    function renderUserInterface(){
        if(!window.ethereum || !accountInfo.account){
            return <div>Please connect your wallet</div>
        }else{
            if(accountInfo.supply>=accountInfo.maxSupply){
                return <div>SOLD OUT!</div>
            }else if(accountInfo.publicMintOpened){
                if(color !== null && decoration !== null && outer !== null){
                    return(
                        renderMintButton()
                    )
                }
            }else if(accountInfo.ALMintOpened){
                if(accountInfo.signedMessage){
                    if(color !== null && decoration !== null && outer !== null){
                        return(
                            renderMintButton()
                        )
                    }
                }else{
                    return <div>You are not on the AL</div>
                }
            }else if(accountInfo.ALMintOpened === false && accountInfo.publicMintOpened === false){
                return <div>Mint currently closed</div>
            }else{
                return null
            }
        }
    }

    function renderInterface(){
        if(accountInfo.account){
            if((accountInfo.ALMintOpened && accountInfo.signedMessage) || accountInfo.publicMintOpened){
                if(accountInfo.supply >= accountInfo.maxSupply){
                    return <div>Sold out!</div>
                }else{
                    if(accountInfo.supply >= accountInfo.maxSupply - accountInfo.reservedMints){
                        if(accountInfo.unsignedData){
                            if(!accountInfo.unsignedData.isReservedMint){
                                return <div>Sold out!</div>
                            }else{
                                return(
                                    <React.Fragment>
                                        <Row className="d-flex align-items-left justify-content-center">
                                            {renderColorRow()}
                                        </Row>
                                        <Row className="d-flex align-items-left justify-content-center">
                                            {renderDecorationRow()}
                                        </Row>
                                        <Row className="d-flex align-items-left justify-content-center">
                                            {renderOuterRow()}
                                        </Row>
                                        <Row className="d-flex align-items-left justify-content-center">
                                            {renderSelection()}
                                        </Row>
                                    </React.Fragment>
                                )
                            }
                        }else{
                            return <div>Sold out!</div>
                        }
                    }else{
                        return(
                            <React.Fragment>
                                <Row className="d-flex align-items-left justify-content-center">
                                    {renderColorRow()}
                                </Row>
                                <Row className="d-flex align-items-left justify-content-center">
                                    {renderDecorationRow()}
                                </Row>
                                <Row className="d-flex align-items-left justify-content-center">
                                    {renderOuterRow()}
                                </Row>
                                <Row className="d-flex align-items-left justify-content-center">
                                    {renderSelection()}
                                </Row>
                            </React.Fragment>
                        )
                    }
                }
            }
        }
    }
    
    return ( 
        <Container className="mb-5">
            <Row style={{fontWeight: 'bold'}}>
            <Col className="title_font">Constructum</Col>
            </Row>
            <Row style={{fontSize: '1.5rem'}} className='mb-5'>
                <Col>
                    <span style={{fontSize: '1.2rem'}}>by Simply Anders</span><br/>
                </Col>
            </Row>
            {renderInterface()}
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

export default Mint;


