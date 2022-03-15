import { tokenbalanceAsync, useloadWallet } from './../balance/balanceSlice';
import { store } from './../../store/index';
import { createAction, createAsyncThunk, createReducer } from '@reduxjs/toolkit'
import { useSwapActionHandlers } from '../../hook/swap';



export type Transactionlistener = {
  [key:string]:any
}
export interface Transaction {
  status:Tokenstatus,
  readonly swap: {
    listener:Transactionlistener
  },
  readonly addliquidity: Transactionlistener,
}

const initialState: Transaction = {
  status:'idle',
  swap:{
    listener:{
      
    }
  },
  addliquidity:{}
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
export const AddLiquidity = createAsyncThunk(
  'router/AddLiquidity',
  async (userData:any, { rejectWithValue }) => {
    try {
        const response:any = await MHGWallet.api.addliquidity(userData);
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
        state.status = 'loading'
    })
    .addCase(SwapTrade.fulfilled,( state,{payload,meta} )=>{
      state.swap.listener[meta.requestId]={
        tokenA:{...meta.arg.transaction.tokenA,amount:payload.amountIn},
        tokenB:{...meta.arg.transaction.tokenA,amount:payload.amountOut},
        status:'active'
      }
      state.status = 'active'
    })

    .addCase(AddLiquidity.pending,( state,{ meta } )=>{
      // state.swap.listener[meta.requestId]={
      //        ...meta.arg.transaction,
      //        status:'pendding'
      //  }
       state.status = 'loading'
   })
   .addCase(AddLiquidity.fulfilled,( state,{payload,meta} )=>{
    //  state.addliquidity[meta.requestId]={
    //  }
     state.status = 'active'
   })
)
