import { tokenbalanceAsync } from './../features/balance/balanceSlice';
import { useEffect } from 'react';
import { useRef } from 'react';
import { isAddress } from 'ethers/lib/utils';
import { configureStore, ThunkAction, Action, applyMiddleware } from '@reduxjs/toolkit';
import counterReducer from '../features/page/pageSlice';
import balanceReducer from '../features/balance/balanceSlice';
import subscribeActionMiddleware, { subscribeActionBefore } from 'redux-subscribe-action';
import { Listener } from 'redux-subscribe-action';
import swap from '../features/swap/reducer'
import router from '../features/swap/router'
import transaction from '../features/transaction/reducer'

export const store = configureStore({
  reducer: {
    swap,
    router,
    transaction,
    action: counterReducer,
    balance: balanceReducer,
  }
})
let t:boolean;
store.subscribe(() => {
  if(!t){
    const {currency,tokendb} = store.getState().balance
    if(isAddress(`${currency.ETH.address}`)){
        t=true
        store.dispatch(tokenbalanceAsync())
    }
  }
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;