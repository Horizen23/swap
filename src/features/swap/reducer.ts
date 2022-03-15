import { createAction, createAsyncThunk, createReducer } from '@reduxjs/toolkit'

export enum Field {
    INPUT = 'INPUT',
    OUTPUT = 'OUTPUT',
  }
export enum TradeState {
    LOADING,
    INVALID,
    NO_ROUTE_FOUND,
    VALID,
    SYNCING,
}
export type Tokenseslect = {
    type:'native'|'token'|'tokendb'|null,
    key:string|null
}
export interface SwapState {
  readonly typedValue: string,
  readonly independentField: Field
  readonly [Field.INPUT]: Tokenseslect;
  readonly [Field.OUTPUT]: Tokenseslect;
  // the typed recipient address or ENS name, or null if swap should go to sender
  readonly recipient: string | null;
  readonly percent: number | null;

}

const initialState: SwapState = {
    typedValue:'',
    independentField:Field.INPUT,
    INPUT: {type:'native',key:'ETH'},
    OUTPUT: {type:null,key:''},
    recipient:null,
    percent:null,

}


export const addpercent = createAction<{ percent:null|25|50|75|100 }>('swap/percent');
export const switchswap = createAction('swap/switchswap');
export const setRecipient = createAction<{ recipient: string | null }>('swap/setRecipient')
export const selectSwap = createAction<{ field: Field; token:Tokenseslect }>('swap/selectSwap')
export const typeInput = createAction<{ field: Field; typedValue: string }>('swap/typeInput')
export default createReducer<SwapState>(initialState, (builder) =>
  builder
    .addCase(selectSwap, (state, { payload: { token, field } }) => {
      const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT
      if (token.key === state[otherField].key) {
        return {
          ...state,
          independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
          [field]:  token ,
          [otherField]:state[field],
          percent:null
        }
      } else {
        return {
          ...state,
          percent:null,
          [field]: token ,
        }
      }
    })
    .addCase(addpercent,( state , { payload: { percent } })=>{
       return {
            ...state,
            percent
       }
    })
 
    .addCase(switchswap,(state)=>{
      return {
           ...state,
          independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
          INPUT:state[Field.OUTPUT],
          OUTPUT:state[Field.INPUT],
          recipient:null,
      }
   })
    .addCase(typeInput , (state, { payload: { field, typedValue } }) => {
        return {
          ...state,
          independentField: field,
          typedValue,
        }
      })
    .addCase(setRecipient, (state, { payload: { recipient } }) => {
        state.recipient = recipient
      })
)
