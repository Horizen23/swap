import { tokenbalanceAsync, useloadWallet } from './../balance/balanceSlice';
import { store } from './../../store/index';
import { createAction, createAsyncThunk, createReducer } from '@reduxjs/toolkit'
import { useSwapActionHandlers } from '../../component_swap/hook';



export type Transactionlistener = {
  [key:string]:any
}
export interface Transaction {
  readonly swap: {
    status:Tokenstatus,
    listener:Transactionlistener
  },

}

const initialState: Transaction = {
  swap:{
    status:'idle',
    listener:{
      
    }
  },
}
export const SwapTrade = createAsyncThunk(
  'router/SwapTrade',
  async (userData:any, { rejectWithValue }) => {
    try {
        const response:any = await MHGWallet.api.swap(userData);
      return response;
    } catch (err:any) {
      return rejectWithValue(err.responseJSON)
    }
  }
);

export default createReducer<Transaction>(initialState, (builder) =>
  builder
    .addCase(SwapTrade.pending,( state,{ meta } )=>{
       state.swap.listener[meta.requestId]={
              ...meta.arg.transaction,
              status:'pendding'
        }
        state.swap.status = 'loading'
    })
    .addCase(SwapTrade.fulfilled,( state,{payload,meta} )=>{
      state.swap.listener[meta.requestId]={
        tokenA:{...meta.arg.transaction.tokenA,amount:payload.amountIn},
        tokenB:{...meta.arg.transaction.tokenA,amount:payload.amountOut},
        status:'active'
      }
      
      
      state.swap.status = 'active'
    })
)