import * as ReactDOM from "react-dom";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAppSelector, useAppDispatch } from "../hook";
import {
  balanceAsync,
  selectcurrency,
  selecttoken,
  useAddtoken,
  useLoadToken,
} from "../features/balance/balanceSlice";
import { change, selectActiveToken, toggleToken } from "../features/page/pageSlice";

export default function Yourwallets() {
  return (
    <div className="col-md-12 col-lg-4">
      <div
        className="nav flex-column nav-pills"
        role="tablist"
        aria-orientation="vertical"
      >
        <div className="wallet-title ">Your Wallets</div>
        <CurrencyList />
        <TokenList />
      </div>
    </div>
  );
}

let CurrencyList = () => {
  const currency = useAppSelector(selectcurrency);
  const active = useAppSelector(selectActiveToken)
  const dispatch = useAppDispatch();
  return (
    <>
      {Object.keys(currency).map((keyName, index) => (
        <WrapA key={keyName} onClick={()=>active!=keyName&&dispatch(change(keyName))} className={`${active==keyName&&'active '}nav-link d-flex justify-content-between align-items-center`}>
          <div className="d-flex">
            <ImageToken src={currency[keyName].logoURI} />
            <div>
                <TokenSymbol >{currency[keyName].symbol}</TokenSymbol>
                <TokenName>{currency[keyName].name}</TokenName>
            </div>
          </div>
          {
            {
              'idle':   <Addwallet />,
              'active':  <Balance balance={currency[keyName].balance} decimals={currency[keyName].decimals}/>,
              'loading':  <LoadBalance/>,
            }[currency[keyName].status as string]
          }
        </WrapA>
      ))}
    </>
  );
};
let TokenList = () => {
  const token = useAppSelector(selecttoken);
  const active = useAppSelector(selectActiveToken)
  const dispatch = useAppDispatch();
  const LoadToken  = useLoadToken(dispatch)
  useEffect(()=>{LoadToken()},[])
  useEffect(()=>{
  })
 return  <>
      {Object.keys(token).map((keyName, index) => (
        <WrapA key={keyName} onClick={()=>active!=keyName&&dispatch(change(keyName))} className={`${active==keyName&&'active '}nav-link d-flex justify-content-between align-items-center`}>
          <div className="d-flex">
            <ImageToken src={token[keyName].logoURI} />
            <div>
                <TokenSymbol>{token[keyName].symbol }</TokenSymbol>
                <TokenName>{token[keyName].name}</TokenName>
            </div>
          </div>
          {
            {
              'idle':   <Addwallet />,
              'active':  <Balance balance={token[keyName].balance} decimals={token[keyName].decimals}/>,
              'loading':  <LoadBalance/>,
            }[token[keyName].status as string]
          }
        </WrapA>
      ))}
       <IconsAdd onClick={()=>dispatch(toggleToken())}>
        <i className="ion ion-md-add" ></i>
      </IconsAdd>
    </>
 
};












const TokenSymbol= styled.h2``
const TokenName= styled.p``
const ImageToken = styled.img`
border-radius: 18px;
background-color: #FFFFFF;
margin-right: 15px;
overflow: hidden;
`
const Addwallet = ()=>{
    return    <p className="text-right nav-link" >
    <svg className="svg-inline--fa fa-plus-circle fa-w-16" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="" style={{ color: "rgb(58, 201, 58)", fontSize: "20px" }}>
      <path
        fill="currentColor"
        d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z"
      ></path>
    </svg>
  </p>
}

const WrapA = styled.a.attrs(({key,className,onClick}:any) => ({
  key,
  className,
  onClick
}))`
  cursor: pointer;
  &.active >.load-wallet{
    background: linear-gradient(110deg, #ececec1a 8%, #f5f5f559 18%, #ececec1f 33%);
    background-size: 200% 100%;
  }
  &:hover{
    background: #ff56800d;
  }
  &> .load-wallet{
    background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
    background-size: 200% 100%;
  }
`;

const LoadBalance =styled.div.attrs(() => ({
  className:'load-wallet'
}))`
  width: 30%;
  height: 24px;
  margin-left: 10%;
  border-radius: 5px;
  animation: 1.5s shine linear infinite;

`
const Balance =({balance,decimals}:any) => {
    return <div>
                <h3>{(Math.pow(10, -decimals) * balance).toFixed(8)}</h3>
                <p className="text-right">
                    <i className="icon ion-md-lock"></i>
                    <span> 0.00000000</span>
                </p>
            </div>
}


const IconsAdd = styled.div`
  cursor: pointer;
  width: 35px;
  height: 35px;
  background: #fff5f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ebebeb;
  color: #446042;
  margin: 9px auto;
`;
