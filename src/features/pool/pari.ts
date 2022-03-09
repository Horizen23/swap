import JSBI  from 'jsbi';
import { store } from './../../store/index';
import { createAction, createAsyncThunk, createReducer } from '@reduxjs/toolkit'
import { gettoken, useTokenActive } from '../../hook/swap';
var MaxUint256 = JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');


export const Getpair = createAsyncThunk(
  'Pari/getpair',
  async (generatedPairs:any, { rejectWithValue }) => {
    try {
      const addressPair = generatedPairs.map((v:any)=>v.address);
      const data = await  MHGWallet.api.getpair(addressPair);
        let obj:any = {}
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                obj[key] = {...generatedPairs.find(({address}:any)=> address===key),...data[key]}
            }
        }
      return obj;
    } catch (err:any) {
      return rejectWithValue(err.responseJSON)
    }
  }
);

interface IPari {
      address: string,
     decimals: string|number,
     symbol: string,
     name: string,
     totalSupply: string,
     balanceOf: string,
     Reserves: {
        reserve0: string,
        reserve1: string,
        blockTimestampLast: string|number,
    }
     token0:TToken
     token1:TToken
     getKey:()=>any[]
  // members of your "class" go here
}

type StatusPari = 'loading'|'failed'|'active'|'idle'
export interface Paristate {
    readonly status:StatusPari;
    readonly list:pair|{};
}
const initialState: Paristate = {
    status:'idle',
    list:{},
}

export default createReducer<Paristate>(initialState, (builder) =>
  builder
  .addCase(Getpair.pending,( state:any)=>{
    state.status = 'loading'
  })
  .addCase(Getpair.fulfilled,( state:any, {payload}:any)=>{
    state.status = 'active'
  

    
    // just use it as usual
    // console.log('payload',new NewPair(payload['0x0EF4917F93fb1016407569AD72833232F1CFA806']))
    state.list = {...state.list,...payload}
  })  
  .addCase(Getpair.rejected,( state:any)=>{
    state.status = 'failed'
  })

)

export const WrapStatePair = function(this:IPari,pair: any) {
  this.Reserves = pair.Reserves
  this.address = pair.address
  this.balanceOf = pair.balanceOf
  this.decimals = pair.decimals
  this.name = pair.name
  this.symbol = pair.symbol
  this.token0 = pair.token0
  this.token1 = pair.token1
  this.getKey = ():any[] =>{
    return [(this.token0.type =='native')?this.token0.symbol:this.token0.address,(this.token1.type =='native')?this.token1.symbol:this.token1.address]
  }
  
} as any as { new (txt: any): IPari }



// function Pizza(this: any, ) {

// Pizza.prototype.addTopping = function addTopping(topping: string) {
//   this.toppings.push(topping);
// };