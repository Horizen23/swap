import { create } from "lodash";
import React, { useState, useEffect } from "react";
import { savewallet,useSaveWallet } from "../features/balance/balanceSlice";
import { selectActiveToken, useFidToken } from "../features/page/pageSlice";
import { useAppDispatch, useAppSelector, useCreatwallet } from "../hook";


export default function CreateWallet() {
    let [seed, setseed] = useState<any>(null)
    const active = useAppSelector(selectActiveToken);
    const { symbol } = useFidToken(active);
    const dispatch = useAppDispatch();
    const SaveWalletHook = useSaveWallet(dispatch)
    // let [seed,setseed] =useState<ResSeed|null>(null)
    let [status, setstatus] = useState<1 |2|string>(1)
    useCreatwallet(symbol,setseed,setstatus)
    function checkMnemonicCorrect(input: any) {
        const equal = Array.equal(input, seed?.mnemonic)
        const userId = getCookie('userid');
        const msgToEncryptJson = {
            userid: userId,
            walletType: symbol,
            publicAddress: seed?.address,
            privateAddress: seed?.privateKey,
            Mnemonic: seed?.mnemonic,
        }
        if (equal) {
            SaveWalletHook(symbol,msgToEncryptJson)
            Swal.fire({
                title: 'success!',
                text: 'Create wallet successfully.',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000
            })
        }
        else {
            Swal.fire({
                title: 'Error!',
                text: 'Mnemonic mismatch please try agian.',
                icon: 'error',
                confirmButtonText: 'submit'
            })

        }
    }
    function createLBTCwallet() {
        const userId = getCookie('userid');

       MHGWallet.api.authLBTC(seed?.login, seed?.password).then((e: any) => {

           let data:any = {
                login:seed?.login,
                password: seed?.password,
                LBTCaccess_token:e.access_token,
                LBTCrefresh_token:e.refresh_token,
           }
            MHGWallet.api.getLBTCaddress(e.access_token).then((e: any) => {
                data.address = e[0].address
                const msgToEncryptJson = {
                    userid: userId,
                    walletType: symbol,
                    login: seed?.login,
                    password: seed?.password,
                    publicAddress:e[0].address,
                    LBTCaccess_token: data.LBTCaccess_token,
                    LBTCrefresh_token: data.LBTCrefresh_token,

                }
                SaveWalletHook(symbol,msgToEncryptJson)
                Swal.fire({
                    title: 'success!',
                    text: 'Create wallet successfully.',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 2000
                })
            })
        })

        // MHGWallet.Balances.Currency[token.symbol].balance

          
        }


    return (
        <>
             {
                (seed)
                ?
                (status==1)
                ?
                <Showseed create={createLBTCwallet} setstatus={setstatus} seed={seed} />
                :
                <Confirmseed check={checkMnemonicCorrect} mnemonic={seed.mnemonic} />
                :
                (typeof status === 'string')
                ?
                <>
                   <div>{status}</div>
                </>
                :
                <>
                   <div className="loadingSpin"></div>
                </>
            } 
        </>
    )
        
}
function Showseed({ create, seed, setstatus }: { create: any, seed: any, setstatus: any }) {
    if (seed.login !== undefined && seed.password !== undefined) {
        return <>
            <p>Please keep this Seed phrase. They are used for recovering the wallet in case your can't login or changed.</p>
            <div id="lightningSeed">
                <p className="form-control" >lndhub://{seed.login}:{seed.password}@https://pp025.xyz:3002</p>
            </div>
            <br></br>
            <div className="align-items-center">
                <button onClick={(() => create())} className="btn green" data-toggle="pill" role="tab" aria-selected="true">Next</button>
            </div>

        </>
    } else {
        return <>

            <p>Please keep this Seed phrase. They are used for recovering the wallet in case your can't login or changed.</p>
            <div id="mnemonicSeed">
                <div className="row">
                    {Array.from({ length: 6 }, (value, key) => <div key={key} className="col">{key + 1}.{seed.mnemonic[key]}</div>)}
                </div>
                <div className="row">
                    {Array.from({ length: 6 }, (value, key) => <div key={key} className="col">{6 + key + 1}.{seed.mnemonic[key + 6]}</div>)}
                </div>
            </div>
            <br></br>
            <div className="align-items-center">
                <button onClick={(() => setstatus(2))} className="btn green" data-toggle="pill" role="tab" aria-selected="true">Next</button>
            </div>

        </>
    }


}
function Confirmseed({ check, mnemonic }: any) {
    let [input, setinput] = useState<any>(mnemonic)
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
                <button onClick={() => check(input)} className="btn green" data-toggle="pill" role="tab" aria-selected="true">Confirm</button>
            </div>
        </div>
    </>
}