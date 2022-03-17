import { createAction } from '@reduxjs/toolkit'

export enum Field {
  LIQUIDITY_PERCENT = 'LIQUIDITY_PERCENT',
  LIQUIDITY = 'LIQUIDITY',
  CURRENCY_A = 'INPUT',
  CURRENCY_B = 'OUTPUT',
}

export const typeInput = createAction<{ field: Field; typedValue: string }>('burn/typeInputBurn')
export const reset = createAction('burn/reset')

