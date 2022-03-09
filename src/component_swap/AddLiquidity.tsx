import { WrapNavLink,Row,Container,TitleText } from './Liquidity';
import { store } from "../store";
import { Provider, useSelector } from "react-redux";
import * as ReactDOM from "react-dom";
import React, { memo, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { BrowserRouter,Route ,Routes, NavLink,Outlet} from "react-router-dom";
import { TokenToggl, Wrapimg,WrapInput,InputAmount } from './Swap';
import PopupSelecttoken from "./Popup";
import { Field } from '../features/swap/reducer';
import { useAddliquidity, useAddliquidityHandlers, useTokenActive } from '../hook/addliquidity';
import { useApplicationHandlers } from '../hook/application';
import { activePoppup } from '../features/page/pageSlice';

export default  function AddLiquidity() {
  const [onCurrencySelect, setonCurrencySelect] = useState<1 | 2 | 0>(0);
  const stateAddliquidity = useAddliquidity();

  return (
    <div className="row justify-content-md-center mt-4">
    <Container >
      <Row style={{'justifyContent':'center'}}>
          <WrapNavLink to='/app/view/liquidity' style={{position: 'absolute','left': '0'}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
             back
          </WrapNavLink>
          <TitleText>Add Liquidity</TitleText>
      </Row>  
      <InputToken  Field={Field.INPUT} />
      <InputToken  Field={Field.OUTPUT}/>
          {JSON.stringify(stateAddliquidity)}
    </Container>
    </div>
  );
}

function InputToken({Field}:{Field:Field}){
  const token = useTokenActive(Field)
  const {typedValue,independentField} = useAddliquidity()
  const { onUserInput }= useAddliquidityHandlers()
  let quote =1;
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
          value={independentField==Field?typedValue:(quote?
            (status=='active'?(+quote)*1e-18:'')
             :'')}
          pattern="^-?[0-9]\d*\.?\d*$"
          onInput={(e:any)=>(e.target.validity.valid) ? onUserInput(Field, e.target.value) : false}

        />
    </WrapInput>
  </WrapTokenInput>
  )
}


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