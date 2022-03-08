import { store } from '../store';
import { Provider, useSelector } from 'react-redux';
import * as ReactDOM from "react-dom";
import React, { useEffect, useState } from "react";
import KPayment from "./KPayment";
function App() {
    const [balance, setbalance] = useState<any>('');
    const [transactions, settransactions] = useState<any>({});

    const [amountToTopup, setamountToTopup] = useState<any>(0);

    // MHGWallet.api.getTransactionFiatWallet().then((response: any) => {
    //     settransactions(response);
    // })
    MHGWallet.api.getUserBalance().then((response: any) => {
        setbalance(response)
    })

    function setAmount(e: any) {
        setamountToTopup(e.target.value);
        (window as any).KPayment.setAmount(e.target.value);
    }

    return (
        // <React.Fragment>
        <div className="col-md-12 col-lg-8">
            <div className="tab-content">
                <div className="tab-pane tab-pane2 fade active show">
                    <div className="card" >
                        <div className="card-body">
                            <h5 className="card-title">Topup Fiat Wallet</h5>
                            <p>Balance : {balance}</p>
                            <br />
                            <h5 className="card-title">Topup Fiat Wallet</h5>
                            <input placeholder='Amount topup' value={amountToTopup} onChange={(e) => { setAmount(e) }} name="amountInput" id="amountInput" type="number" className="form-control" style={{ width: "30%" }} />
                            <br />
                            <KPayment
                                formAction="https://pp025.xyz:8443/checkoutPayment"
                                onFinish={(res: any) => (window as any).location = res.rediect_url}
                                onProcess={() => console.log("P")}
                                debug={true}

                                attrs={{
                                    scriptUrl: "https://dev-kpaymentgateway.kasikornbank.com/ui/v2/kpayment.min.js",
                                    apiKey: "pkey_test_73rUnLdIvTiXSx3mLCmYVVFpXQkW7j7ITR",
                                    amount: amountToTopup,
                                    currency: "THB",
                                    paymentMethods: "card",
                                    shopName: "Topup THB",
                                    userId: getCookie('userid'),
                                }} />
                            <br />
                            <br />
                            <h5 className="card-title">Tranfer</h5>
                            <select className="form-control" name="selectBank" id="selectBank">
                                <option selected disabled value={0}>==== Select bank to tranfer ====</option>
                                <option value="Kbank">Kbank</option>
                                <option value="Scb">Scb</option>
                                <option value="TMB">TMB</option>
                            </select>
                            <br />
                            <input placeholder='Account number' name="account_number" id="account_number" type="text" className="form-control" />
                            <button onClick={() => { }}>transfer</button>
                            <br />
                            <br />
                            <h5 className="card-title">Transaction</h5>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Amount (THB)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {

                                        // transactions.map((tsx: any) => {
                                        //     return <tr key={tsx.objectId} onClick={event => {
                                        //         // window.location.href=tsx.url;
                                        //         // window.open(tsx.url, '_blank');
                                        //         // if (!tsx.ispaid) {
                                        //         //     Swal.fire(
                                        //         //         {
                                        //         //             title: 'Payment Invoice',
                                        //         //             html: `
                                        //         //         <div>
                                        //         //         <img id="qr-code" className="qr-code img-thumbnail img-responsive" src="https://chart.googleapis.com/chart?cht=qr&chl=${tsx.payment_request}&chs=300x300&chld=L|0" />
                                        //         //         </div><br>
                                        //         //         <textarea style="width: 100%;" className="form-control" disabled cols="30" rows="6">${tsx.payment_request}</textarea>

                                        //         //         `,
                                        //         //         }
                                        //         //     )
                                        //         // }
                                        //     }}>
                                        //         <td>{tsx.createdAt}</td>
                                        //         <td>{tsx.confirmed}</td>
                                        //         <td>{tsx.amount}</td>
                                        //     </tr>
                                        // })
                                    }
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </div>


        // </React.Fragment>
    )

}



export default function render() {
    return ReactDOM.render(
        <React.StrictMode>
            <Provider store={store}>
                <App />
            </Provider>
        </React.StrictMode>
        ,
        document.getElementById("Fiat_wallet")
    )
}
