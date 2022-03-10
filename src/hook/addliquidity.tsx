import { isAddress } from "@ethersproject/address";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux";
import { addtokendb, selectcurrency, selecttoken, selectTokendb, tokenbalanceAsync, useloadWallet } from "../features/balance/balanceSlice";
import { select ,Field,Tokenseslect, typeInput, addpercent, GetpairSig} from "../features/pool/addliquidity"
import { useAppDispatch, useAppSelector } from "."
import { RootState, AppThunk, store } from '../store';
import { parseUnits } from '@ethersproject/units'
import JSBI from 'jsbi'
import { Erc20Approve, RoutingAPITrade, Routingloading } from "../features/swap/router";
import { createSelector } from "@reduxjs/toolkit";
import _ from "underscore";
import { BigNumber as BN } from "ethers";
import { SwapTrade } from "../features/transaction/reducer";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router";
import { getselectInfo, gettokenBykey } from "./token";
import { computePairAddress, creatPaiaOffchain, usepair } from "./pool";
import pair, { Getpair } from "../features/pool/pair";
import { BtnError } from "./swap";

export function useIsLogin(wallet:string): boolean {
  return useAppSelector((state:RootState) => !!state.balance.currency[wallet].address, _.isEqual)
}

export function useTokenActive(Field:Field):any{
     return useAppSelector((state:RootState) =>{
        return gettoken(state,Field)
     })
}
export function useAddliquidity():RootState['addliquidity']{
  return useAppSelector((state:RootState) =>{
     return state.addliquidity
  })
}
export function gettoken(state:RootState,Field:Field):any{
  const currency = state.balance.currency
  const Token  = state.balance.token
  const Tokendb = state.balance.tokendb
  let tn  = state.addliquidity[Field]
  if(tn.type=='native'){
      return currency[tn.key as string];
    }else if(tn.type=='tokendb'){
      return Tokendb[tn.key as string];
    }else if(tn.type=='token'){
      return Token[tn.key as string];
    }else return false;
}

export function useAddliquidityHandlers(): {
    onUserInput: (field: Field, typedValue: string) => void,
    onCurrencySelection: (field: Field, currency: any) => void
  } {
    const dispatch = useAppDispatch()
    const onCurrencySelection = useCallback(
        (field: Field, currency: any) => {
          if(!currency.key){
            dispatch(
                select({
                field,
                token:{
                    type:currency.type,
                    key :(currency.type=='native'?currency.symbol:currency.address)
                },
              })
            )
          }else{
            dispatch(
              select({
              field,
              token:currency,
            })
          )
          }
        },
        [dispatch]
    )
    const onUserInput = useCallback(
        (field: Field, typedValue: string) => {
          dispatch(addpercent( {percent:null} ))
          dispatch(typeInput({ field, typedValue }))
        },
        [dispatch]
      )
    return {
        onUserInput,
        onCurrencySelection
    }
  }

export function useDerivedaddliquidity():any {
  const dispatch = useAppDispatch()
  const {pair,INPUT,OUTPUT} = useAddliquidity();
  const { currencykeyA,currencykeyB } = useParams();
  const {onCurrencySelection} = useAddliquidityHandlers()
  const history = useNavigate();
  const pairs =  usepair()
  const tokenA = gettokenBykey(INPUT.key!)
  const tokenB = gettokenBykey(OUTPUT.key!)
  let ButtonAppove: ReactNode | undefined
  useEffect(()=>{
    onCurrencySelection(Field.INPUT,getselectInfo(currencykeyA!) )
    onCurrencySelection(Field.OUTPUT,getselectInfo(currencykeyB!))
  },[])
  useEffect(()=>{
    if(OUTPUT.key&&INPUT.key){
      history(`/app/view/liquidity/add/${INPUT.key}/${OUTPUT.key}`, { replace: true })
      if(tokenA&&tokenB){
        const pr = creatPaiaOffchain(tokenA,tokenB)
        // if(!pairs.list[pr.address] ){
           dispatch(GetpairSig(pr))
        // }else{
          // pairs.list[pr.address]
        // }
      }
  }
  },[OUTPUT.key,INPUT.key])


  if (true) {
    ButtonAppove = ButtonAppove ?? <BtnError>Select a token</BtnError>
  }
// console.log(stateAddliquidity)
return {pair,ButtonAppove,tokenA,tokenB}

}