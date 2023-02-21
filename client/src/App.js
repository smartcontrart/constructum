import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Home from './Components/Home';
import Mint from './Components/Mint';
import Build from './Components/Build';
import ConnexionStatus from './Components/ConnexionStatus';
import AccountInfoProvider from './Context/AccountInfo';
import ContractInfoProvider from './Context/ContractInfo';
import DropConfigProvider from './Context/DropConfig.js';
import {Routes,Route} from "react-router-dom";
import './App.css'

function App() {
  return (
    <DropConfigProvider>
        <AccountInfoProvider>
          <ContractInfoProvider>
            <div className="background">
              <div className="App d-flex align-items-center justify-content-center">
              {/* <div className="background d-flex align-items-center justify-content-center"> */}
                <Container>
                    <Row id='App_row' className="d-flex align-items-center justify-content-center">
                      <Col className="d-flex align-items-center justify-content-center">
                        <Routes>
                          <Route path="/" element={<Home/>}/>
                          <Route path="/mint" element={<Mint/>}/>
                          <Route path="/build" element={<Build/>}/>
                        </Routes>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="">
                        <ConnexionStatus/>
                      </Col>
                    </Row>
                </Container>
              </div>
            </div>
          </ContractInfoProvider>
        </AccountInfoProvider>
      </DropConfigProvider>
  );
}

export default App;