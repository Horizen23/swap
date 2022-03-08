import { store } from '../store';
import { Provider, useSelector } from 'react-redux';
import * as ReactDOM from "react-dom";
import React, { useEffect, useState } from "react";
import Graph from './Graph';
import Swap, { LoaderSpinner } from './Swap';
import Popup, { Container } from './Popup'
import { useAppDispatch } from '../hook';
import { selectcurrency, tokenbalanceAsync, useloadWallet } from '../features/balance/balanceSlice';
import styled from 'styled-components';
import { useSwap } from './hook';
import { values } from 'underscore';
export default function Notification() {
    const [s ,ss ] = useState(false);
    const transactionswap = useSwap()
    return (
        <>
            <Noti className={s?`active`:''+transactionswap.status=='loading'?'loading':''} onClick={()=>{
                ss(!s) }}>
                {
                    transactionswap.status=='loading'?<LoaderSpinner />:!s?<Logo src='/files/ui_img/hlogo@3x.png'></Logo>:''
                }
                {
                s?<Contennoti>{
                  // tokenB:{
                  //   address:TokenOUTPUT.address,
                  //   decimals:TokenOUTPUT.decimals,
                  //   logoURI:TokenOUTPUT.logoURI,
                  //   symbol:TokenOUTPUT.symbol,
                  //   amount:+minamoutout*1e-18
                  // } 
                    Object.entries( transactionswap.listener).map(([key, value]:any) =>{
                      return <div key={key}>{value.tokenA.symbol}:{value.tokenA.amount.toFixed(4)} : {value.tokenB.symbol}:{value.tokenB.amount.toFixed(4)} {value.status}</div>;
                    })
                  }</Contennoti>:''
                }
            </Noti>
        </>
    )

}



const Logo = styled.img`
padding: 21px 7px;
`
const Contennoti = styled.div`
height: 100%;
word-wrap: break-word;
width: 100%;
padding: 10px;
margin-top: 5px;
font-weight: bold;
font-size:14px;
color: #8d8686;
`
const Noti =styled.div`
z-index: 3;
background: #ffffff00;
display: flex;
align-items: center;
justify-content: center;
index: 3;
position: fixed;
width: 61px;
height: 61px;
border-radius: 50%;
right: 50px;
bottom: 32px;
box-shadow: 0 0 25px 2px rgb(0 0 0 / 5%);
cursor: pointer;
&.loading:after {
    display: flex;
    content:  ' 1';
    position: fixed;
    color: #d66767;
    font-weight: bold;
  }
  &:active{
    -webkit-transform: translateY(1px);
    -ms-transform: translateY(1px);
    transform: translateY(1px);
    box-shadow: none;
  }
  &.active{
    animation: 1s sadas 0s forwards;
      
  }
  &.active>${LoaderSpinner}{
    display: none;
  }
  &.active{
    animation: 1s sadas 0s forwards;
      
  }
  &.active ${Contennoti}{
    animation: 1s contennn 0s forwards;
      
  }
  @keyframes contennn {
    0% { opacity: 0;}
    20% { opacity: 0;}
    100% { 
        opacity: 1;
     }
  }
@keyframes sadas {

    100% { 
        height: 172px;
        width: 400px;
        border-radius: 10px;
        // background: #373043;
        background: #fefefe;
        opacity: 1;
     }
  }
  
`