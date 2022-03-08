import React, { Component ,memo,useEffect,useState,useRef} from "react";





export function useCreatwallet(symbol: string,setseed:any,setstatus:any) {
  useEffect(() => {
        MHGWallet.api.CreateWallet(symbol as any).then((e: any) => {
            if (symbol != 'LBTC') {
                e.mnemonic = e.mnemonic.split(' ')
                setseed(e)
            } else {
                setseed(e)
            }
        }).catch((error: any) => setstatus(JSON.stringify(error) ))
  }, [])
}

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


