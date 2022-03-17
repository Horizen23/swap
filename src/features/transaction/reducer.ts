import { BigNumber } from 'ethers';
import { tokenbalanceAsync, useloadWallet } from './../balance/balanceSlice';
import { store } from './../../store/index';
import { createAction, createAsyncThunk, createReducer } from '@reduxjs/toolkit'
import { useSwapActionHandlers } from '../../hook/swap';
import { useBalanceHandlers } from '../balance/hooks';
window.Bg = BigNumber;


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

function truncate(balance:any,percent:any)
{
    const lp = BigNumber.from(balance)
    
    if (percent == 0) {
      return '0';
    }else if(percent == 100){
      return balance;
    }else{
      return Math.trunc(+lp.div(100).mul(percent).toString()).toLocaleString('fullwide', {useGrouping:false});
    }


}
export const RomoveLiquidityAsync = createAsyncThunk(
  'router/RomoveLiquidity',
  async ({wpair,typedValue}:any, { rejectWithValue }) => {
    try {
      const amount = truncate(wpair.balanceOf,typedValue)
      console.log(amount)
  // const res = await MHGWallet.api.permitapprove({
      //   pairAddress:wpair.address,
      //   lpvalue:`${truncate(((+wpair.balanceOf)/100*typedValue))}`,
      //   tokenAddress:wpair.token0.type=='native'?wpair.token1.address:wpair.token0.address
      // })
      const res = await MHGWallet.api.permitapprove({
        pairAddress:wpair.address,
        lpvalue:`${amount}`,
        tokenAddress:wpair.token0.type=='native'?wpair.token1.address:wpair.token0.address
      })
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
      if(meta.arg.features!='deposit'&&meta.arg.features!='withdraw'){
        state.swap.listener[meta.requestId]={
          tokenA:{...meta.arg.transaction.tokenA,amount:payload.amountIn},
          tokenB:{...meta.arg.transaction.tokenA,amount:payload.amountOut},
          status:'active'
        }
      }else{
        state.swap.listener[meta.requestId]={
          status:'active'
        }
      }
      state.status = 'active'

    })

    .addCase(RomoveLiquidityAsync.pending,( state,{ meta } )=>{
       state.status = 'loading'
    })
    .addCase(RomoveLiquidityAsync.fulfilled,( state,{payload,meta} )=>{
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
