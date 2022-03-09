import { isAddress ,getCreate2Address} from "@ethersproject/address";

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
import { useAllTokens } from "./token";
import { keccak256, solidityKeccak256, solidityPack } from "ethers/lib/utils";

const BASES_TO_TRACK_LIQUIDITY:string[] = [
    'ETH'
]

export function useTrackedTokenPairs(): any {
    const tokens = useAllTokens()
    const generatedPairs = useMemo(
    () => Object.keys(tokens).flatMap((tokenKey) => {
        return  ([...BASES_TO_TRACK_LIQUIDITY] ?? [])
        .map((address) => {
            if (address === tokenKey||!isAddress(tokenKey)) {
              return null
            } else {
            //   return [tokens[address], tokens[tokenKey]]
                    
                const pair = computePairAddress(tokens[address], tokens[tokenKey])
                return  {
                    ...pair,
                    decimals:18,
                    symbol:'UNI-V2',
                    name:'Uniswap V2'
                }
            }
        })
        .filter((p): p is any => p !== null)
    }),[tokens])
    console.log(generatedPairs)
}

  
function computePairAddress(tokenA:any,tokenB:any) {
    var factoryAddress = '0x9cb01917bE987d1DC3d0c70E2AFecC1B4648A268';
    var INIT_CODE_HASH = '0x7e49d5a452686e20f3694c8b7da9ce371fddadafe40ae661631501370842bf9b';
    let  addressA,addressB;
    addressA = tokenA.address;
    addressB = tokenB.address;
    if(tokenA.type == 'native'){
       addressA = tokenA.WraptoToken;
    }else{
        addressB = tokenB.WraptoToken;
    }
    var _ref2 = addressA<addressB ? [tokenA, tokenB] : [tokenB, tokenA],

    token0 = _ref2[0],
    token1 = _ref2[1], // does safety checks\
    sortadress = [token0.type == 'native'?token0.WraptoToken:token0.address, token1.type == 'native'?token1.WraptoToken:token1.address],
    address = getCreate2Address(
            factoryAddress,
            solidityKeccak256(['bytes'],[solidityPack(['address', 'address'],sortadress)]),
            INIT_CODE_HASH
        )
    return {
        token0,
        token1,
        address
    }
  };