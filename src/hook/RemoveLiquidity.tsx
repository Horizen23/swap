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
import { RomoveLiquidityAsync, SwapTrade } from "../features/transaction/reducer";
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
import { useMintActionHandlers, useMintState } from "../features/mint/hooks";
import { BtnError, BtnSuccess } from "./swap";
import { useBurnActionHandlers, useBurnState } from "../features/burn/hooks";
import { Field } from "../features/burn/actions";
import { useBalanceHandlers } from "../features/balance/hooks";
import { usetransactionstatus, useUpdateActiveStatus } from "../features/transaction/hooks";



export function useremoveLiquidityHandlers(): {
  onRomoveLiquidityAsync: (obj:{wpair:any,typedValue:any}) => void
} {
  const dispatch = useAppDispatch()
    const onRomoveLiquidityAsync = useCallback(
      (obj) => {
         dispatch(RomoveLiquidityAsync(obj)) 
       },[dispatch]
    )

    return {onRomoveLiquidityAsync}
}

export function useDerivedremoveLiquidity( currencykeyA:string| undefined, currencykeyB:string| undefined):any 
{

  const [appove , setappove] = useState<any>(null)

  const tokenA = gettokenBykey(currencykeyA!);
  const tokenB = gettokenBykey(currencykeyB!);
  const [isactive, pair,setpair] = usePair(tokenA, tokenB);
  const {onUserInput:inputchange,onResetInput} = useBurnActionHandlers()
  const { onUpdateBalanceSwap } = useBalanceHandlers()
  useUpdateActiveStatus(usetransactionstatus(),()=>{
    onResetInput()
    onUpdateBalanceSwap('ETH')
  })
  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      return inputchange(field, typedValue)
    },
    [inputchange]
  )

  const {typedValue} = useBurnState()
  return {pair:isactive=="active"?pair:undefined ,typedValue,onUserInput};
}
