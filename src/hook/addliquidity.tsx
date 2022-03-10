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
import { useMintState } from "../features/mint/hooks";
import { BtnError } from "./swap";

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

export function useDerivedaddliquidity(): {
  formattedAmounts:any
  pair:any
  isactive:any
  tokenA:any
  tokenB:any
  noLiquidity:boolean
  Btnstatus: ReactNode | undefined
} {
  const dispatch = useAppDispatch();
  const { currencykeyA, currencykeyB } = useParams();

  const tokenA = gettokenBykey(currencykeyA!);
  const tokenB = gettokenBykey(currencykeyB!);
  const [isactive, pair] = usePair(tokenA, tokenB);
  const Wpair = new WrapStatePair(pair);
  const noLiquidity = Wpair.isnewpool;
  const { independentField, typedValue, otherTypedValue } = useMintState();
  const dependentField = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;
  
  const parsedAmounts= useMemo(() => {
     const  price =( isactive!='active'||typeof Wpair.Reserves == "undefined")?'0':independentField === Field.INPUT ? Wpair.getpriceA():Wpair.getpriceB();
      return `${+price*+typedValue}`
  }, [independentField,typedValue,pair])
  const formattedAmounts: any = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts ?? "",
  };


  let Btnstatus: ReactNode | undefined

  if (isactive !="active") {
    Btnstatus = Btnstatus ?? <BtnError>load pair</BtnError>
  }

  if (!formattedAmounts[Field.INPUT] || !formattedAmounts[Field.OUTPUT]) {
    Btnstatus = Btnstatus ?? <BtnError>Enter an amount</BtnError>
  }

  // const { [Field.CURRENCY_A]: currencyAAmount, [Field.CURRENCY_B]: currencyBAmount } = parsedAmounts

  // if (currencyAAmount && currencyBalances?.[Field.CURRENCY_A]?.lessThan(currencyAAmount)) {
  //   error = <BtnError>Insufficient {currencies[Field.CURRENCY_A]?.symbol} balance</BtnError>
  // }

  // if (currencyBAmount && currencyBalances?.[Field.CURRENCY_B]?.lessThan(currencyBAmount)) {
  //   error = <BtnError>Insufficient {currencies[Field.CURRENCY_B]?.symbol} balance</BtnError>
  // }
  // BtnError
  // BtnSuccess
  // BtnLogin


  return { formattedAmounts, pair, isactive, tokenA, tokenB, noLiquidity ,Btnstatus};
}
