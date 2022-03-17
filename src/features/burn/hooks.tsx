import JSBI from 'jsbi'
import { ReactNode, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../hook'
import { RootState } from '../../store'
import { Field, reset, typeInput } from './actions'
import { BrowserRouter,Route ,Routes, NavLink,useNavigate } from "react-router-dom";
import { useParams } from 'react-router'
import { AddLiquidity } from '../transaction/reducer'


export function useBurnState():RootState['burn'] {
  return useAppSelector((state) => state.burn)
}
  
export function useBurnActionHandlers(): {
  onUserInput: (field: Field, typedValue: string) => void
  onResetInput: () => void

  
  onCurrencySelection: (field: Field, currency: any) => void
  onAddLiquidity:(data:any)=>void
} {
  const dispatch = useAppDispatch()
  const history =   useNavigate()
  const adas =useParams();
  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
    },
    [dispatch]
  )
  const onCurrencySelection = useCallback(
    (field: Field, currency: any) => {
              const key = (currency.type=='native'?currency.symbol:currency.address)
              console.log(adas)
              // history(`/app/view/liquidity/add/0x30a13C9941e9E6316C6494A47dcC528BAbbc5773/${key}`, { replace: true })
    },
    [history]
  )
  const onAddLiquidity = useCallback(
    (data:any) => {
      dispatch(AddLiquidity(data))
              // history(`/app/view/liquidity/add/0x30a13C9941e9E6316C6494A47dcC528BAbbc5773/${key}`, { replace: true })
    },
    [history]
  )
  const onResetInput = useCallback(
      () => {
        dispatch(reset())
      },
      [history]
    )

  return {
    onCurrencySelection,
    onResetInput,
    onUserInput,
    onAddLiquidity
  }
}
