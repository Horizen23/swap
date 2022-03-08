import { create } from "lodash";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRecoveryWallet, useSaveWallet } from "../features/balance/balanceSlice";
import { useAppDispatch, useAppSelector } from "../hook";
import { selectActiveToken, useFidToken } from "../features/page/pageSlice";

export function Recovery() {
    const active = useAppSelector(selectActiveToken);
    const { symbol } = useFidToken(active);
    return   symbol!='LBTC'?<ConfirmBTCAndETH  symbol={symbol}/>:<ConfirmLBTC  symbol={symbol}/>    
}

function ConfirmBTCAndETH({symbol}:{symbol:string}) {
    const dispatch = useAppDispatch();
    const RecoveryWalletHook = useRecoveryWallet(dispatch)      
    let [input, setinput] = useState<any>(["success", "biology", "believe", "dinner", "divert", "taxi", "case", "vehicle", "blur", "seed", "shell", "pony"])
    function onChange(index: any, value: any) {
        let newinput = [...input]
        newinput[index] = value.target.value;
        setinput(newinput)
    }
    return <>
        <p>Please keep this Seed phrase. They are used for recovering the wallet in case your can't login or changed.</p>
        <div id="mnemonicSeed">
            <div className="row">
                {Array.from({ length: 6 }, (value, key) => <div key={key} className="col"><input type="text" id="btc-word1" className=" form-control" placeholder={`word ${key + 1}`} value={input[key]} onChange={(e) => onChange(key, e)} /></div>)}
            </div>
            <br></br>
            <div className="row">
                {Array.from({ length: 6 }, (value, key) => <div key={key} className="col"><input type="text" id="btc-word1" className=" form-control" placeholder={`word ${key + 7}`} value={input[key + 6]} onChange={(e) => onChange(key + 6, e)} /></div>)}
            </div>
            <br></br>
            <div className="align-items-center">
                <button onClick={() => RecoveryWalletHook(symbol,input)} className="btn green" data-toggle="pill" role="tab" aria-selected="true">Confirm</button>
            </div>
        </div>
    </>
}

function ConfirmLBTC({symbol}:{symbol:string}){
    return <p>user/src/component/Recovery.tsx:42</p>
}