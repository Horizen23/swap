import { store } from './../../store/index';
import { ethers } from 'ethers';
import {tokendb as tokendb_} from '../../config/index'
import { useEffect, useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppDispatch, useAppSelector } from './../../hook/index';
import { createAsyncThunk, createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../store';
import { WrapETH } from '../../config';

export const balanceAsync = createAsyncThunk(
  'balance/fetchtoken',
  async ({ type, data }: any) => {
    if (type != 'LBTC') {
      const response = await MHGWallet.api.BalanceOf(data.publicAddress, type);
      return response.data;
    } else {
      const response = await MHGWallet.api.BalanceOf(data.publicAddress, type, data.LBTCaccess_token);
      return response.data;
    }
  }
);
export const tokenbalanceAsync = createAsyncThunk(
  'balance/tokenbalanceAsync',
  async () => {
    const {currency,tokendb} = store.getState().balance
    const response = await MHGWallet.api.erc20(currency.ETH.address as string,Object.keys(tokendb as object) as [any])
    return response;
  }
);
const tokendb: {[key:string]:TTokendb} = tokendb_ as {[key:string]:TTokendb};
const initialState: Balance = {
  currency: {
    LBTC: {
      symbol: 'LBTC',
      name: 'Bitcoin lightning',
      decimals: 8,
      balance: null,
      login: null,
      password: null,
      LBTCaccess_token: null,
      LBTCrefresh_token: null,
      logoURI: '/app/assets/img/icon/2335.png',
      address: null,
      type: 'native',
      status: 'idle'
    },
    BTC: {
      symbol: 'BTC',
      name: 'Bitcoin',
      decimals: 8,
      balance: null,
      logoURI: '/app/assets/img/icon/18.png',
      address: null,
      type: 'native',
      status: 'idle'
    },
    ETH: {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18,
      balance: null,
      logoURI: '/app/assets/img/icon/1.png',
      address: null,
      type: 'native',
      status: 'idle',
      WraptoToken:WrapETH
    }
  },
  token: {

  },
  tokendb
};
export const useUpdateCurrency = createAsyncThunk(
  'router/useUpdateBalaneeSwap',
  async (userData:argtype, { rejectWithValue }) => {
    const {balance:{tokendb,currency,token}} = store.getState();
    try {
      if(userData=='ETH'&&currency.ETH.address){
        const response = await  MHGWallet.api.BalanceOf(currency.ETH.address,'ETH')
        return response
      } 
    } catch (err:any) {
      rejectWithValue({sda:"uouo"})
    }
  }
);
export const balanceSlice = createSlice({
  name: 'balance',
  initialState,
  reducers: {
    savewallet: (state, action: PayloadAction<{ keyname: string, msgToEncryptJson: any }>) => {
      const { keyname, msgToEncryptJson } = action.payload;
      let token = state.currency[keyname];
      MHGWallet.api.savelogin(keyname, msgToEncryptJson).then((e: any) => { })
      if (keyname != 'LBTC') {
        token.address = msgToEncryptJson.publicAddress
      } else {
        token.login = msgToEncryptJson.login
        token.password = msgToEncryptJson.password
        token.LBTCaccess_token = msgToEncryptJson.LBTCaccess_token
        token.LBTCrefresh_token = msgToEncryptJson.LBTCrefresh_token
        token.address = msgToEncryptJson.address
      }
    },
    deletwallet: (state, action: PayloadAction<{ keyname: string }>) => {
      let token = state.currency[action.payload.keyname];
      token.status = 'idle'
      token.address = null
    },
    setaddress: (state, action: PayloadAction<{ keyname: string, address: string }>) => {
      state.currency[action.payload.keyname].address = action.payload.address
    },
    addtoken: (state, actions: PayloadAction<any>) => {
      const token = actions.payload;
      state.token[token.address] = { ...token, status: 'active' }
      let dbtokenlist = localStorage.getItem('TOKENLIST')
      if (dbtokenlist) {
        let dd = JSON.parse(dbtokenlist);
        dd[token.address] = { ...token, status: 'active' };
        localStorage.setItem('TOKENLIST', JSON.stringify(dd));
      } else {
        localStorage.setItem('TOKENLIST', JSON.stringify({ [token.address]: { ...token, status: 'active' } }));
      }
    },
    addtokendb:(state, actions: PayloadAction<any>)=>{
      const token = actions.payload;
    
      state.tokendb[token.address] = token;
    },
    addtokenback: (state, actions: PayloadAction<any>) => {
      actions.payload.status = 'loading'
      state.token[actions.payload.address] = actions.payload
    },
  
    // state.token[token.address] = { ...token, status: 'active' }

  },
  extraReducers: (builder) => {
    builder
      .addCase(useUpdateCurrency.pending, (state: Balance, action) => {
          state.currency[action.meta.arg].status = 'loading'
      })
      .addCase(useUpdateCurrency.fulfilled, (state: Balance, action) => {
          state.currency[action.meta.arg].status = 'active'
          state.currency[action.meta.arg].balance = action.payload.data.balance
      })
      .addCase(balanceAsync.fulfilled, (state, action) => {
        state.currency[action.meta.arg.type].status = 'active'
        state.currency[action.meta.arg.type].balance = action.payload.balance
      })
      .addCase(tokenbalanceAsync.pending, (state, action) => {
          for (const [key, value] of Object.entries(state.tokendb)) {
            state.tokendb[key].status = 'loading';
          }
          
      })
      .addCase(tokenbalanceAsync.fulfilled, (state, action) => {
          const tokendb = action.payload.map((token:any)=>{
            token.status = 'active'
            state.tokendb[token.address].status = 'active';
            state.tokendb[token.address].balance = token.balance;

            return token
          })
          // state.tokendb = tokendb;

      });



  },

});

export const { savewallet, setaddress, deletwallet, addtoken, addtokenback ,addtokendb} = balanceSlice.actions;
const balanceSliceReducer = balanceSlice.reducer;

export const selectcurrency = (state: RootState): ListToken => state.balance.currency;
export const selecttoken = (state: RootState): any => state.balance.token;
export const selectTokendb = (state: RootState): any => state.balance.tokendb;


export const useSaveWallet = (dispatch: any) => (keyname: string, msgToEncryptJson: any) => {
  if (!keyname || !msgToEncryptJson) {
    throw new Error("got wrong parameters for useSaveWallet");
  }
  dispatch(savewallet({ keyname, msgToEncryptJson }))
  dispatch(balanceAsync({ type: keyname, data: msgToEncryptJson }))

}
export const useAddtoken = (dispatch: any) => (token: any) => {
  dispatch(addtoken(token))
}
export const useLoadToken = (dispatch: any) => () => {
  // dispatch(addtokenback())
  let dbtokenlist = localStorage.getItem('TOKENLIST');
  if (dbtokenlist) {
    const tokenobj = JSON.parse(dbtokenlist)
    for (const key in tokenobj) {
      dispatch(addtokenback(tokenobj[key]));
    }
  }

}


export const useUpdateBalanee = (dispatch: any) => (keyname: string) => {
  if (!keyname) {
    throw new Error("got wrong parameters for useSaveWallet");
  }
  let data = MHGWallet.api.getwallet(keyname);
  if (data) {
    dispatch(balanceAsync({ type: keyname, data }))
  }

}
export const useRecoveryWallet = (dispatch: any) => async (keyname: string, input: 12[], LNinput: string = "") => {
  if (!input || !keyname) {
    throw new Error("got wrong parameters for input");
  }
  let iswallet: any;
  try {
    if (keyname == 'ETH') {
      iswallet = ethers.Wallet.fromMnemonic(input.join(" "))
    } else if (keyname == 'BTC') {
      iswallet = await MHGWallet.api.recoveryBTCwallet(input.join(" "));
    } else if (keyname == 'LBTC') {
      if (LNinput === "") {
        Swal.fire({
          title: 'Warning!',
          text: 'please enter your seed.',
          icon: 'warning',
          confirmButtonText: 'submit'
        })
      } else {
        // lndhub://<login>:<password>@https://pp025.xyz:3002
        var tempData = LNinput.replace('lndhub://', '');
        tempData = tempData.replace('@https://pp025.xyz:3002', '');
        const LoginPasswordArr = tempData.split(":");
        const login = LoginPasswordArr[0];
        const password = LoginPasswordArr[1];
        const LBTCauth = await MHGWallet.api.authLBTC(String(login), String(password));
        const address = await MHGWallet.api.getLBTCaddress(LBTCauth.access_token);
        if (login !== "" && password !== "" && LBTCauth.access_token !== "" && LBTCauth.refresh_token !== "" && address !== "") {
          const msgToEncryptJson = {
            userid: getCookie('userid'),
            walletType: keyname,
            login: login,
            password: password,
            publicAddress: address[0].address,
            LBTCaccess_token: LBTCauth.access_token,
            LBTCrefresh_token: LBTCauth.refresh_token,
          }
          dispatch(savewallet({ keyname, msgToEncryptJson }))
          dispatch(balanceAsync({ type: keyname, data: msgToEncryptJson }))
          Swal.fire({
            title: 'success!',
            text: 'Recovery wallet successfully.',
            icon: 'success',
            showConfirmButton: false,
            timer: 2000
          })
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Seed mismatch please try agian.',
            icon: 'error',
            confirmButtonText: 'submit'
          })
        }

      }
      return;

    }
  } catch (error) {
    iswallet = false
  }
  if (iswallet) {
    const msgToEncryptJson = {
      userid: getCookie('userid'),
      walletType: keyname,
      publicAddress: iswallet?.address,
      privateAddress: iswallet?.privateKey,
      Mnemonic: input,
    }
    dispatch(savewallet({ keyname, msgToEncryptJson }))
    dispatch(balanceAsync({ type: keyname, data: msgToEncryptJson }))
    Swal.fire({
      title: 'success!',
      text: 'Recovery wallet successfully.',
      icon: 'success',
      showConfirmButton: false,
      timer: 2000
    })
  } else {
    Swal.fire({
      title: 'Error!',
      text: 'Mnemonic mismatch please try agian.',
      icon: 'error',
      confirmButtonText: 'submit'
    })
  }


}
export const useDeletWallet = (dispatch: any) => (keyname: string) => {
  if (!keyname) {
    throw new Error("got wrong parameters for useSaveWallet");
  }
  dispatch(deletwallet({ keyname }))
}
export const useloadWallet = (dispatch: any) => (ListToken: ListToken) => {
  if (!ListToken) {
    throw new Error("got wrong parameters for useSaveWallet");
  }
  for (const [key, value] of Object.entries(ListToken)) {
    const encode = localStorage.getItem(`${key}-WalletData`);
    if (encode) {
      const decode = MHGWallet.api.loadwallet(encode)
      if (decode.publicAddress) {
        dispatch(setaddress({ keyname: key, address: decode.publicAddress }))
        dispatch(balanceAsync({
          data: decode,
          type: key
        }))
      }
    }
  }
}

export default balanceSlice.reducer;
