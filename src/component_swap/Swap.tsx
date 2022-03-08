import { store } from "../store";
import { Provider, useSelector } from "react-redux";
import * as ReactDOM from "react-dom";
import React, { memo, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../hook";
import {Field, SwapState, switchswap} from '../features/swap/reducer'
import {
  selectcurrency,
  selecttoken,
  selectTokendb,
  useloadWallet,
} from "../features/balance/balanceSlice";
import PopupSelecttoken from "./Popup";
import { data } from "jquery";
import { selectSwap } from "../features/swap/reducer";
import { useDerivedSwapInfo, useGraph, useRouterpartPrice, useRouterState, useSwapActionHandlers, useSwapState, useTokenActive } from "../hook/swap";
import { useMatch } from "react-router";
import { useApplicationHandlers } from "../hook/application";
import { activePoppup } from "../features/page/pageSlice";

export default function Swap() {
  const [percent, setpercent] = useState(0);
  const {onSwitchTokens,onCurrencySelection,onUserInputpercent,onUserSwap,onAppove} = useSwapActionHandlers()  
  const TokenINPUT = useTokenActive(Field.INPUT)
  const TokenOUTPUT = useTokenActive(Field.OUTPUT)
 
  const {ButtonSwap,router,onUserRoutingAPITrade} = useDerivedSwapInfo()
 
  return (
    <Container className="col-lg-4 ">
      <span className="text_head">Swap Token test</span>
      <TokenInput Field={Field.INPUT}  setpercent={setpercent}/>
        <Balance>Balance:  {(Math.pow(10, -TokenINPUT.decimals) * (TokenINPUT.balance as number)).toFixed(4) }</Balance>
      <WrapBtnpercent>
        <div className="buttons flex">
          <BtnPercent percent={25} onUserInputpercent={onUserInputpercent}/>
          <BtnPercent percent={50} onUserInputpercent={onUserInputpercent}/>
          <BtnPercent percent={75} onUserInputpercent={onUserInputpercent}/>
          <BtnPercent percent={100} onUserInputpercent={onUserInputpercent}/>
        </div>
      </WrapBtnpercent>
     <SvgLogo onClick={onSwitchTokens}/>
      <TokenInput Field={Field.OUTPUT} setpercent={setpercent}/>
      <Balance>Balance:  {(Math.pow(10, -TokenOUTPUT.decimals) * (TokenOUTPUT.balance as number)).toFixed(4) }</Balance>

      <SwapDetail/>

      <WrapButton>
        {ButtonSwap
        // inputError?
        // <ButtonSwap style={{cursor: 'no-drop','color':' rgb(145 140 140)',backgroundColor:'rgb(227 232 230)'}}>
        //   {inputError}
        // </ButtonSwap>
        // :
        // BtnAppove?
        // <ButtonSwap style={{color:'rgb(110 65 65)',backgroundColor:'rgb(187 246 218)'}} onClick={()=>{
        //   onAppove()
        // }}>
        //    {BtnAppove}
        // </ButtonSwap>
        // :<ButtonSwap style={{color:'rgb(110 65 65)',backgroundColor:'rgb(187 246 218)'}} onClick={()=>{
        //     onUserSwap();
        //   }}>
        //   <span>
        //       swap
        //     </span> 
        // </ButtonSwap>

        }
      </WrapButton>

 
    </Container>
  );
}

function BtnPercent({percent:percentSTR,onUserInputpercent}: {percent: number,onUserInputpercent:any}) {
  const {percent} = useSwapState()
  return (
    <Btnpercent
      onClick={() => onUserInputpercent(percentSTR)}
      className={`${percentSTR == percent && "active"}`}
    >
      {" "}
      {percentSTR}%{" "}
    </Btnpercent>
  );
}

function TokenInput({Field,setpercent}:{Field:Field,setpercent:any}) {
  const token = useTokenActive(Field)
  const { onUserInput }= useSwapActionHandlers()
  const {typedValue,independentField} = useSwapState()
  const {router:{amount,quote},status}= useRouterState()
  const {onUserChangpopup} = useApplicationHandlers()

  return (  
    <WrapTokenInput className={independentField!==Field?status:''}>
      <TokenToggl  onClick={()=>{onUserChangpopup(true,activePoppup.SWAP[Field])}}>
        <Wrapimg>
          <img src={token.logoURI} />
        </Wrapimg>
        <span className="symbol">{token?token.symbol:'select'}</span>
        <svg width="14" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 9C7.71875 9 7.46875 8.90625 7.28125 8.71875L1.28125 2.71875C0.875 2.34375 0.875 1.6875 1.28125 1.3125C1.65625 0.90625 2.3125 0.90625 2.6875 1.3125L8 6.59375L13.2812 1.3125C13.6562 0.90625 14.3125 0.90625 14.6875 1.3125C15.0938 1.6875 15.0938 2.34375 14.6875 2.71875L8.6875 8.71875C8.5 8.90625 8.25 9 8 9Z" fill="#A0A5BA"/>
        </svg>
      </TokenToggl>
      <WrapInput>
        {/* {(TokenActive.status!='loading')
        ? */}
        <InputAmount
          placeholder="0.00"
          value={independentField==Field?typedValue:(quote?
           (status=='active'?(+quote)*1e-18:'')
            :'')}
          pattern="^-?[0-9]\d*\.?\d*$"
          onInput={(e:any)=>(e.target.validity.valid) ? onUserInput(Field, e.target.value) : false}
        />
        {/* :<LoaderSpinner/>
        } */}
      </WrapInput>
    </WrapTokenInput>
  );
}

const SvgLogo = function({onClick}:any){
  return<WrapLogo >  <svg onClick={()=>onClick()} width="35" height="50" viewBox="0 0 128 128" fill="none"  >
  <path d="M64 128C99.3462 128 128 99.3462 128 64C128 28.6538 99.3462 0 64 0C28.6538 0 0 28.6538 0 64C0 99.3462 28.6538 128 64 128Z" fill="#373043" ></path>
  <path d="M53.824 36.16C53.824 34.752 52.672 33.6 51.264 33.6C49.856 33.6 48.704 34.688 48.704 36.096C48.704 44.096 51.84 51.776 57.408 57.408L61.184 54.016C56.512 49.344 53.824 42.88 53.824 36.16Z" fill="#FFD5D6"></path>
  <path d="M70.528 62.464L66.752 65.856C71.424 70.528 74.112 76.992 74.112 83.648V85.76L71.488 83.136C70.464 82.112 68.864 82.112 67.904 83.136C66.88 84.096 66.88 85.76 67.904 86.72L74.88 93.632C75.328 94.08 76.032 94.4 76.672 94.4C77.376 94.4 78.016 94.144 78.464 93.632L85.44 86.656C85.952 86.144 86.208 85.504 86.208 84.864C86.208 84.224 85.952 83.584 85.44 83.072C84.416 82.048 82.816 82.048 81.856 83.072L79.232 85.696V83.584C79.168 75.648 76.032 68.032 70.528 62.464Z" fill="#FFD5D6"></path>
  <path d="M53.12 93.632L60.096 86.72C60.608 86.208 60.864 85.568 60.864 84.928C60.864 84.288 60.608 83.648 60.096 83.136C59.136 82.176 57.472 82.176 56.512 83.136L53.888 85.76V83.648C53.888 76.48 56.96 69.632 62.336 64.896L69.12 58.752C75.584 52.992 79.296 44.8 79.296 36.16C79.296 34.752 78.144 33.6 76.736 33.6C75.328 33.6 74.176 34.688 74.176 36.096C74.176 43.328 71.104 50.176 65.728 54.912L58.88 60.992C52.416 66.752 48.768 74.944 48.768 83.584V85.76L46.144 83.136C45.184 82.176 43.52 82.176 42.56 83.136C41.6 84.096 41.6 85.76 42.56 86.72L49.536 93.696C50.56 94.656 52.16 94.656 53.12 93.632Z" fill="#FFD5D6"></path>
</svg>
</WrapLogo>
}
const SwapDetail = memo(()=>{
  const price = useRouterpartPrice();
  return <WrapSwapDetail>
    <ContentSwapDetail>
        <ButtonSwapDetail>
                <PriceSwap>
                  <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6E727D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                  <Price>
                   {price}
                  </Price>  
                </PriceSwap>
                <ToggoleSwapDetail>
                </ToggoleSwapDetail>
        </ButtonSwapDetail>
    </ContentSwapDetail>

  </WrapSwapDetail>
})
const Price = styled.div`
  margin: 10px;
`
const ToggoleSwapDetail = styled.div`
`
const PriceSwap = styled.div`
position: relative;
width: fit-content;
width: 100%;
display: flex;
padding: 0px;
-webkit-box-align: center;
align-items: center;
-webkit-box-pack: start;
justify-content: flex-start;
box-sizing: border-box;
margin: 0px;
min-width: 0px;

`
const ButtonSwapDetail  = styled.div`
    padding: 4px 8px;
    border-radius: 12px;
    background-color: transparent;
    -webkit-box-align: center;
    align-items: center;
    cursor: pointer;
    min-height: 40px;
    -webkit-box-pack: justify;
    justify-content: space-between;
    width: 100%;
    display: flex;
`
const ContentSwapDetail  = styled.div`
width: 100%;
margin-bottom: -8px;
display: grid;
grid-auto-rows: auto;
row-gap: 8px;
`
const WrapSwapDetail = styled.div`
    height:40px;
    width: 100%;
    -webkit-box-pack: center;
    justify-content: center;
    width: 100%;
    display: flex;
    padding: 0px;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: start;
    justify-content: flex-start;
    box-sizing: border-box;
    margin: 0px;
    min-width: 0px;
`
const inddput =styled.div`
background: linear-gradient(110deg,#ececec 8%,#f5f5f5 18%,#ececec 33%);
background-size: 200% 100%;
-webkit-animation: 1.5s shine linear infinite;
animation: 1.5s shine linear infinite;`
const WrapLogo = styled.div`
align-items: center;
justify-content: center;
display: flex;
margin-bottom: 14px;
& svg{
  cursor: pointer;
}
&:active{
  opacity: 0.85;
  -webkit-transform: translateY(1px);
  -ms-transform: translateY(1px);
  transform: translateY(1px);
  box-shadow: none;
}
`
export const LoaderSpinner = styled.div`
border: 4px solid #b4d2c45e;
border-top: 4px solid #87939a;
border-radius: 50%;
width: 50px;
    height: 50px;
-webkit-animation: spin 2s linear infinite;
-webkit-animation: spin 2s linear infinite;
animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

` 
export const Wrapimg = styled.div`
  & img {
    min-width: 24px;
  }
`;
const Balance = styled.span`
  margin-top:5px;
  font-weight: bold;
  color: #8d8686;
`;

const Container = styled.div`
margin:  0 15px 0 15px;
  width: 439px;
  background-color: var(--color-bg);
  color: var(--color-tx2);
  background-color: var(--color-bg);
  box-shadow: 0 0 25px 2px rgb(0 0 0 / 5%);
  display: flex;
  padding: 25px 10px;
  border-radius: 10px;
  flex-direction: column;
  max-width: 400px;
  min-width: 356px;
  border-radius: 30px;
  padding: 30px;
  overflow: hidden;
  z-index: 1;
`;
const WrapBtnpercent = styled.div`
  margin-bottom: 20px;
  margin-top: 11px;
  display: flex;
  justify-content: space-between;
`;
const Btnpercent = styled.button`
  cursor: pointer !important;
  --btn-height: 30px;
  width: 55px;
  border: 1px solid var(--color-boder);
  margin: 0 5px;
  color: var(--color-tx-bp);
  outline: none;
  font-weight: 500;
  background-color: var(--color-bg);
  border-radius: 10px;
  &.active {
    background: #96bfec;
    color: white;

  }
  &:active{
    opacity: 0.85;
    -webkit-transform: translateY(1px);
    -ms-transform: translateY(1px);
    transform: translateY(1px);
    box-shadow: none;
  }
`;

export const InputAmount = styled.input`
  overflow: visible;
  margin: 0;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  padding: 1px 2px;
  text-align: right;
  font-weight: 600;
  line-height: 1.5;
  font-size: var(--font-smoll);
  width: 100%;
  background: #fff0;
  border: 1px solid #20225100;
  outline: none;
  color: var(--color-tx2);
`;
export const WrapInput = styled.div`
  align-items: center; justify-content: end;
  width: 100%;
  position: relative;
  display: flex;
`;
export const TokenToggl = styled.button`
box-shadow: 0 0 9px 1px rgb(156 156 156 / 23%);
background-color: #F0F3FF; 
border-radius: 10px;
  color: var(--color-tx2);
  border: 0;
  margin-right: 20px;
  cursor: pointer;
  display: grid;
    grid-template-columns: 23px 48px 18px;
    justify-items: center;
    align-items: center;
    align-content: stretch;
    grid-gap: 5px;
  justify-content: center;
  align-items: center;
  &:hover {
    color: black;
    background: #afb5cc3d;
  }
  &:active{
    opacity: 0.85;
    -webkit-transform: translateY(3px);
    -ms-transform: translateY(3px);
    transform: translateY(3px);
    box-shadow: none;
  }
`;
const WrapTokenInput = styled.div`
margin-bottom: 6px;
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
  &.loading{
    background: linear-gradient(110deg,#ececec 8%,#f5f5f5 18%,#ececec 33%);
  background-size: 200% 100%;
  -webkit-animation: 1.5s shine linear infinite;
  animation: 1.5s shine linear infinite;
  }
`;
const ButtonSwap = styled.button`

background-color: rgb(187 246 218);
    color: rgb(213,0,102);
    font-size: 16px;
    font-weight: 500;
    padding: 16px;
    width: 100%;
    font-weight: 500;
    text-align: center;
    border-radius: 20px;
    outline: none;
    border: 1px solid transparent;
    color: rgb(110 65 65);
    -webkit-text-decoration: none;
    text-decoration: none;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-flex-wrap: nowrap;
    -ms-flex-wrap: nowrap;
    flex-wrap: nowrap;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    position: relative;
    z-index: 1;
    will-change: transform;
    -webkit-transition: -webkit-transform 450ms ease 0s;
    -webkit-transition: transform 450ms ease 0s;
    transition: transform 450ms ease 0s;
    -webkit-transform: perspective(1px) translateZ(0px);
    -ms-transform: perspective(1px) translateZ(0px);
    transform: perspective(1px) translateZ(0px);
    box-sizing: border-box;
    margin: 0px;
    min-width: 0px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    overflow: hidden;
    &:active{
      -webkit-transform: translateY(1px);
      -ms-transform: translateY(1px);
      transform: translateY(1px);
      box-shadow: none;
    }
    // &:hover span{
    //   animation: 2s slide-right 2s forwards;
    //   transform:translateX(0%);
    // }
    // @keyframes slide-right {
    //   to {
    //     transform: translateX(226%);
    //   }
    // }
`
const WrapButton = styled.div`
margin-top: 21px;
`