import React from "react";
import {Container, Row, Col, Button} from 'react-bootstrap'
import { Link } from "react-router-dom";
import demo from '../images/demo.mp4'

import '../App.css'

function Home() {

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
            <Row className='mb-5'>
                <Col>
                <video
                    style={{height: '800'}}
                    className="video"
                        autoPlay
                        loop
                        muted
                        playsInline
                        controls>
                        <source 
                        src={demo} 
                        type="video/mp4"
                        />
                    </video>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button id="mint_button"><Link to='/mint' style={{textDecoration: 'none', color: 'black'}}>Go To Mint Page</Link></Button>
                    <br/>
                    <br/>
                    <Button id="build_button"><Link to='/build' style={{textDecoration: 'none', color: 'white'}}>Try to build!</Link></Button>
                </Col>
            </Row>
        </Container>
     );
}

export default Home;


