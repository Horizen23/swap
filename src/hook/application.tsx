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
import { activeTokenlist } from "../features/page/pageSlice";

export function usepopupTokenlist(): any {
  return useAppSelector((state:RootState) => state.action.activetokenlist)

}


export function useApplicationHandlers():{
    onUserChangpopup: (isopen: boolean,action?:string) => void,
}{
    const dispatch = useAppDispatch()

    const onUserChangpopup =  useCallback((isopen,action='')=>{
        console.log(isopen)
        dispatch(activeTokenlist({
            action:action,
            status:isopen
        }))
    },[dispatch])

    return {
        onUserChangpopup
    }
}


