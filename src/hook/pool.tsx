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
import { Getpair } from "../features/pool/pair";
import { usetransactionstatus } from "../features/transaction/hooks";
import { useMintActionHandlers } from "../features/mint/hooks";
import { factoryAddress, INIT_CODE_HASH } from "../config";

const BASES_TO_TRACK_LIQUIDITY:string[] = [
    'ETH'
]

export function useTrackedTokenPairs(): any {
    const tokens = useAllTokens()
    const dispatch = useAppDispatch()
    const generatedPairs = useMemo(
    () => {
        const generated =  Object.keys(tokens).flatMap((tokenKey) => {
            return  ([...BASES_TO_TRACK_LIQUIDITY] ?? [])
            .map((address) => {
                if (address === tokenKey||!isAddress(tokenKey)) {
                return null
                } else {
                //   return [tokens[address], tokens[tokenKey]]
                    return  creatPaiaOffchain(tokens[address], tokens[tokenKey])
                }
            })
            .filter((p): p is any => p !== null)
        })
        const listpair:any =  JSON.parse(localStorage.getItem("listpair") as string)||{};
        for (const property in listpair) {
            const {address0,address1} = listpair[property];
            console.log(address0)
                if(tokens[address0]&&tokens[address1]){
                    generated.push(creatPaiaOffchain(tokens[address0], tokens[address1]))
                }
        }
        return generated;
},[tokens])
   
      
    
    useEffect(()=>{
        dispatch(Getpair(generatedPairs))
    },[])
}
export function usePair(TokenA:any,TokenB:any):any{
    const [status ,setstatus] = useState<'idend'|'loading'|'active'>('idend');
    const [pair,setpair] = useState({})
    const {onresetMint} = useMintActionHandlers(undefined)
    const txstatus = usetransactionstatus()
    useEffect(()=>{
        if(TokenA.address&&TokenB.address){
            const pr =  creatPaiaOffchain(TokenA,TokenB)
            if(pr){
                setstatus('loading')
                MHGWallet.api.allowancePari({
                    pair:pr.address,
                    token:getaddresstokenpair(pr)
                }).then(vue=>{
                    setpair({...pr,...vue})
                    setstatus('active')
                })
            }
        }
    },[TokenA.address,TokenB.address])
    useEffect(()=>{
        if((TokenA.address&&TokenB.address)&&txstatus=='active'){
            const pr =  creatPaiaOffchain(TokenA,TokenB)
            if(pr){
                console.log('update')
                
                MHGWallet.api.allowancePari({
                    pair:pr.address,
                    token:getaddresstokenpair(pr)
                }).then(vue=>{
                    setpair({...pr,...vue})
                    onresetMint()
                })
            }
        }
    },[txstatus])
    return [status,pair,setpair]
}
export function creatPaiaOffchain(tokenA:TToken,tokenB:TToken){

    const pair = computePairAddress(tokenA, tokenB)
    return  {
        ...pair,
        decimals:18,
        symbol:'UNI-V2',
        name:'Uniswap V2'
    }
}
export function usepair():RootState['pair']  {
    return useAppSelector((state:RootState) => state.pair)
}

function getaddresstokenpair(pair:any){
    const token0 = pair.token0.type == 'native'?pair.token0.WraptoToken:pair.token0.address;
    const token1 = pair.token1.type == 'native'?pair.token1.WraptoToken:pair.token1.address;
    return {token0,token1}
}

export function computePairAddress(tokenA:any,tokenB:any) {
    let  addressA,addressB;
    addressA = tokenA.address;
    addressB = tokenB.address;
    if(tokenA.type == 'native'){
       addressA = tokenA.WraptoToken;
    }
    if(tokenB.type == 'native'){
        addressB = tokenB.WraptoToken;
    }
    var _ref2 = +addressA<+addressB ? [tokenA, tokenB] : [tokenB, tokenA],
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