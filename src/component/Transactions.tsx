
import React, { useState, useEffect } from "react";
import { selectActiveToken, selectaddTransaction, useFidToken } from "../features/page/pageSlice";
import { useAppSelector } from "../hook";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')
const currentDate = new Date();
const timestamp = currentDate.getTime();

export default function Transactions() {
    const active = useAppSelector(selectActiveToken);
    const addTransaction = useAppSelector(selectaddTransaction);
    const token = useFidToken(active);
    const [transactions, settransactions] = useState<any>({});
    useEffect((): any => {
        let isSubscribed = true;
        console.log('load ...transaction');
        if (token.symbol === 'BTC') {
            MHGWallet.api.getTransaction(token.address, token.symbol).then((e: any) => {
                // console.log(e)
                if (isSubscribed) {
                    let tx = { ...transactions };
                    tx[active] = e || []
                    settransactions(tx);
                }
            })
        } else if (token.symbol === 'ETH') {
            console.log("ETH_tx")
        } else if (token.symbol === 'LBTC') {
            MHGWallet.api.getTransaction('', token.symbol).then((e: any) => {
                // console.log(e)
                // const t = timeAgo.format(Number(new Date()) - e[9].timestamp)
                // console.log(t)

                if (isSubscribed) {
                    let tx = { ...transactions };
                    tx[active] = e || []
                    settransactions(tx);
                }
            })
        }
        return () => isSubscribed = false;
    }, [active,addTransaction])


    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">Latest Transactions</h5>
                <div className="wallet-history">
                    {(token.symbol === 'BTC') ?
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>IN/OUT</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {

                                    transactions[active] && transactions[active].map((tsx: transactionObject) => {
                                        return <tr key={tsx.tx_hash} onClick={event => {
                                            // window.location.href=tsx.url;
                                            window.open(tsx.url, '_blank');
                                        }}>
                                            <td>{
                                                (new Date(tsx.date)).toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
                                            }</td>
                                            <td>
                                                {(tsx.approveStatus) ? <i style={{ fontSize: '20px' }} className="icon ion-md-checkmark-circle-outline green"></i> : <i style={{ fontSize: '20px' }} className="icon ion-md-time orange"></i>}
                                            </td>
                                            <td>{(tsx.status === 'in') ? <span className="status_in">IN</span> : <span className="status_out">OUT</span>}</td>
                                            <td>{(Math.pow(10, -8) * Number(tsx.value)).toFixed(8)}</td>
                                        </tr>
                                    })
                                }
                                {/* <td><i className="icon ion-md-checkmark-circle-outline green"></i></td>
                                <td><i className="icon ion-md-time orange"></i></td>
                                <td><i className="icon ion-md-close-circle-outline red"></i></td> */}


                            </tbody>
                        </table>
                        : (token.symbol === 'LBTC') ?
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Status</th>
                                        <th>Amount (BTC)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {

                                        transactions[active] && transactions[active].map((tsx: any) => {
                                            return <tr key={tsx.add_index} onClick={event => {
                                                // window.location.href=tsx.url;
                                                // window.open(tsx.url, '_blank');
                                                if (!tsx.ispaid) {
                                                    Swal.fire(
                                                        {
                                                            title: 'Payment Invoice',
                                                            html: `
                                                        <div>
                                                        <img id="qr-code" className="qr-code img-thumbnail img-responsive" src="https://chart.googleapis.com/chart?cht=qr&chl=${tsx.payment_request}&chs=300x300&chld=L|0" />
                                                        </div><br>
                                                        <textarea style="width: 100%;" className="form-control" disabled cols="30" rows="6">${tsx.payment_request}</textarea>

                                                        `,
                                                        }
                                                    )
                                                }
                                            }}>
                                                <td>{
                                                    // new Date()
                                                    // (Math.round(new Date().getTime() / 1000))
                                                   // tsx.timestamp
                                                    // (timestamp - (tsx.timestamp / 1000))
                                                    timeAgo.format(tsx.timestamp*1000)
                                                }</td>
                                                <td>
                                                    {(tsx.ispaid) ? <i style={{ fontSize: '20px' }} className="icon ion-md-checkmark-circle-outline green"></i> : <i style={{ fontSize: '20px' }} className="icon ion-md-time orange"></i>}
                                                </td>
                                                <td>{(Math.pow(10, -token.decimals) * tsx.amt).toFixed(8)}</td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                            :
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>IN/OUT</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {

                                        transactions[active] && transactions[active].map((tsx: transactionObject) => {
                                            return <tr key={tsx.tx_hash} onClick={event => {
                                                // window.location.href=tsx.url;
                                                window.open(tsx.url, '_blank');
                                            }}>
                                                <td>{
                                                    (new Date(tsx.date)).toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
                                                }</td>
                                                <td>
                                                    {(tsx.approveStatus) ? <i style={{ fontSize: '20px' }} className="icon ion-md-checkmark-circle-outline green"></i> : <i style={{ fontSize: '20px' }} className="icon ion-md-time orange"></i>}
                                                </td>
                                                <td>{(tsx.status === 'in') ? <span className="status_in">IN</span> : <span className="status_out">OUT</span>}</td>
                                                <td>{(Math.pow(10, -8) * Number(tsx.value)).toFixed(8)}</td>
                                            </tr>
                                        })
                                    }
                                    {/* <td><i className="icon ion-md-checkmark-circle-outline green"></i></td>
                                <td><i className="icon ion-md-time orange"></i></td>
                                <td><i className="icon ion-md-close-circle-outline red"></i></td> */}


                                </tbody>
                            </table>
                    }
                </div>
            </div>
        </div>
    )
}