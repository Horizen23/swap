import * as ReactDOM from "react-dom";
import React, { useState,useEffect } from "react";
import { useAppSelector } from "../hook";
import { selectActiveToken, useFidToken } from "../features/page/pageSlice";
import CreateWallet from "./CreateWallet";
import { Recovery } from "./Recovery";

export = function Login() {
    let [action, setaction] = useState<'Create'|'Recovery'|''>('');
    const active = useAppSelector(selectActiveToken);
    const { status, name } = useFidToken(active);
    useEffect(() =>{
        setaction('')
    },[active])
    return (
        <div className="col-md-12 col-lg-8">
            <div className="tab-content">
                <div className="tab-pane tab-pane2 fade active show" id="createETHWalletcheck" role="tabpanel">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Create {name} Wallet</h5>
                            {!action ? (
                                <>
                                    <button onClick={() => setaction('Create')} className="btn green">
                                        Create Wallet
                                    </button>
                                    <button onClick={() => setaction('Recovery')} className="btn green">
                                        Recovery
                                    </button>
                                </>
                            ) : action == 'Create' ? (
                                <CreateWallet/>
                            ) : (
                                <Recovery />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
