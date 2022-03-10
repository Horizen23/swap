import JSBI from 'jsbi'
import { ReactNode, useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../../hook'
import { Field, typeInput } from './actions'
import { RootState, AppThunk, store } from '../../store';


export function useMintState(): RootState['mint'] {
  return useAppSelector((state) => state.mint)
}

export function useMintActionHandlers(noLiquidity: boolean | undefined): {
  onFieldAInput: (typedValue: string) => void
  onFieldBInput: (typedValue: string) => void
} {
  const dispatch = useAppDispatch()

  const onFieldAInput = useCallback(
    (typedValue: string) => {
      dispatch(typeInput({ field: Field.INPUT, typedValue, noLiquidity: noLiquidity === true }))
    },
    [dispatch, noLiquidity]
  )

  const onFieldBInput = useCallback(
    (typedValue: string) => {
      dispatch(typeInput({ field: Field.OUTPUT, typedValue, noLiquidity: noLiquidity === true }))
    },
    [dispatch, noLiquidity]
  )
  return {
    onFieldAInput,
    onFieldBInput,
  }
}

