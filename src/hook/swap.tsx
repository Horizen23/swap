import { isAddress } from "@ethersproject/address";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux";
import { addtokendb, selectcurrency, selecttoken, selectTokendb, tokenbalanceAsync, useloadWallet } from "../features/balance/balanceSlice";
import { selectSwap, switchswap ,Field,Tokenseslect, typeInput, addpercent} from "../features/swap/reducer"
import { useAppDispatch, useAppSelector } from "."
import { RootState, AppThunk, store } from '../store';
import { parseUnits } from '@ethersproject/units'
import JSBI from 'jsbi'
import { Erc20Approve, RoutingActive, RoutingAPITrade, Routingloading } from "../features/swap/router";
import { createSelector } from "@reduxjs/toolkit";
import _ from "underscore";
import { BigNumber as BN } from "ethers";
import { SwapTrade } from "../features/transaction/reducer";
import styled from "styled-components";
import { usetransactionstatus, useUpdateActiveStatus } from "../features/transaction/hooks";
import { useBalanceHandlers } from "../features/balance/hooks";
import { WrapETH } from "../config";
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
export function useTokenActive(Field:Field,action:string=''):any{
     return useAppSelector((state:RootState) =>{
        return gettoken(state,Field,action)
     })
}

export function gettoken(state:RootState,Field:Field,action:string=''):any{
  const currency = state.balance.currency
  const Token  = state.balance.token
  const Tokendb = state.balance.tokendb
  let tn ;
   tn = state.swap[Field]
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
    onUserSwap:(features:string)=>void,
    onAppove:()=>void,
  } {
    const dispatch = useAppDispatch()
    const {decimals,balance,address} = useTokenActive(Field.INPUT);

    const onUserSwap = useCallback(
      (features:any) => {
       const state = store.getState()
       const {router,swap } =state;
       const isdw = features!='deposit'&&features!="withdraw";
       if(router.status=='active'){
         const exactIn = swap.independentField === Field.INPUT
         const {INPUT,OUTPUT }  =swap ;

          const mint=BN.from('0x'+((!exactIn)?+router.router.amount:+router.router.quote).toString(16));
          const TokenINPUT = gettoken(state,Field.INPUT)
          const TokenOUTPUT = gettoken(state,Field.OUTPUT)
          const amountin= BN.from('0x'+(exactIn?+(router.router.amount):+router.router.quote).toString(16)).toString();
          const minamoutout=mint.sub(mint.div('100').mul('10')).toString()
        let datatx;
        if(isdw){
          datatx = {
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
        }else {
          datatx = {
            amountin:mint.toString(),
            minamoutout,
            features,
          }
        }
         dispatch(SwapTrade(datatx))
         onUserInput(Field.INPUT,'')
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
          const dd = BN.from(balance)
          var discount = (dd.mul(percent).div(100)).toString();
          if(percent==100){
            let  typedValue: string = `${(+discount)*10**(-decimals)}`;
            dispatch(addpercent( {percent} ))
            dispatch(typeInput({ field:Field.INPUT, typedValue }))
          }else{
            let  typedValue: string = `${(+discount)*10**(-decimals)}`;
            dispatch(addpercent( {percent} ))
            dispatch(typeInput({ field:Field.INPUT, typedValue }))
          }
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
    features:any
  } {
    const dispatch = useAppDispatch()
    const {onUserSwap,onAppove} = useSwapActionHandlers()  
    const { onUpdateBalanceSwap } = useBalanceHandlers()
    useUpdateActiveStatus(usetransactionstatus(),()=>onUpdateBalanceSwap('ETH'))
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

    let ButtonSwap: ReactNode | undefined
    if (!inputCurrency.key || !outputCurrency.key) {
      ButtonSwap = ButtonSwap ?? <BtnError>Select a token</BtnError>
    }
    if (!typedValue) {
      ButtonSwap = ButtonSwap ?? <BtnError>Enter an amount</BtnError>
      // console.log(balancecurrencies[Field.INPUT].balance,Valued)
    }
    if(balancecurrencies[independentField]){
      var Valued = 10**balancecurrencies[independentField].decimals  *  (+typedValue as number));
      if (balancecurrencies[Field.INPUT].balance<Valued) {
        ButtonSwap = <BtnError>Insufficient {balancecurrencies[Field.INPUT].symbol} balance</BtnError>
      }
    }
    const router =  useRouterState()
    const addressWeth = WrapETH;
    const features =  balancecurrencies[Field.INPUT].type=='native'?(balancecurrencies[Field.OUTPUT].address==addressWeth?'deposit':'ETHForToken'):(balancecurrencies[Field.OUTPUT].type=='native'?(balancecurrencies[Field.INPUT].address==addressWeth?'withdraw':'TokenForEth'):'TokenForToken')

    const onUserRoutingAPITrade = useCallback(() => {
      if(!!(balancecurrencies[Field.INPUT]&&balancecurrencies[Field.OUTPUT])){
        dispatch(RoutingAPITrade(features))
      }  else{
        dispatch(RoutingActive())
      }
    },
    [inputCurrency,outputCurrency])


    useEffect(()=>{
      let timer1 = setTimeout(() => {
           onUserRoutingAPITrade()
      }, 300 );
      return () => {
        clearTimeout(timer1);
      };
    },[inputCurrency,outputCurrency,independentField,typedValue])


      const {status,message,router:{allowance,part},status_appover} =useRouterState();
      if((features!='deposit'&&features!="withdraw")&&!!(balancecurrencies[Field.INPUT]&&balancecurrencies[Field.OUTPUT])){
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
      }
      ButtonSwap = ButtonSwap ?? <BtnSuccess onClick={()=>{onUserSwap(features)}}>swap</BtnSuccess>;

      if(!iglogin){
        ButtonSwap = <BtnLogin onClick={()=>{window.location.replace("/app/view/usersetting/wallet");}}>To Login</BtnLogin>;
      }
      // /app/view/usersetting/wallet
      
    return {
      ButtonSwap,
      router,
      onUserRoutingAPITrade,
      features
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
export const BtnError = styled(BtnSwap)`
cursor: no-drop;
color: rgb(145 140 140);
background-color: #afb5cc3d;
`
export const BtnSuccess = styled(BtnSwap)`
cursor: no-drop;
color: rgb(145 140 140);
background-color: rgb(187 246 218);
`
export const BtnLogin = styled(BtnSwap)`
    color: rgb(255 255 255);
    background-color: rgb(255 188 90);
`
