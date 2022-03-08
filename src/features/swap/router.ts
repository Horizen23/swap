import JSBI  from 'jsbi';
import { store } from './../../store/index';
import { createAction, createAsyncThunk, createReducer } from '@reduxjs/toolkit'
import { gettoken, useTokenActive } from '../../component_swap/hook';
var MaxUint256 = JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
import { selectSwap, switchswap ,Field,Tokenseslect, typeInput, addpercent} from "./reducer"

export const RoutingAPITrade = createAsyncThunk(
  'router/RoutingAPITrade',
  async (userData, { rejectWithValue }) => {
    const State = store.getState();
    const {swap:{INPUT,OUTPUT,typedValue,independentField},balance:{currency:{ETH:{address}}}} = State;
    const type =  independentField==='INPUT'?'exactIn':'exactOut'
    const {decimals} = gettoken(State,Field.INPUT)
    // let decimalss = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))
    // let amount = JSBI.lessThanOrEqual(decimalss, MaxUint256)?JSBI.BigInt((+typedValue as number)*1e+18):0
    // let amount = JSBI.multiply(JSBI.BigInt((+typedValue as number)),decimalss)
    let amount = JSBI.BigInt((+typedValue)*(10**decimals))
    try {
        const response:Routerstate['router'] = await MHGWallet.api.searchRouterPart(INPUT, OUTPUT,amount.toString(),type,address as string);
      return response;
    } catch (err:any) {
      return rejectWithValue(err.responseJSON)
    }
  }
);

export const Erc20Approve = createAsyncThunk(
  'router/Erc20Approve',
  async (data, { rejectWithValue }) => {
    const address = store.getState().router.router.routers[0]
    try {
      const response:string = (await  MHGWallet.api.erc20approve(address)).approve
      return {
        amount:response
      };
    } catch (err:any) {
      return rejectWithValue(err.responseJSON)
    }
  }
);


type StatusRouter = 'loading'|'failed'|'active'|'idle'
export interface Routerstate {
    readonly status:StatusRouter;
    readonly router:{
      amount:string;
      quote:string;
      routers:string[];
      allowance:string;
      part:string[];
    };
    readonly status_appover:StatusRouter;
    readonly message:string;
}
const initialState: Routerstate = {
    status:'idle',
    router:{
      amount:'',
      quote:'',
      routers:[],
      allowance:'',
      part:[],
    },
    status_appover:'idle',
    message:''

}

export const Routingloading = createAction('router/loading');
export default createReducer<Routerstate>(initialState, (builder) =>
    builder
    .addCase(Routingloading,( state:any, action)=>{
        return {
            ...state,
            message:'',
            status:'loading',
        }
    })
    .addCase(RoutingAPITrade.pending,( state:any, action)=>{
       return {
            ...state,
            message:'',
            status:'loading',
       }
    })
    .addCase(RoutingAPITrade.fulfilled,( state:any, {payload:router})=>{
        return {
            router,
            message:'',
            status:'active',
            status_appover:'idle',
            
        }
     })  
     .addCase(RoutingAPITrade.rejected,( state:any, {payload}:any)=>{
          state.router={
            amount:'',
            quote:'',
            routers:[],
            allowance:'',
            part:[],
          };
          state.status='failed'
          if(payload&&payload.message){
            state.message=payload.message
          }

   })


  .addCase(Erc20Approve.pending,( state:any, action)=>{
    state.status_appover = 'loading'
  })
  .addCase(Erc20Approve.fulfilled,( state:any, {payload:amount})=>{
    state.status_appover = 'active'
    state.router.allowance = amount
  })  
  .addCase(Erc20Approve.rejected,( state:any, {payload}:any)=>{
    state.status_appover = 'failed'
  })
)
