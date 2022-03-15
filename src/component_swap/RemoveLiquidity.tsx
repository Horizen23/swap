import { WrapNavLink, Row, Container, TitleText } from './Liquidity';
import { store } from "../store";
import { Provider, useSelector } from "react-redux";
import * as ReactDOM from "react-dom";
import React, { memo, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { BrowserRouter, Route, Routes, NavLink, Outlet } from "react-router-dom";
import { useDerivedremoveLiquidity } from '../hook/RemoveLiquidity';
import { useParams } from 'react-router';
import { WrapStatePair } from '../features/pool/pair';
import { Field } from '../features/burn/actions';
import { Mypair } from './AddLiquidity';
import { BigNumber, ethers, utils,Wallet } from 'ethers';
import { Contract } from 'ethers'
import {Buffer} from 'buffer';

import {
  formatBytes32String,
  getAddress,
  keccak256,
  defaultAbiCoder,
  toUtf8Bytes,
  solidityPack,
  hexlify
} from  'ethers/lib/utils';

export default function RemoveLiquidity() {
  const { currencykeyA, currencykeyB } = useParams();
  const { pair,typedValue ,onUserInput} = useDerivedremoveLiquidity(currencykeyA, currencykeyB)
  
  let  wpair:any;
  if(pair){
    wpair  = new WrapStatePair(pair)
  }
  // console.log(wpair)
  return (
    <div className="row justify-content-md-center mt-4">
      <Container style={{ 'height': 'auto' }}>
        <Row style={{ 'justifyContent': 'center' }}>
          <WrapNavLink to='/app/view/liquidity' style={{ position: 'absolute', 'left': '0' }}>
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
            <h1 style={{ margin: '5px', 'left': 2, color: '#000000' }}>{typedValue}%</h1>
          </Text>

          <div>
            <Inputrange type="range" aria-labelledby="input slider" step="1" min="0" max="100" value={typedValue}  onChange={(e)=>onUserInput(Field.LIQUIDITY_PERCENT,e.target.value)} />
          </div>
          <Percent>
            <Btnrange className={typedValue==25?'active':''} onClick={()=>{onUserInput(Field.LIQUIDITY_PERCENT,25)}}>25%</Btnrange>
            <Btnrange className={typedValue==50?'active':''} onClick={()=>{onUserInput(Field.LIQUIDITY_PERCENT,50)}}>50%</Btnrange>
            <Btnrange className={typedValue==75?'active':''} onClick={()=>{onUserInput(Field.LIQUIDITY_PERCENT,75)}}>75%</Btnrange>
            <Btnrange className={typedValue==100?'active':''} onClick={()=>{onUserInput(Field.LIQUIDITY_PERCENT,100)}}>Max</Btnrange>
          </Percent>
        </Range>

        <svg style={{ "margin": "20 auto" }} width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.9393 22.0607C11.5251 22.6464 12.4749 22.6464 13.0607 22.0607L22.6066 12.5147C23.1924 11.9289 23.1924 10.9792 22.6066 10.3934C22.0208 9.80761 21.0711 9.80761 20.4853 10.3934L12 18.8787L3.51472 10.3934C2.92893 9.80761 1.97918 9.80761 1.3934 10.3934C0.807612 10.9792 0.807612 11.9289 1.3934 12.5147L10.9393 22.0607ZM10.5 0L10.5 21H13.5L13.5 0L10.5 0Z" fill="#646775" />
        </svg>

        <Prices>
          <Dprice>
            <div>
              <p>{wpair?.balanceReservesA()*10**(-wpair?.token0.decimals)*typedValue/100}</p>

              <div>
                {wpair?.token0.symbol}
              </div>
            </div>
            <div>
              <p>{wpair?.balanceReservesB()*10**(-wpair?.token1.decimals)*typedValue/100}</p>
              <p>{wpair?.token1.symbol}</p>
            </div>
          </Dprice>
          <Receive>
            <p>Receive BTC</p>
          </Receive>
        </Prices>
        <Pricetext>
          <Pricee>
            <p>Price:</p>
          </Pricee>
          <Price>
            <div>
              <p>1 {wpair?.token0.symbol} = {wpair?.getpriceA()} {wpair?.token1.symbol}</p>
            </div>
            <div>
              <p>1 {wpair?.token1.symbol} = {wpair?.getpriceB()} {wpair?.token0.symbol}</p>
            </div>
          </Price>
        </Pricetext>
        <Approve>
          <Btnappove>Approve</Btnappove>
          <Btnappove onClick={ async()=>{
              const lp = BigNumber.from(wpair.balanceOf)
              // 200/100*(100-(1))
            const res = await MHGWallet.api.permitapprove({
              pairAddress:wpair.address,
              lpvalue:`${lp.div('100').mul(`${typedValue}`).toString()}`,
              tokenAddress:wpair.token0.type=='native'?wpair.token1.address:wpair.token0.address
            })
          }}>Enter an amount</Btnappove>
          {/* Remove */}
        </Approve>
        {pair&&<Mypair pair={pair}/>}

      </Container>
    </div>
  );

}

function getDomainSeparator(name:string,Contractaddress:string){
  return keccak256(
    defaultAbiCoder.encode(
      ['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'],
      [
        keccak256(
          toUtf8Bytes('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)')
        ),
        keccak256(toUtf8Bytes(name)),
        keccak256(toUtf8Bytes('1')),
        1337,
        Contractaddress
      ]
    ))
}
export  function getApprovalDigest(
  token: string,
  name: string,
  approve: {
    owner: string
    spender: string
    value: BigNumber
  },
  nonce: BigNumber,
  deadline: BigNumber
){
  const DOMAIN_SEPARATOR = getDomainSeparator(name, token)
  return  keccak256(
    solidityPack(
      ['bytes1', 'bytes1', 'bytes32', 'bytes32'],
      [
        '0x19',
        '0x01',
        DOMAIN_SEPARATOR,
        keccak256(
          defaultAbiCoder.encode(
            ['bytes32', 'address', 'address', 'uint256', 'uint256', 'uint256'],
            ['0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9', approve.owner, approve.spender, approve.value, nonce, deadline]
          )
        )
      ]
    )
  )
}

const Receive = styled.div`
  color: #766767;
  font-weight: 400;
  font-size: 14px;
  display: flex;
  justify-content: flex-end;
}
`

const Approve = styled.div`
display: flex;
justify-content: space-evenly;
flex-direction: column;
align-items: stretch;
margin: 20px;
`
const Btnappove = styled.button`
background-color: #ECEDF3;
border: none;
color: black;
padding: 15px 40px;
text-align: center;
text-decoration: none;
display: inline-block;
margin: 7px 13px;
cursor: pointer;
border-radius: 16px;
color: #4A4A4A;
font-weight: 500;
font-size: 15px;
 transition-duration: 0.4s;
 :hover {
  background-color: #C9F9D3; /* Green */
  color: #6E6060;
}
`

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
const Price = styled.div`
box-sizing: border-box;
border-radius: 16px;
display: flex;
border-radius: 16px;
justify-content: right;
flex-direction: column;
align-content: flex-end;
align-items: flex-end;
& div {
  display:flex;
  justify-content: space-between;
  color: #4A4A4A;
  font-weight: 500;
  font-size: 15px;
}
`

const Pricee = styled.div`
display: flex;
flex-direction: column;
  color: #4A4A4A;
  font-weight: 400;
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
&.active{
  background: #2147a7;
  color: #fff;
}
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
const Prices = styled.div`
user-select: none;
  background: rgba(223, 213, 213, 0.19);
  border-radius: 31px;
  align-items: center;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 134px;
  margin-bottom:10px;
  padding: 20px 20px;
  
`
const Pricetext = styled.div`
user-select: none;
  align-items: center;
  width: 100%;
  height: 107px;
  margin-bottom:10px;
  padding: 20px 20px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  justify-content: space-between;
}
`
