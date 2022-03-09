import { type } from 'jquery';
import { MhgWallet } from '.';

export declare global {
    declare module "*.svg" {
        import { ReactElement, SVGProps } from "react";
        const content: (props: SVGProps<SVGElement>) => ReactElement;
        export default content;
      }
    declare let code:{
        encryptMessage:function;
        decryptMessage:function;
    };
    declare let Datafeeds:any;
    declare let TradingView:any;

    interface ArrayConstructor {
        equal(array1:array,array2:array): Boolean;
    }
    declare let MHGWallet: MhgWallet;
    declare let MhgApi: { [key: string]: any  };
    declare let seed: { [key: string]: any  };
    declare let getCookie: function;
    declare let Swal: { [key: string]: any  };
    interface Window { [key: string]: any  }
    interface Mnemonic {
        readonly phrase: string;
        readonly path: string;
        readonly locale: string;
    };
  
    type ICurrency ={
        name:string ,
        symbol:string,
        decimals:string,
        balance:string|null,
    }
    type Tokenstatus= 'idle'|'active'| 'loading' | 'failed'
    type TToken = {
        status?: Tokenstatus;
        name:string,
        symbol:string,
        decimals:number,
        login?:string|null,
        password?:string|null,
        LBTCaccess_token?:string|null,
        LBTCrefresh_token?:string|null,
        balance:number|null,
        logoURI?:string
        address:string|null
        interval?:any
        WraptoToken?:string
        type:'native'|'token'
    }
    type typeAction = 'token'|'native'|'tokendb'
    type ListCurrency = {
        [key:string]:TToken;
    }
    type ListToken = {
        [key:string]:TToken;
    }
    declare module "*.json" {
        const value: any;
        export default value;
      }
   
    interface Balance {
        currency: ListCurrency;
        token: ListToken;
        tokendb:{[key:string]:TTokendb}
    }
    type TWallet ={
        Currency: {[key: string]:ICurrency}
        Token:{[key: string]:Token}
    }
    interface ResSeed {
            userid: string,
            walletType: string,
            address: string,
            privateKey: string,
            mnemonic: [],
    }
    interface ResSeedlbtc {
        login: string,
        password: string,

    }
    type TTokendb= {
        address: string;
        chainId: number;
        decimals: number;
        logoURI: string;
        name: string;
        symbol: string;
        nativefor:string;
        type:'native'|'token'|'tokendb'
        balance?: null|number,
        status?: Tokenstatus;
      }
    type Tokenswap= { 
        type:typeAction,
        key:string,
        amount:string,
        status:'active'|'loading'|'printing'
    }
    interface LBTCseed{
        login?:string|null,
        password?:string|null,
        LBTCaccess_token?:string|null,
        LBTCrefresh_token?:string|null,
    }

    interface Seed {
        userid: string,
        walletType:string,
        publicAddress: string,
        privateAddress: string,
        Mnemonic: [],
    }

    type Itransaction = Array<transactionObject>

    type transactionObject = {
        tx_hash: string,
        url: string,
        value:number,
        spent: boolean,
        date: string,
        status:string,
        approveStatus:boolean
    }
    type argCreatewallet = 'BTC' | 'LBTC' | 'ETH';
    type argtype = 'BTC' | 'ETH' | 'LBTC';  
    type RequestApi = {
        url: string,
        method: 'GET'|'POST',
        timeout?: string,
        headers?: any,
        data?: any
    }
}