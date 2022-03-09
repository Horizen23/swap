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
    </Container>
    </div>
  );
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