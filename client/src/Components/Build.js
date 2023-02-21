import React, {useState} from "react";
import Connect from "./Connect.js"
import {Container, Row, Col, Alert, Button} from 'react-bootstrap'
import { colors, outers, decorations, complete} from '../images.js'
import { Link } from "react-router-dom";

import '../App.css'

function Build() {

    const [color, setColor] = useState(null)
    const [decoration, setDecoration] = useState(null)
    const [outer, setOuter] = useState(null)
    const [colorsBorderStyles, setColorsBorderStyles] = useState(new Array(5))
    const [decorationsBorderStyles, setDecorationsBorderStyles] = useState(new Array(5))
    const [outersBorderStyles, setOutersBorderStyles] = useState(new Array(5))

    // COLOR HANDLING

    function renderColorRow(){
        return(
            <React.Fragment>
                <Col xs ={12} className='mt-2'><h2>Choose a color</h2></Col>
                <Col xs ={12}>
                    {renderColorOptions()}
                </Col>
            </React.Fragment>
        )
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

    function renderInterface(){
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
                <Col className="d-flex align-items-center justify-content-center mb-2">
                    <Button id="mint_button"><Link to='/' style={{textDecoration: 'none', color: 'black'}}>Home</Link></Button>
                </Col>
            </Row>
            <Row>
                <Col className="d-flex align-items-center justify-content-center">
                    <Connect/>
                </Col>
            </Row>
        </Container>
     );
}

export default Build;


