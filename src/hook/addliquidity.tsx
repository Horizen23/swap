import { isAddress } from "@ethersproject/address";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  addtokendb,
  selectcurrency,
  selecttoken,
  selectTokendb,
  tokenbalanceAsync,
  useloadWallet,
} from "../features/balance/balanceSlice";
import { useAppDispatch, useAppSelector } from ".";
import { RootState, AppThunk, store } from "../store";
import { parseUnits } from "@ethersproject/units";
import JSBI from "jsbi";
import {
  Erc20Approve,
  RoutingAPITrade,
  Routingloading,
} from "../features/swap/router";
import { createSelector } from "@reduxjs/toolkit";
import _ from "underscore";
import { BigNumber as BN } from "ethers";
import { SwapTrade } from "../features/transaction/reducer";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router";
import { getselectInfo, gettokenBykey } from "./token";
import {
  computePairAddress,
  creatPaiaOffchain,
  usePair,
  usepair,
} from "./pool";
import pair, { Getpair, WrapStatePair } from "../features/pool/pair";
import { Field } from "../features/mint/actions";
import { useMintActionHandlers, useMintState } from "../features/mint/hooks";
import { BtnError, BtnSuccess } from "./swap";

// export function useDerivedaddliquidity():any {
//   const dispatch = useAppDispatch()
//   const {pair,INPUT,OUTPUT} = useAddliquidity();
//   const { currencykeyA,currencykeyB } = useParams();
//   const {onCurrencySelection} = useAddliquidityHandlers()
//   const history = useNavigate();
//   const pairs =  usepair()
//   const tokenA = gettokenBykey(INPUT.key!)
//   const tokenB = gettokenBykey(OUTPUT.key!)
//   let ButtonSwap: ReactNode | undefined
//   useEffect(()=>{
//     onCurrencySelection(Field.INPUT,getselectInfo(currencykeyA!) )
//     onCurrencySelection(Field.OUTPUT,getselectInfo(currencykeyB!))
//   },[])
//   useEffect(()=>{
//     if(OUTPUT.key&&INPUT.key){
//       history(`/app/view/liquidity/add/${INPUT.key}/${OUTPUT.key}`, { replace: true })
//       if(tokenA&&tokenB){
//         const pr = creatPaiaOffchain(tokenA,tokenB)
//         // if(!pairs.list[pr.address] ){
//            dispatch(GetpairSig(pr))
//         // }else{
//           // pairs.list[pr.address]
//         // }
//       }
//   }
//   },[OUTPUT.key,INPUT.key])
// // console.log(stateAddliquidity)
// return {pair,ButtonSwap}

// }

export function useDerivedaddliquidity( currencykeyA:string| undefined, currencykeyB:string| undefined): {
  formattedAmounts:any
  pair:any
  isactive:any
  tokenA:any
  tokenB:any
  noLiquidity:boolean
  Btnstatus: ReactNode | undefined
} {

  const tokenA = gettokenBykey(currencykeyA!);
  const tokenB = gettokenBykey(currencykeyB!);
  const [isactive, pair,setpair] = usePair(tokenA, tokenB);
  const Wpair = new WrapStatePair(pair);
  console.log(Wpair)
            // @ts-ignore: Unreachable code error

  const noLiquidity =(pair.balanceOf=='undefined')?true:Wpair.isnewpool;
  const { independentField, typedValue, otherTypedValue } = useMintState();
  const dependentField = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;
  const {onresetMint} = useMintActionHandlers(noLiquidity)
  useEffect(()=>{
    onresetMint()
  } ,[currencykeyA,currencykeyB])

  const parsedAmounts= useMemo(() => {
    if(tokenA&&Wpair.token0){
      const rev =  (tokenA.address===Wpair.token0.address);
      const  price =( isactive!='active'||typeof Wpair.Reserves == "undefined")?'0':independentField === Field.INPUT ?(rev?Wpair.getpriceA():Wpair.getpriceB()):(rev?Wpair.getpriceB():Wpair.getpriceA());
       return typedValue?`${+price*+typedValue}`:""
    }
    return "";
    }, [independentField,typedValue,pair])
    const formattedAmounts: any = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts ?? "",
  };

  let Btnstatus: ReactNode | undefined

  if (isactive !="active") {
    Btnstatus = Btnstatus ?? <BtnError>load...</BtnError>
  }

  if (!formattedAmounts[Field.INPUT] || !formattedAmounts[Field.OUTPUT]) {
    Btnstatus = Btnstatus ?? <BtnError>Enter an amount</BtnError>
  }
  
  // @ts-ignore: Unreachable code error
  if ((typedValue&&tokenB) && tokenB.balance*10**-tokenB.decimals<formattedAmounts[Field.OUTPUT]) {
    Btnstatus = <BtnError>Insufficient {tokenB.symbol} balance</BtnError>
  }
  // @ts-ignore: Unreachable code error
  if ((typedValue&&tokenA) && tokenA.balance*10**-tokenA.decimals<formattedAmounts[Field.INPUT]) {
    Btnstatus = <BtnError>Insufficient {tokenA.symbol} balance</BtnError>
  }
    // @ts-ignore: Unreachable code error
  if ((pair&&tokenA)&&(tokenB&&pair.token0)&&pair.token1) {
    // @ts-ignore: Unreachable code error
    const isreverse:any =tokenA.address==pair.token0.address?false:true;
    const formattedAmountstokenindex = {
            token0:isreverse?tokenB:tokenA,
            token1:isreverse?tokenA:tokenB
    }

    const  amoutA = independentField==Field.INPUT?typedValue:otherTypedValue
    const  amoutB = independentField==Field.OUTPUT?typedValue:otherTypedValue
    // @ts-ignore: Unreachable code error
      if (+pair['allowance0']<+(isreverse?amoutA:amoutB)&&formattedAmountstokenindex.token0.type != 'native') {
        Btnstatus = Btnstatus?? <BtnSuccess onClick={ ()=>{
            // @ts-ignore: Unreachable code error

        MHGWallet.api.erc20approve(formattedAmountstokenindex.token0.address as string).then(e=>setpair({...pair,allowance0:'999999999999999934999999999999999999'}))
        }}
        >appove token {formattedAmountstokenindex.token0.name}</BtnSuccess>
      }
            // @ts-ignore: Unreachable code error
      if (+pair['allowance1']<+(isreverse?amoutB:amoutA)&&formattedAmountstokenindex.token1.type != 'native') {
        Btnstatus = Btnstatus?? <BtnSuccess onClick={()=>{
            // @ts-ignore: Unreachable code error

         MHGWallet.api.erc20approve(formattedAmountstokenindex.token1.address  as string).then(e=>setpair({...pair,allowance1:'999999999999999934999999999999999999'}))
        }}>appove token {formattedAmountstokenindex.token1.name}</BtnSuccess>
      }

  }
    // @ts-ignore: Unreachable code error


  // if (currencyBAmount && currencyBalances?.[Field.CURRENCY_B]?.lessThan(currencyBAmount)) {
  //   error = <BtnError>Insufficient {currencies[Field.CURRENCY_B]?.symbol} balance</BtnError>
  // }
  // BtnError
  // BtnSuccess
  // BtnLogin


  return { formattedAmounts, pair, isactive, tokenA, tokenB, noLiquidity ,Btnstatus};
}
