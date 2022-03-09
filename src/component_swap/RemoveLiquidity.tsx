import { WrapNavLink,Row,Container,TitleText } from './Liquidity';
import { store } from "../store";
import { Provider, useSelector } from "react-redux";
import * as ReactDOM from "react-dom";
import React, { memo, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { BrowserRouter,Route ,Routes, NavLink,Outlet} from "react-router-dom";

export default  function RemoveLiquidity() {
  return (
    <div className="row justify-content-md-center mt-4">
    <Container >
      <Row style={{'justifyContent':'center'}}>
          <WrapNavLink to='/app/view/liquidity' style={{position: 'absolute','left': '0'}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
             back
          </WrapNavLink>
          <TitleText>Remove Liquidity</TitleText>
      </Row>  
      <Range>
      <Text>
        <div>
        Remove Amount
        </div>
        <h1 style={{ margin:'5px','left':2 ,color:'#000000' }}>0%</h1>
      </Text>
     

      <div>     
      <Inputrange  type="range" aria-labelledby="input slider" step="1" min="0" max="100"  />
      </div>
      <Percent>
      <Btnrange>25%</Btnrange>
      <Btnrange>50%</Btnrange>
      <Btnrange>75%</Btnrange>
      <Btnrange>Max</Btnrange>
      </Percent>
      </Range>
      <svg style={{ "margin":"20 auto" }} width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.9393 22.0607C11.5251 22.6464 12.4749 22.6464 13.0607 22.0607L22.6066 12.5147C23.1924 11.9289 23.1924 10.9792 22.6066 10.3934C22.0208 9.80761 21.0711 9.80761 20.4853 10.3934L12 18.8787L3.51472 10.3934C2.92893 9.80761 1.97918 9.80761 1.3934 10.3934C0.807612 10.9792 0.807612 11.9289 1.3934 12.5147L10.9393 22.0607ZM10.5 0L10.5 21H13.5L13.5 0L10.5 0Z" fill="#646775"/>
</svg>
      <Price>
      <Dprice>
      <div>
      <p>-</p>
      <p>ETH</p>
      </div>
      <div>
      <p>-</p>
      <p>BTC</p>
      </div>
      <p style={{ margin:'5px','left':2 ,color:'#000000' }}>Receive BTC</p>
      </Dprice>
      </Price>
    </Container>
    </div>
  );
}
const Dprice = styled.div`
box-sizing: border-box;
border-radius: 16px;
& div {
  display:flex;
  justify-content: space-between;
  color: #4A4A4A;
  font-weight: 500;
  font-size: 15px;
}
`

const Percent = styled.div`
display: flex;
justify-content: space-around;
margin: 20px;
`

const Inputrange = styled.input`

  width: 100%;
  &[type="range"] {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 600px;
    height: 5px;
    padding: 0;
    border-radius: 20px;
    outline: none;
    cursor: pointer;
    background-color: rgb(131 142 241);
  }
  
  &[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    -moz-appearance: none;
    -webkit-border-radius: 100px;
    /*30x30px adjusted to be same as 28x28px on moz*/
    height: 30px;
    width: 30px;
    border-radius: 100px;
    background: rgb(45 80 226 / 80%);
  }
`
const Btnrange = styled.button`
background-color: #DFE1F0;
border: none;
color: black;
padding: 10px 20px;
text-align: center;
text-decoration: none;
display: inline-block;
margin: 4px 2px;
cursor: pointer;
border-radius: 16px;
`

const Text = styled.div`
color: #6E6060;
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 10px;
    padding: 6px;
` 



const Range = styled.div`
user-select: none;
  background: rgba(223, 213, 213, 0.19);
  border-radius: 31px;
  align-items: center;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 240px;
  margin-bottom:10px;
  padding: 4px 20px;
  
`
const Price = styled.div`
user-select: none;
  background: rgba(223, 213, 213, 0.19);
  border-radius: 31px;
  align-items: center;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 107px;
  margin-bottom:10px;
  padding: 4px 20px;
  
`

