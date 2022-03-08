import { useSelector } from 'react-redux';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../store';
export const activePoppup = {
  SWAP:{
      INPUT:'SWAP.INPUT',
      OUTPUT:'SWAP.OUTPUT'
  },
  AddLiquidity:{
      INPUT:'AddLiquidity.INPUT',
      OUTPUT:'AddLiquidity.OUTPUT'
  },
  RemoveLiquidity:{
      INPUT:'RemoveLiquidity.INPUT',
      OUTPUT:'RemoveLiquidity.OUTPUT'
  },
  Import:{
      INPUT:'Import.INPUT',
      OUTPUT:'Import.OUTPUT'
  },
}



const initialState: any = {
  active_token: 'LBTC',
  popup_add_token: false,
  updateTransaction:0,
  activetokenlist:{
    action:'',
    status:false
  }
};
export const counterSlice = createSlice({
  name: 'action',
  initialState,
  reducers: {
    change: (state, action: PayloadAction<string>) => {
      state.active_token = action.payload;
    },
    activeTokenlist:(state,actions: PayloadAction<any>)=>{
      state.activetokenlist =actions.payload
    },
    toggleToken: (state) => {
      state.popup_add_token = !state.popup_add_token;
    },
    addTransaction:(state) => {
      state.updateTransaction += 1;
    },
  },

});

export function useFidToken(symbo: string) {
  return useSelector(({ balance }: any) => {
    return balance.currency[symbo] || balance.token[symbo]
  });
}

export const { change, toggleToken,addTransaction,activeTokenlist } = counterSlice.actions;
export const selectActiveToken = (state: RootState) => state.action.active_token;
export const selectPopuoAddToken = (state: RootState) => state.action.popup_add_token;
export const selectaddTransaction = (state: RootState) => state.action.updateTransaction;
export default counterSlice.reducer;









