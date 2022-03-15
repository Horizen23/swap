import { isAddress } from "@ethersproject/address";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux";
import { addtokendb, selectcurrency, selecttoken, selectTokendb, tokenbalanceAsync, useloadWallet } from "../features/balance/balanceSlice";
import { selectSwap, switchswap ,Field,Tokenseslect, typeInput, addpercent} from "../features/swap/reducer"
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

export function useAllTokens():ListToken{
  return useAppSelector((state:RootState) => {
    return {...state.balance.tokendb,...state.balance.token,...state.balance.currency} as ListToken
  })
}

export function getselectInfo(key:string):any{
    const state = store.getState()
    const ob:ListToken ={...state.balance.tokendb,...state.balance.token,...state.balance.currency} as ListToken;
    if(!ob[key])return false;
    if(ob[key].type=='native'){
      return {type:ob[key].type,symbol:ob[key].symbol,address:''}
    }else{
      return {type:ob[key].type,symbol:ob[key].symbol,address:ob[key].address}
    }
}
export function gettokenBykey(key:string):TToken|false{
  return useAppSelector((state:RootState) => {
  const ob:ListToken ={...state.balance.tokendb,...state.balance.token,...state.balance.currency} as ListToken;
  if(!ob[key])return false;
  return ob[key];
  })
}