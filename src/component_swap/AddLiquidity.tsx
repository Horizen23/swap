import { WrapNavLink,Row,Container,TitleText, Nameinfo } from './Liquidity';
import { store } from "../store";
import { Provider, useSelector } from "react-redux";
import * as ReactDOM from "react-dom";
import React, { memo, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { BrowserRouter,Route ,Routes, NavLink,useNavigate } from "react-router-dom";
import { TokenToggl, Wrapimg,WrapInput,InputAmount } from './Swap';
import PopupSelecttoken from "./Popup";
import { useDerivedaddliquidity } from '../hook/addliquidity';
import { useApplicationHandlers } from '../hook/application';
import { activePoppup } from '../features/page/pageSlice';
import { useParams } from 'react-router';
import { getselectInfo, useAllTokens } from '../hook/token';
import { WrapStatePair } from '../features/pool/pair';
import { useMintActionHandlers, useMintState } from '../features/mint/hooks';
import {Field} from '../features/mint/actions'
import Popup from './Popup';
import { BtnSuccess } from '../hook/swap';
export default  memo(function AddLiquidity(){
  const history = useNavigate()
  const{ formattedAmounts,pair,isactive,tokenA,tokenB,noLiquidity,Btnstatus} = useDerivedaddliquidity()
  const {onFieldAInput,onFieldBInput,onresetMint} = useMintActionHandlers(noLiquidity)
  const wpair = new WrapStatePair(pair)
  useEffect(()=>{
    return onresetMint()
  },[])
  return (
  <div className="row justify-content-md-center mt-4">
    <Container style={{'height':'auto'}}>
     
      <Row style={{'justifyContent':'center'}}>
          <WrapNavLink to='/app/view/liquidity' style={{position: 'absolute','left': '0'}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
             back
          </WrapNavLink>
          <TitleText>Add Liquidity</TitleText>
      </Row>  
      {/* {JSON.stringify(formattedAmounts)} */}
      <InputToken token={tokenA} Field={Field.INPUT} onFieldInput={onFieldAInput} amount={formattedAmounts[Field.INPUT]}/>
      <p>balance:4565</p>
      <InputToken token={tokenB} Field={Field.OUTPUT} onFieldInput={onFieldBInput} amount={formattedAmounts[Field.OUTPUT]}/> 
      <p>balance:4565</p>
      
        <InfoInputStatus>
          <div>
              <p>{tokenA.symbol} per {tokenB.symbol}</p>
              <p>{isactive=='active'&&!wpair.isnewpool?wpair.getpriceA():'-'}</p>
          </div>
          <div>
              <p>{tokenB.symbol} per {tokenA.symbol}</p>
              <p>{isactive=='active'&&!wpair.isnewpool?wpair.getpriceA():'-'}</p>
          </div>
          <div>
              <p>Share of Pool</p>
              <p>0 %</p>
          </div>
      </InfoInputStatus>
      {Btnstatus?Btnstatus:<BtnSuccess>Add Liquidity</BtnSuccess>}
        {(isactive=='active'&&wpair.ispoolshare)&& (
        <ManagePari style={{'marginTop':'20px'}}>
              <p>Share of Pool</p>
             <div>
             <WNameeinfo>
                <div className="imageInfo">
                  <img src={wpair.token0.logoURI} />
                  <img src={wpair.token1.logoURI} />
                </div>
                <div> {wpair.token0.symbol}/{wpair.token1.symbol} </div>
              </WNameeinfo>
                <p>51.96</p>
             </div>
             <div>
                <p>Your pool share:</p>
                <p>{wpair.getpercent()}% </p>
             </div>
             <div>
                <p>{wpair.token0.symbol}:</p>
                <p>{wpair.balanceReservesA()*1e-18}</p>
             </div>
             <div>
                <p>{wpair.token1.symbol}:</p>
                <p>{wpair.balanceReservesB()*1e-18}</p>
             </div>
          <div></div>
      </ManagePari>
      )}

       <Popup  Active={{
        INPUT:tokenA,
        OUTPUT:tokenB,
      }}hadderCLick={(field,token)=>{
        const key1 = token.type=='native'?token.symbol:token.address;
        let key2;
        if(field=='INPUT'){
             key2 = tokenB.type=='native'?tokenB.symbol:tokenB.address
             if(key1!=key2){
               history(`/app/view/liquidity/add/${key1}/${key2}`, { replace: true })
             }
        }else{
             key2 = tokenB.type=='native'?tokenB.symbol:tokenB.address
             if(key1!=key2){
              history(`/app/view/liquidity/add/${key2}/${key1}`, { replace: true })
            }
        }
      }}/>
    </Container>

    </div>
  );
})

function InputToken({Field,onFieldInput,amount,token}:{Field:Field,onFieldInput:any,amount:any,token:TToken}){
  const {onUserChangpopup} = useApplicationHandlers()
  return (  
  <WrapTokenInput>
     <TokenToggl  onClick={()=>{onUserChangpopup(true,activePoppup.AddLiquidity[Field as Field])}}>
        <Wrapimg>
          <img src={token.logoURI} />
        </Wrapimg>
        <span className="symbol">{token?token.symbol:'select'}</span>
        <svg width="14" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 9C7.71875 9 7.46875 8.90625 7.28125 8.71875L1.28125 2.71875C0.875 2.34375 0.875 1.6875 1.28125 1.3125C1.65625 0.90625 2.3125 0.90625 2.6875 1.3125L8 6.59375L13.2812 1.3125C13.6562 0.90625 14.3125 0.90625 14.6875 1.3125C15.0938 1.6875 15.0938 2.34375 14.6875 2.71875L8.6875 8.71875C8.5 8.90625 8.25 9 8 9Z" fill="#A0A5BA"/>
        </svg>
      </TokenToggl>
      <WrapInput>
        <InputAmount
          placeholder="0.00"
          value={amount}
          pattern="^-?[0-9]\d*\.?\d*$"
          onInput={(e:any)=>(e.target.validity.valid) ? onFieldInput(e.target.value) : false}

        />
    </WrapInput>
  </WrapTokenInput>
  )
}


const InfoInputStatus =styled.div`
    display: flex;
    width: 100%;
    background: #ffffff; 
    padding: 18px;
    box-sizing: border-box;
    border-radius: 16px;
    justify-content: space-evenly;
    margin-bottom: 20px;
    flex-wrap: wrap;
& div{
    box-shadow: 0 0 25px 2px rgb(0 0 0 / 5%);
    background: #ffffffb3;
    padding: 10px;
    border-radius: 10px;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}
& div p{
  margin: 0;
}
& div p:first-child{
  font-weight: bold;
  font-size: 15px;
  color: #7c7272;
  margin-bottom: 5px;
}
& div p:last-child{
  background: #f6f6f691;
    color: #505050;
    border: 1px solid #dddddd80;
    width: 100%;
    border-radius: 5px;
  
}
`
const WNameeinfo = styled(Nameinfo)`
& .imageInfo {
  align-items: center;
  width: 40px;
}
& img:last-child {
  left: 14px;
}
&  img {
  width: 21px;
}
& div:last-child{
  margin-left: 0;
  margin-top: 0 !important;
  color: #4A4A4A;
  align-items: center;
  font-weight: inherit;
  font-size: 13px;
}
`

const ManagePari = styled.div`
width: 100%;
left: 233px;
top: 440px;
background: #F0F3FF;
padding: 18px;
border: 1px solid #516AE4;
box-sizing: border-box;
border-radius: 16px;
& div:not(:last-child) {
  display:flex;
  justify-content: space-between;
  color: #4A4A4A;
  font-weight: 500;
  font-size: 15px;
}
& p{
  margin:0;
} 
& div:last-child{
  display: flex;
  justify-content: flex-end;
  margin-top: 17px;
}
`

const WrapTokenInput = styled.div`
    margin-bottom: 6px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    position: relative;
    background: var(--color-bg);
    border: 1px solid var(--color-boder);
    box-sizing: border-box;
    border-radius: 15px;
    width: 100%;
    height: 70px;
    padding: 10px 13px;
    color: var(--color-tx2);

`