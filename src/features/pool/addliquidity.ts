import { createAction, createAsyncThunk, createReducer } from '@reduxjs/toolkit'

export enum Field {
    INPUT = 'INPUT',
    OUTPUT = 'OUTPUT',
  }

export type Tokenseslect = {
    type:'native'|'token'|'tokendb'|null,
    key:string|null
}
export interface addliquidityState {
  readonly typedValue: string,
  readonly independentField: Field
  readonly [Field.INPUT]: Tokenseslect;
  readonly [Field.OUTPUT]: Tokenseslect;
  readonly recipient: string | null;
  readonly percent: number | null;

}

const initialState: addliquidityState = {
    typedValue:'',
    independentField:Field.INPUT,
    INPUT: {type:'native',key:'ETH'},
    OUTPUT: {type:null,key:''},
    recipient:null,
    percent:null,
}


export const addpercent = createAction<{ percent:null|25|50|75|100 }>('addliquidity/percent');
export const setRecipient = createAction<{ recipient: string | null }>('addliquidity/setRecipient')
export const select = createAction<{ field: Field; token:Tokenseslect }>('addliquidity/select')
export const typeInput = createAction<{ field: Field; typedValue: string }>('addliquidity/typeInput')
export default createReducer<addliquidityState>(initialState, (builder) =>
  builder
    .addCase(select, (state, { payload: { token, field } }) => {
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
