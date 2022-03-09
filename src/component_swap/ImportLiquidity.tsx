import { WrapNavLink,Row,Container,TitleText } from './Liquidity';
import { store } from "../store";
import { Provider, useSelector } from "react-redux";
import * as ReactDOM from "react-dom";
import React, { memo, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { BrowserRouter,Route ,Routes, NavLink,Outlet} from "react-router-dom";
import { useApplicationHandlers } from '../hook/application';
import { activePoppup } from '../features/page/pageSlice';
import { Field } from '../features/swap/reducer';

export default  function ImportLiquidity() {
  
  return (
    <div className="row justify-content-md-center mt-4">
    <Container >
      <Row style={{'justifyContent':'center'}}>
          <WrapNavLink to='/app/view/liquidity' style={{position: 'absolute','left': '0'}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
             back
          </WrapNavLink>
          <TitleText>Import  Pool</TitleText>
      </Row>  
      <SelectT name="ETH" image="/app/assets/img/icon/1.png" Field={Field.INPUT}/>
            <svg  style={{ "margin":"20 auto" }}  width="33" height="26" viewBox="0 0 33 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="16" y="8" width="2" height="10" rx="1" fill="#7B6666"/>
            <rect x="12" y="14" width="2" height="10" rx="1" transform="rotate(-90 12 14)" fill="#7B6666"/>
            </svg>
          <SelectT name="BTC" image="/app/assets/img/icon/18.png" Field={Field.OUTPUT}/>
          {/* Select a token */}
    <Position >
    <p>Your position</p>
    <div>
                <p>ETH/BTC:</p>
                <p>9.999</p>
            </div>
            <div>
                <p>Your pool share:</p>
                <p>100.000000%</p>
            </div>
            <div>
                <p>BTC :</p>
                <p>99.9999</p>
            </div>
            <div>
                <p>ETH :</p>
                <p>0.999999</p>
            </div>
            
    </Position> 
    {/* Select a token to find your */} 
    </Container>
    </div>
  );
}

function SelectT({name,image}:any){
  return (<Selecttoken>
    <Nametoken>
    <div className="imageInfo">
      <img src={image}/>
        
      </div>
      <div> {name} </div>
    </Nametoken>
    <ManageTogle >
          <svg width="41" height="23" viewBox="0 0 41 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.8377 8.69269C13.3751 8.13093 13.4554 7.30048 14.0172 6.83782V6.83782C14.5789 6.37516 15.4094 6.45549 15.872 7.01725L22.5738 15.1545C23.0364 15.7162 22.9561 16.5467 22.3943 17.0093V17.0093C21.8326 17.472 21.0021 17.3917 20.5395 16.8299L13.8377 8.69269Z" fill="#516AE4"/>
            <path d="M29.1623 8.69269C29.6249 8.13093 29.5446 7.30048 28.9828 6.83782V6.83782C28.4211 6.37516 27.5906 6.45549 27.128 7.01725L20.4262 15.1545C19.9636 15.7162 20.0439 16.5467 20.6057 17.0093V17.0093C21.1674 17.472 21.9979 17.3917 22.4605 16.8299L29.1623 8.69269Z" fill="#516AE4"/>
        </svg>
      </ManageTogle>
    </Selecttoken>)

  
}

const Position = styled.div`
width: 100%;
left: 233px;
top: 440px;
background: #F0F3FF;
padding: 18px;
border: 1px solid #516AE4;
box-sizing: border-box;
border-radius: 16px;
margin: 21px 1px;
& div {
  display:flex;
  justify-content: space-between;
  color: #4A4A4A;
  font-weight: 500;
  font-size: 15px;
}
`

const Selecttoken = styled.div`
user-select: none;
  background: rgba(223, 213, 213, 0.19);
  border-radius: 31px;
  cursor: pointer;
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 76px;
  display: flex;
  justify-content: space-between;
  margin-bottom:10px;
  padding: 4px 20px;
  & div{
    align-items: center;
  }
`
const Nametoken = styled.div`
display: flex;
& .imageInfo{
    width: 61px;
    height: 30px;
    position: relative;
} img{
  position: absolute;
  width: 30px;
}
& img:first-child{
  z-index: 2;
}
& img:last-child{
  left: 20px;
}
& div:last-child{
  color: #6E6060;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  text-align: center;
  margin-left: 14px;
}
`
const ManageTogle = styled.div`
display: flex;
font-size: 15px;
font-weight: bold;
line-height: -12px;
color: #516AE4;
& svg.active{
  animation: 0.5s ManageTogle-awrow-active 0s forwards;
}
svg{
  animation: 0.5s ManageTogle-awrow-noactive 0s forwards;
}

@keyframes ManageTogle-awrow-noactive {
  from {
    transform: rotateX(180deg);
  }
  to {
    transform: rotateX(0deg);
  }
}
@keyframes ManageTogle-awrow-active {
  to {
    transform: rotateX(180deg);
  }
}
`