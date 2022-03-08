import { store } from '../store';
import { Provider, useSelector } from 'react-redux';
import * as ReactDOM from "react-dom";
import  React,{useEffect, useState} from "react";
import Yourwallets from './Yourwallets';
import Balances from './Balances';
import Login from './Login';
import { useAppDispatch, useAppSelector } from '../hook';
import { selectcurrency, useloadWallet } from '../features/balance/balanceSlice';
import { selectActiveToken, selectPopuoAddToken, toggleToken, useFidToken } from '../features/page/pageSlice';
import styled from 'styled-components';
import PopupAddToken from './PopupAddToken';

function App(){
    const active = useAppSelector(selectActiveToken)
    const currency = useAppSelector(selectcurrency)
    const PopuoAddToken = useAppSelector(selectPopuoAddToken)
    const {status} =  useFidToken(active)
    const dispatch = useAppDispatch();
    const loadWalletHook = useloadWallet(dispatch)
    useEffect(() => {
        loadWalletHook(currency)
      }, []);
    return <div className="row">
                {
                    PopuoAddToken&&
                    <WrapPopup >
                        <PopupAddToken/>
                    </WrapPopup>
                }
                <Yourwallets /> 
                {
                    status=='idle'
                    ?
                    <Login/>
                    :
                    <Balances/>
                }
        </div>
}

const WrapPopup = styled.div`
    position: fixed;
    left: 0;
    width: 100%;
    height: 100vh;
    top: 0;
    background: #783232;
    z-index: 3;
    background-color: #00000042;
`

export default function render() {
  return    ReactDOM.render(
          <React.StrictMode>
              <Provider store={store}>
                  <App/>
              </Provider>
          </React.StrictMode>
          ,
          document.getElementById("MHGwallet")
      )
}
