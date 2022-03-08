
import Api from './Api';
import render from './component'
import fiatWalletrender from './component_fiat'
import swaprender from './component_swap'
// import FirstComponent from './component'
import * as ReactDOM from "react-dom";
import * as React from "react";
/// <reference path="./global/index.d.ts" />

export class MhgWallet {

    render() {
        return render()
    }
    fiatWalletrender() {
        return fiatWalletrender()
    }
    SwapRender() {
        return swaprender()
    }
    api: Api = new Api('123')
    constructor() {
    }
}

window.MHGWallet = new MhgWallet();