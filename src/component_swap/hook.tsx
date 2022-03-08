import { isAddress } from "@ethersproject/address";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux";
import { addtokendb, selectcurrency, selecttoken, selectTokendb, tokenbalanceAsync, useloadWallet } from "../features/balance/balanceSlice";
import { selectSwap, switchswap ,Field,Tokenseslect, typeInput, addpercent} from "../features/swap/reducer"
import { useAppDispatch, useAppSelector } from "../hook"
import { RootState, AppThunk, store } from '../store';
import { parseUnits } from '@ethersproject/units'
import JSBI from 'jsbi'
import { Erc20Approve, RoutingAPITrade, Routingloading } from "../features/swap/router";
import { createSelector } from "@reduxjs/toolkit";
import _ from "underscore";
import { BigNumber as BN } from "ethers";
import { SwapTrade } from "../features/transaction/reducer";
import styled from "styled-components";
window.Bn=BN;
export function useSwapState(): RootState['swap'] {
    return useAppSelector((state:RootState) => state.swap, _.isEqual)
}
export function useIsLogin(wallet:string): boolean {
  return useAppSelector((state:RootState) => !!state.balance.currency[wallet].address, _.isEqual)
}

export function useGraph(){
  return  useSelector((state:RootState) => {
    return {OUTPUT:gettoken(state,Field.OUTPUT),INPUT:gettoken(state,Field.INPUT)} 
  }, _.isEqual);
}
export function useRouterpartPrice(): string|false {
  return useAppSelector((state:RootState) => {
      const {amount,part:[tokenA,tokenB],quote} = state.router.router
      const TokenINPUT = gettoken(state,Field.INPUT)
      const TokenOUTPUT = gettoken(state,Field.OUTPUT)
      const amounti:any = state.swap.independentField == Field.INPUT?amount:quote
      const amounto:any = state.swap.independentField == Field.OUTPUT?amount:quote
      const amountin = amounti*(10**-TokenINPUT.decimals);
      const amountout =amounto*(10**-TokenOUTPUT.decimals);
      const price = amountout/amountin;
      if(!price){
        return false
      }
      return `1 ${TokenINPUT.symbol} = ${price.toFixed(4)} ${TokenOUTPUT.symbol}`
  }, _.isEqual)
}
export function useRouterState(): RootState['router'] {
  return useAppSelector((state:RootState) => {return state.router}, _.isEqual)
}
export function useTokenActive(Field:Field):any{
     return useAppSelector((state:RootState) =>{
        return gettoken(state,Field)
     })
}
export function gettoken(state:RootState,Field:Field):any{
  const currency = state.balance.currency
  const Token  = state.balance.token
  const Tokendb = state.balance.tokendb
  const tn = state.swap[Field]
  if(tn.type=='native'){
      return currency[tn.key as string];
    }else if(tn.type=='tokendb'){
      return Tokendb[tn.key as string];
    }else if(tn.type=='token'){
      return Token[tn.key as string];
    }else return false;
}
export function useSwapActionHandlers(): {
    onCurrencySelection: (field: Field, currency: any) => void
    onSwitchTokens: () => void
    onUserInput: (field: Field, typedValue: string) => void
    onUserInputpercent:(percent:25 | 50 | 75 | 100) => void
    onUserSwap:()=>void,
    onAppove:()=>void,
  } {
    const dispatch = useAppDispatch()
    const {decimals,balance,address} = useTokenActive(Field.INPUT);

    const onUserSwap = useCallback(
      () => {
       const state = store.getState()
       const {router,swap } =state;
       if(router.status=='active'){
         const exactIn = swap.independentField === Field.INPUT
         const {INPUT,OUTPUT }  =swap ;
          const features =  INPUT.type=='native'?'ETHForToken':(OUTPUT.type=='native'?'TokenForEth':'TokenForToken')
          const mint=BN.from(`${(!exactIn)?router.router.amount:router.router.quote}`);
          const TokenINPUT = gettoken(state,Field.INPUT)
          const TokenOUTPUT = gettoken(state,Field.OUTPUT)
          const amountin= exactIn?router.router.amount:router.router.quote;
          const minamoutout=mint.sub(mint.div('100').mul('10')).toString()
         const datatx = {
           amountin,
           minamoutout,
            router:router.router.routers,
            features,
            transaction:{
              tokenA:{
                address:TokenINPUT.address,
                decimals:TokenINPUT.decimals,
                logoURI:TokenINPUT.logoURI,
                symbol:TokenINPUT.symbol,
                amount:(+amountin)*1e-18
              },
              tokenB:{
                address:TokenOUTPUT.address,
                decimals:TokenOUTPUT.decimals,
                logoURI:TokenOUTPUT.logoURI,
                symbol:TokenOUTPUT.symbol,
                amount:+minamoutout*1e-18
              } 
            }
          
         }
         onUserInput(Field.INPUT,'')
         dispatch(SwapTrade(datatx))
       }
      },
      [dispatch]
    )
    const onCurrencySelection = useCallback(
      (field: Field, currency: any) => {
        dispatch(
            selectSwap({
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
    const onUserInputpercent = useCallback(
        (percent:25 | 50 | 75 | 100) => {
          var discount = (Math.pow(10, -decimals)  *  (percent*(balance as number))/100).toFixed(8);
          let  typedValue: string = `${discount}`;
          dispatch(addpercent( {percent} ))
          dispatch(typeInput({ field:Field.INPUT, typedValue }))
        },
        [balance]
    )
    const onSwitchTokens = useCallback(() => {
      dispatch(switchswap())
    }, [dispatch])
    const onAppove = useCallback(()=>{
      dispatch(Erc20Approve())
    },[dispatch])
    return {
      onSwitchTokens,
      onCurrencySelection,
      onUserInput,
      onUserInputpercent,
      onUserSwap,
      onAppove
    }
  }

export function useDerivedSwapInfo(): {
    ButtonSwap?: ReactNode
    router:RootState['router']
    onUserRoutingAPITrade: () => void
  } {
    const dispatch = useAppDispatch()
    const {onUserSwap,onAppove} = useSwapActionHandlers()  

    const {
      independentField,
      typedValue,
      [Field.INPUT]:inputCurrency ,
      [Field.OUTPUT]: outputCurrency ,
      recipient,
    } = useSwapState()
    const iglogin = useIsLogin('ETH')
    const currencies = {
      independentField,
      typedValue,
      [Field.INPUT]:inputCurrency ,
      [Field.OUTPUT]: outputCurrency ,
      recipient,
    }
    const balancecurrencies = {
        [Field.INPUT]:useTokenActive(Field.INPUT),
        [Field.OUTPUT]:useTokenActive(Field.OUTPUT),
    }
    var Valued = (Math.pow(10, balancecurrencies[independentField].decimals)  *  (+typedValue as number));

    let ButtonSwap: ReactNode | undefined
    if (!inputCurrency.key || !outputCurrency.key) {
      ButtonSwap = ButtonSwap ?? <BtnError>Select a token</BtnError>
    }
    if (!typedValue) {
      ButtonSwap = ButtonSwap ?? <BtnError>Enter an amount</BtnError>
    }
    if (balancecurrencies[Field.INPUT].balance<=Valued) {
      ButtonSwap = <BtnError>Insufficient {balancecurrencies[Field.INPUT].symbol} balance</BtnError>
    }
   const router =  useRouterState()
   const onUserRoutingAPITrade = useCallback(
    () => {
       dispatch(RoutingAPITrade())
    },
    [inputCurrency,
      outputCurrency]
    )
      useEffect(()=>{
        dispatch(Routingloading())
     
        let timer1 = setTimeout(() =>  dispatch(RoutingAPITrade()), 0.5 * 1000);
        return () => {
          dispatch(Routingloading())
          clearTimeout(timer1);
        };
      },[typedValue])
      useEffect(()=>{
        dispatch(Routingloading())
        let timer1 = setTimeout(() => dispatch(RoutingAPITrade()), 0.2 * 1000);
        return () => {
          dispatch(Routingloading())
          clearTimeout(timer1);
        };
      },[inputCurrency,outputCurrency,independentField])
      const {status,message,router:{allowance,part},status_appover} =useRouterState();
      if(status!=='active'){
        if(message){
          ButtonSwap = ButtonSwap ?? <BtnError>{message}</BtnError>
        }else{
          ButtonSwap = ButtonSwap ?? <BtnError>loadding</BtnError>
        }
      }else{
        if((+allowance as number) < 999999999999999999){
          if(status_appover=='loading'){
            ButtonSwap = ButtonSwap ?? <BtnError>appove lodding</BtnError>;
          }else{
            ButtonSwap = ButtonSwap ?? <BtnSuccess onClick={()=>{onAppove()}}>appove token {part[0]}</BtnSuccess>;
          }
        }
      }
      ButtonSwap = ButtonSwap ?? <BtnSuccess onClick={()=>{onUserSwap()}}>swap</BtnSuccess>;

      if(!iglogin){
        ButtonSwap = <BtnLogin onClick={()=>{window.location.replace("/app/view/usersetting/wallet");}}>To Login</BtnLogin>;
      }
      // /app/view/usersetting/wallet
      
    return {
      ButtonSwap,
      router,
      onUserRoutingAPITrade
    }
}
export  function useListToken() {
    const dispatch = useAppDispatch();
    const {ETH:currency} = useSelector(selectcurrency)
    const token = useSelector(selecttoken)
    const tokendb = useSelector(selectTokendb)
    const [state, setState] = useState({ value: {ETH:currency,...tokendb,...token}, error: null, isPending: false })
    let [inputaddress, setinputaddress] = useState('')
    useEffect(():any=>{
        var reg = new RegExp(`\\b(${inputaddress})`,'i');
        let obj:any ={};
        let lengthobj:number = 0;
        const data =     Object.entries({ETH:currency,...tokendb,...token}).filter(([key, value]:any)=>{
             const  dep =  value.symbol.match(reg)||value.name.match(reg)||value.address.match(reg)
             if(dep){
                lengthobj++
                obj[key]=value
             }
        })
        if(lengthobj==0&&isAddress(inputaddress)){
            setState({...state,isPending: true })
            MHGWallet.api.erc20((currency.address as string),[inputaddress]).then((token)=>{
                if(token){
                    token[0].status = 'active'
                    token[0].type  = 'tokendb'
                    token[0].logoURI  = "https://gemini.com/images/currencies/icons/default/1inch.svg",
                    obj[token[0].address]=token[0];
                    dispatch(addtokendb(token[0]))
                    setState({ value: obj, error: null, isPending: false })
                }
            })
        }else if (lengthobj>0){
            setState({ value: obj, error: null, isPending: false })
        }else{
            setState({ value: {}, error: null, isPending: false })
        }
    }, [inputaddress,
        currency,
        token,
        tokendb])
    const { value, error, isPending } = state
    return [value, error, isPending,inputaddress, setinputaddress]
}

export function useSwap(){
  const transactionswap = useSelector((state:any)=>state.transaction.swap)
  const dispatch = useAppDispatch();
  const loadWalletHook = useloadWallet(dispatch)
  useEffect(()=>{
    if(transactionswap.status=='active'){
      dispatch(tokenbalanceAsync())
      loadWalletHook(store.getState().balance.currency)
    }
  },[transactionswap.status])
  return transactionswap
}
const BtnSwap = styled.button`
    font-size: 16px;
    font-weight: 500;
    padding: 16px;
    width: 100%;
    font-weight: 500;
    text-align: center;
    border-radius: 20px;
    outline: none;
    border: 1px solid transparent;
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
const BtnError = styled(BtnSwap)`
cursor: no-drop;
color: rgb(145 140 140);
background-color: #afb5cc3d;
`
const BtnSuccess = styled(BtnSwap)`
cursor: no-drop;
color: rgb(145 140 140);
background-color: rgb(187 246 218);
`
const BtnLogin = styled(BtnSwap)`
    color: rgb(255 255 255);
    background-color: rgb(255 188 90);
`
