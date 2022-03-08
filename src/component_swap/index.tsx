import { store } from '../store';
import { Provider, useSelector } from 'react-redux';
import * as ReactDOM from "react-dom";
import React, { useEffect, useState } from "react";
import Graph from './Graph';
import Popup, { Container } from './Popup'
import { useAppDispatch } from '../hook';
import { selectcurrency, useloadWallet } from '../features/balance/balanceSlice';
import styled from 'styled-components';
import { BrowserRouter,Route ,Routes, NavLink,Outlet} from "react-router-dom";
import Notification from './Notification';
import Swap from './Swap';
import ImportLiquidity from './ImportLiquidity'
import AddLiquidity from './AddLiquidity'
import Liquidiy, {  RemoveLiquidity } from './Liquidity'
function App() {
    const dispatch = useAppDispatch();
    const loadWalletHook = useloadWallet(dispatch)
    const currency = useSelector(selectcurrency)
    useEffect(() => {
        loadWalletHook(currency)
    }, []);
    
    return (
        <BrowserRouter>
            <Navbar>
                <BarButton    to='app/view/swap' >
                    Exchange
                </BarButton>
                <BarButton  to='app/view/liquidity'  >
                    Liquidity
                </BarButton>
            </Navbar>
            <Routes>
                    {/* <Route   path="app/view/swap" element={<Swap />} /> */}
                    {/* <Route   path="app/view/liquidity" element={<Liquidity />} /> */}
                    <Route path="app/view/swap" element={<WrapSwap/>} />
                    <Route path="app/view/liquidity/">
                        <Route path="import" element={<ImportLiquidity/>} />
                        <Route path="add/:address1/:address2" element={<AddLiquidity/>} />
                        <Route path="remove/:address1/:address2" element={<RemoveLiquidity/>} />

                        <Route index element={<WrapLiquidity/>} />

                    </Route>

            </Routes>
            <Notification/>

        </BrowserRouter>
    )

}

 function WrapLiquidity() {

    return (  <div className='row justify-content-md-center mt-4'>
        <Liquidiy/>
    </div>
);
}
function WrapSwap() {
        return (  <div className='row justify-content-md-center mt-4'>
    <Graph/>
    <Swap />
    </div>
  );
}
const Navbar = styled.div`
    width: 400px;
    margin: 0 auto;
    justify-content: center;
    display: flex;
    gap: 23px;
    border-radius: 10px;
    background-color: rgb(255 255 255);
    box-shadow: rgb(157 148 148) 0px -2px 3px -2px inset;
    
    
`
const BarButton = styled(NavLink)`
border-radius: 10px;
    position: relative;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    
    font-size: 16px;
    font-weight: 600;
    width: 99px;
    justify-content: center;
    height: 42px;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
    &:hover {
        background: #d3d3d3;
        color: #715a5a;
    }
    &.active{
        color: rgb(65 88 178);
    }
    &.active::after {
        content: "";
        position: absolute;
        bottom: 0px;
        height: 4px;
        width: 100%;
        background-color: rgb(185 199 255);
        border-radius: 2px 2px 0px 0px;
    }

     &a:hover, &a:focus, &a:active {
      text-decoration: none;
      color: inherit;
    }
`


export default function render() {
    return ReactDOM.render(
        <React.StrictMode>
            <Provider store={store}>
                <App />
            </Provider>
        </React.StrictMode>
        ,
        document.getElementById("swapcontent")
    )
}


