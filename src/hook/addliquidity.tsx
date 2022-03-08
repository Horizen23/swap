import { isAddress } from "@ethersproject/address";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux";
import { addtokendb, selectcurrency, selecttoken, selectTokendb, tokenbalanceAsync, useloadWallet } from "../features/balance/balanceSlice";
import { select ,Field,Tokenseslect, typeInput, addpercent} from "../features/pool/addliquidity"
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
          dispatch(
              select({
              field,
              token:{
                  type:currency.type,
                  key :(currency.type=='native'?currency.symbol:currency.address)
              },
            })
          )
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

