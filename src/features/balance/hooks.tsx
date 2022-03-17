import { ReactNode, useCallback, useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../../hook'
import { RootState, AppThunk, store } from '../../store';
import { tokenbalanceAsync, useloadWallet, useUpdateCurrency } from '../balance/balanceSlice';





export function useBalanceHandlers(): {
  onUpdateBalanceSwap: (key: argtype) => void
} {
  const dispatch = useAppDispatch()

  const onUpdateBalanceSwap  = useCallback(
    (key:argtype) => {
      dispatch(useUpdateCurrency(key))
      if(key=='ETH'){

        dispatch(tokenbalanceAsync())
      }
    },
    [dispatch]
  )
  return {
    onUpdateBalanceSwap
  }
}