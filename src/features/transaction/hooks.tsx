import JSBI from 'jsbi'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../hook'
import { RootState, AppThunk, store } from '../../store';
import { tokenbalanceAsync, useloadWallet } from '../balance/balanceSlice';


export function usetransactionState(): RootState['transaction'] {
  return useAppSelector((state) => state.transaction)
}

export function usetransactionstatus(): RootState['transaction']['status'] {
  return useAppSelector((state) => state.transaction.status)
}

export   function useUpdateActiveStatus(txstautau:any,fn:()=>void){
  const [st,sst] = useState(false)
  useEffect(()=>{
    if(txstautau=='loading'){
      sst(true)
    }
    if(st){
      fn()
      sst(false)
    }
    },[txstautau])
}
export function usetransaction(){
  const transaction = useSelector((state:any)=>state.transaction)
  const dispatch = useAppDispatch();
  const loadWalletHook = useloadWallet(dispatch)
  useEffect(()=>{
    if(transaction.swap.status=='active'){
      dispatch(tokenbalanceAsync())
      loadWalletHook(store.getState().balance.currency)
    }
  },[transaction.swap.status])
  return transaction
}