

class Api {
    // url: string = "http://localhost:8443/";
    url: string = "https://pp025.xyz:8443";

    urllndhub: string = "https://pp025.xyz:3002/";
    #passphases: string | number
    constructor(passphases: string | number) {
        this.#passphases = passphases
    }

    
    async CreateWallet(type: argCreatewallet): Promise<{ address: string, mnemonic: string, network: string, privateKey: string }> {
        return new Promise((res, rej) => {
            let request: RequestApi;
            if (type !== 'LBTC') {
                request = {
                    url: `${this.url}${(type == 'BTC') ? "CreateBTCwallet" : 'createETHwallet'}`,
                    // url: `${this.url}${(type == 'BTC') ? "CreateBTCwallet" : 'createETHwallet'}`,
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                }
            } else {
                request = {
                    url: `${this.urllndhub}create`,
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                }
            }
            window.$.ajax(request).done(function (response: any) {
                res(response)
            }).fail((error: any) => rej(error))
        });
    }



    async BalanceAll(): Promise<any> {
        return Promise.all([
            this.BalanceOf('0xeE1e67dbDB69cc2dB63a64CBb3E56A510103c152', 'ETH'),
            this.BalanceOf('1Mx3EZjKUQ6YSkc27W4rWaDtjYe7GXf5wS', 'BTC'),
        ]).then(([ETH, BTC]) => ({ ETH: ETH.data.balance, BTC: BTC.data.balance }))
    }
    async BalanceOf(address: string, type: argtype | string, auth: string = ''): Promise<any> {
        return new Promise((res, rej) => {
            let request: RequestApi;
            if (type === 'LBTC') {
                request = {
                    "url": `${this.urllndhub}balance`,
                    "method": "GET",
                    "headers": {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "authorization": auth
                    },
                };
            } else if (type === 'ETH') {
                request = {
                    "url": `${this.url}currency?address=${address}`,
                    "method": "POST",
                    "headers": {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            }
            else {
                request = {
                    "url": `${this.url}getBalance`,
                    "method": "POST",
                    "headers": {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    "data": {
                        "address": address,
                        "typeWallet": type,
                    }
                };
            }
            window.$.ajax(request).done(function (response: any) {
                if (type === 'LBTC') {
                    res({
                        "data": {
                            "balance": response.BTC.AvailableBalance
                        }
                    })
                } else {
                    res(response)
                }
            }).fail((error: any) => rej(error))
        })
    }
    async erc20(address: string, tokenaddress: [any]): Promise<any> {
        return new Promise((res, rej) => {
            var request: RequestApi = {
                url: `${this.url}erc20?address=${address}`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify(tokenaddress),
            };
            window.$.ajax(request).done(function (response: any) {
                res(response)
            }).fail((error: any) => rej(error))
        })
    }
    async getUserData(): Promise<any> {
        return new Promise((res, rej) => { })
    }
    async erc20transfer(): Promise<any> {
        return new Promise((res, rej) => { })
    }
    async erc20approve(address:string): Promise<any> {
        return new Promise((res, rej) => {
            const { privateAddress } = this.#getseed('ETH') as Seed
            const request: RequestApi = {
                "url": `${this.url}erc20/approve`,
                "method": "POST",
                "headers": {
                       "private-key": privateAddress,
                        "Content-Type": "application/json"
                },
                "data": JSON.stringify({
                    address
                }),
            };
            window.$.ajax(request).done(function (response: any) {
                res(response)
            }).fail((error: any) => rej(error))
        })
    }
    async currency(): Promise<any> {
        return new Promise((res, rej) => {
            const request: RequestApi = {
                "url": `${this.url}currency?address=0xeE1e67dbDB69cc2dB63a64CBb3E56A510103c152`,
                "method": "GET",
                "headers": {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
            };
            window.$.ajax(request).done(function (response: any) {
                res(response)
            }).fail((error: any) => rej(error))
        })
    }
    async sendBitcoinTransaction(): Promise<any> {
        return new Promise((res, rej) => { })
    }
    #getseed(type: argtype): Seed | false {
        const encode = localStorage.getItem(`${type}-WalletData`);
        if (encode) {
            const decode = code.decryptMessage(encode, `${this.#passphases}`)
            if (decode) {
                return decode
            }
        }
        return false
    }
    async trenfer(symbol: argtype, amount: number, sendto: String): Promise<any> {
        return new Promise((res, rej) => {
            let settings = {};
            if (symbol == 'ETH') {
                const { privateAddress } = this.#getseed('ETH') as Seed
                settings = {
                    "url": `${this.url}sendEther`,
                    "method": "POST",
                    "headers": {
                        "private-key": privateAddress,
                        "Content-Type": "application/json"
                    },
                    "data": JSON.stringify({
                        "sendto": sendto,
                        "amount": amount,
                    }),
                };
                window.$.ajax(settings).done(function (response: any) {
                    res(response)
                });
            } else if (symbol == 'BTC') {
                const { privateAddress, publicAddress } = this.#getseed('BTC') as Seed

                settings = {
                    "url": `${this.url}sendBitcoinTransaction`,
                    "method": "POST",
                    "headers": {
                        "x-api-key": privateAddress,
                        "Content-Type": "application/json"
                    },
                    "data": JSON.stringify({
                        "sourceAddress": publicAddress,
                        "toAddress": sendto,
                        "amountToSend": amount,
                        // "network": "BTCTEST",
                    }),
                };
                window.$.ajax(settings).done(function (response: any) {
                    console.log(response)
                    res(response)
                });
            }
        })
    }
    async swap(userData:any): Promise<any> {
        return new Promise((res, rej) => { 
        const { privateAddress } = this.#getseed('ETH') as Seed
            var settings = {
                "url": `${this.url}/swap`,
                "method": "POST",
                "timeout": 0,
                "headers": {
                  "Content-Type": "application/json",
                  "private-key": privateAddress,
                },
                "data": JSON.stringify(userData),
              };
              
              window.$.ajax(settings).done(function (response: any) {
                res(response)
            });

        })
    }
    async permitapprove(userData:{
        pairAddress:string,
        lpvalue:string,
        tokenAddress:string

    }): Promise<any> {
        return new Promise((res, rej) => { 
        const { privateAddress } = this.#getseed('ETH') as Seed
            var settings = {
                "url": `${this.url}approvepermit`,
                "method": "POST",
                "timeout": 0,
                "headers": {
                  "Content-Type": "application/json",
                  "private-key": privateAddress,
                },
                "data": JSON.stringify(userData),
              };
              
              window.$.ajax(settings).done(function (response: any) {
                res(response)
            });

        })
    }
    async allowancePari(data:any): Promise<any> {
        return new Promise((res, rej) => { 
        const { privateAddress } = this.#getseed('ETH') as Seed
            var settings = {
                "url": `${this.url}allowancePari`,
                "method": "POST",
                "timeout": 0,
                "headers": {
                  "Content-Type": "application/json",
                  "private-key": privateAddress,
                },
                "data": JSON.stringify(data),
              };
              
              window.$.ajax(settings).done(function (response: any) {
                res(response)
            });

        })
    }
    async trackedPairs(data:any): Promise<any> {
        return new Promise((res, rej) => { 
        const { privateAddress } = this.#getseed('ETH') as Seed
            var settings = {
                "url": `${this.url}trackedPairs`,
                "method": "POST",
                "timeout": 0,
                "headers": {
                  "Content-Type": "application/json",
                  "private-key": privateAddress,
                },
                "data": JSON.stringify(data),
              };
              
              window.$.ajax(settings).done(function (response: any) {
                res(response)
            });

        })
    }
    async addliquidity(data:any): Promise<any> {
        return new Promise((res, rej) => { 
            const { privateAddress } = this.#getseed('ETH') as Seed
                var settings = {
                    "url": `${this.url}addLiquidity`,
                    "method": "POST",
                    "timeout": 0,
                    "headers": {
                      "Content-Type": "application/json",
                      "private-key": privateAddress,
                    },
                    "data": JSON.stringify(data),
                  };
                  window.$.ajax(settings).done(function (response: any) {
                    console.log(response)
                    res(response)
                });
            })
    }

    async getTransaction(address: string, typeWallet: string): Promise<any> {
        return new Promise((res, rej) => {

            let responseData: Itransaction = [];

            if (typeWallet === 'BTC') {

                const request: RequestApi = {
                    url: `${this.url}getBitcoinTransaction`,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    data: JSON.stringify({
                        "address": address,
                    })
                };
                window.$.ajax(request).done(function (response: any) {
                    let comfirmedTxs: Array<object> = [];
                    let penddingTxs: Array<object> = [];
                    console.log('typeWallet', typeWallet)

                    if (response.txrefs) {
                        (response.txrefs).forEach((txs: any) => {
                            txs.date = new Date(txs.confirmed);
                        });
                        comfirmedTxs = response.txrefs;
                        // comfirmedTxs = (comfirmedTxs.sort((a: any, b: any) => a.value - b.value));
                    }
                    if (response.unconfirmed_txrefs) {
                        (response.unconfirmed_txrefs).forEach((txs: any) => {
                            txs.date = new Date(txs.received);
                        });
                        penddingTxs = response.unconfirmed_txrefs;
                    }
                    let TransactionArray: Array<object> = penddingTxs.concat(comfirmedTxs);


                    let objArr: any = TransactionArray;
                    let temp: any = {};
                    let obj: any = null;
                    let lastvalue: any;
                    let lasthash: any = "";
                    for (let i = 0; i < objArr.length; i++) {

                        obj = objArr[i];
                        if (!temp[obj.tx_hash]) {
                            temp[obj.tx_hash] = obj;
                            if (i > 1 && lasthash !== '') {
                                temp[lasthash].value -= lastvalue * 2;
                                lastvalue = '';
                                lasthash = '';
                            }
                            temp[obj.tx_hash].status = 'in';

                        } else {
                            lastvalue = obj.value;
                            lasthash = obj.tx_hash;
                            temp[obj.tx_hash].value += obj.value;
                            temp[obj.tx_hash].status = 'out';
                        }

                        if (temp[obj.tx_hash].received) {
                            temp[obj.tx_hash].approveStatus = false;
                        } else {
                            temp[obj.tx_hash].approveStatus = true;
                        }
                    }
                    var result: any = [];
                    for (var prop in temp)
                        result.push(temp[prop]);


                    TransactionArray = (result.sort((a: any, b: any) => b.date - a.date)).splice(0, 10);

                    // res(result)
                    TransactionArray.forEach((txs: any) => {
                        responseData.push({
                            tx_hash: txs.tx_hash,
                            url: `https://www.blockchain.com/btc-testnet/tx/${txs.tx_hash}`,
                            value: Math.abs(txs.value),
                            spent: txs.spent,
                            date: txs.date,
                            status: txs.status,
                            approveStatus: txs.approveStatus
                        })
                    })
                    res(responseData);
                }).fail((error: any) => rej(error))

            } else if (typeWallet === 'LBTC') {
                // setTimeout(function () { res([]); }, 800);
                const { LBTCaccess_token } = this.#getseed('LBTC') as LBTCseed
                var request: RequestApi = {
                    url: `${this.urllndhub}getuserinvoices?limit=10`,
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": LBTCaccess_token
                    },
                };
                window.$.ajax(request).done(function (response: any) {
                    res(response.reverse())
                }).fail((error: any) => rej(error))
            } else if (typeWallet === 'ETH') {
                setTimeout(function () { res([]); }, 800);
            }
        })
    }


    async authLBTC(login: string, password: string): Promise<any> {
        return new Promise((res, rej) => {
            var request: RequestApi = {
                url: `${this.urllndhub}auth`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify({
                    login, password
                }),
            };
            window.$.ajax(request).done(function (response: any) {
                res(response)
            }).fail((error: any) => rej(error))
        })
    }

    async getLBTCaddress(auth: string): Promise<any> {
        return new Promise((res, rej) => {
            var request: RequestApi = {
                url: `${this.urllndhub}getbtc`,
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": auth
                },

            };
            window.$.ajax(request).done(function (response: any) {
                res(response)
            }).fail((error: any) => rej(error))
        })
    }


    async createInvoice(amount: number): Promise<any> {
        return new Promise((res, rej) => {
            const { LBTCaccess_token } = this.#getseed('LBTC') as LBTCseed
            var request: RequestApi = {
                url: `${this.urllndhub}addinvoice`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": LBTCaccess_token
                },
                data: JSON.stringify({
                    amt: amount
                }),

            };
            window.$.ajax(request).done(function (response: any) {
                res(response)
            }).fail((error: any) => rej(error))
        })
    }

    async payInvoice(invoiceHash: string, freeAmount: number = 0): Promise<any> {
        return new Promise((res, rej) => {
            const { LBTCaccess_token } = this.#getseed('LBTC') as LBTCseed
            var request: RequestApi = {
                url: `${this.urllndhub}payinvoice`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": LBTCaccess_token
                },
                data: JSON.stringify({
                    invoice: invoiceHash,
                    freeAmount: freeAmount
                }),

            };
            window.$.ajax(request).done(function (response: any) {
                res(response)
            }).fail((error: any) => {
                // rej(error)
                res(error)
            })
        })
    }
    async savelogin(keyname: string, msgToEncryptJson: any) {
        return new Promise((res, rej) => {
            try {
                const msgToEncrypt = JSON.stringify(msgToEncryptJson);
                const encryptMessage = code.encryptMessage(msgToEncrypt, `${this.#passphases}`);
                localStorage.setItem(keyname + '-WalletData', encryptMessage);
                res(msgToEncryptJson)
            } catch (error) {
                res(false)
            }
        })



    }

    async getUserBalance(): Promise<any> {
        return new Promise((res, rej) => {
            var request: RequestApi = {
                url: `${this.url}getUserData`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify({
                    userId: getCookie('userid')
                }),

            };
            window.$.ajax(request).done(function (response: any) {
                res(response)
            }).fail((error: any) => rej(error))
        })
    }
    async getAmountsSwap(part:string[]): Promise<any> {
        return new Promise((res, rej) => {
            var request: RequestApi = {
                url: `${this.url}getAmounts`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    amout: "1000000000000000000",
                    part
                }),
            };
            window.$.ajax(request).done(function (response: any) {
                res(response)
            }).fail((error: any) => rej(error))
        })
    }
    async searchRouterPart(tokenA:any,tokenB:any,amount:string,type:any,account:string): Promise<any> {
        return new Promise((res, rej) => {
            if(amount==''||amount=='0'){
                rej({error:'amount not'})
                return;
            }
            var request: RequestApi = {
                // url: `${this.url}searchRouter`,
                url: `${this.url}searchRouter`,

                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    tokenA:{...tokenA,address:tokenA.key},
                    tokenB:{...tokenB,address:tokenB.key},
                    amount,
                    type,
                    account
                }),
            };
            window.$.ajax(request).done(function (response: any) {
                res(response)
            }).fail((error: any) => rej(error))
        })
    }
    async getTransactionFiatWallet(): Promise<any> {
        return new Promise((res, rej) => {
            var request: RequestApi = {
                url: `${this.url}getTransactionFiatWallet`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify({
                    userId: getCookie('userid'),
                    limit: 10
                }),

            };
            window.$.ajax(request).done(function (response: any) {
                res(response)
            }).fail((error: any) => rej(error))
        })
    }

    async createPaymentTransactionFiat(SelectBank: string, Accountnumber: string, amountToPayment: string): Promise<any> {
        return new Promise((res, rej) => {
            var request: RequestApi = {
                url: `${this.url}createTransactionFiatWallet`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify({
                    userId: getCookie('userid'),
                    isTopup: 'false',
                    amount: amountToPayment,
                    bankName: SelectBank,
                    bankAccount: Accountnumber
                }),
            };
            window.$.ajax(request).done(function (response: any) {
                res(response)
            }).fail((error: any) => rej(error))
        })
    }



    async recoveryBTCwallet(recoveryMnemonic:string): Promise<any> {
        return new Promise((res, rej) => {
            var request: RequestApi = {
                url: `${this.url}recoveryBTCwallet`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify({
                    recoveryMnemonic: recoveryMnemonic
                }),

            };
            window.$.ajax(request).done(function (response: any) {
                res(response)
            }).fail((error: any) => rej(error))
        })
    }


    async recoveryLBTCwallet(LBTCseed:string): Promise<any> {
        return new Promise((res, rej) => {
            var request: RequestApi = {
                url: `${this.url}recoveryBTCwallet`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify({
                    recoveryMnemonic: LBTCseed
                }),

            };
            window.$.ajax(request).done(function (response: any) {
                res(response)
            }).fail((error: any) => rej(error))
        })
    }






    loadwallet(encodest: string) {
        try {
            const decode = code.decryptMessage(encodest, `${this.#passphases}`)
            return decode;
        } catch (error) {
            return false            
        }
    }
    getwallet(keyname: string) {
        console.log(localStorage.getItem(keyname))
        const decode = code.decryptMessage(localStorage.getItem(keyname + '-WalletData'), `${this.#passphases}`)
        return decode;
    }
}

export = Api