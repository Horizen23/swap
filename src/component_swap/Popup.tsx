import { create, values } from "lodash";
import React, { useState, useEffect, useRef } from "react";
import { addtokendb, savewallet, selectcurrency, selecttoken, selectTokendb, useAddtoken, useSaveWallet } from "../features/balance/balanceSlice";
import styled from 'styled-components';
import { useSelector } from "react-redux";
import { ButtonInport, LogoToken, Name, WrapToken } from "../component/PopupAddToken";
import { isAddress } from "ethers/lib/utils";
import { useAppDispatch } from "../hook";
import { LoaderSpinner } from "./Swap";
import { useListToken, useSwapActionHandlers, useSwapState } from "../hook/swap";
import { useApplicationHandlers, usepopupTokenlist } from "../hook/application";
import { useParams } from "react-router";
import { useBurnActionHandlers } from "../features/burn/hooks";


export default function Popup({
    Active:{
        INPUT,
        OUTPUT
    },
    hadderCLick
}:{
    Active:{
    INPUT:any
    OUTPUT:any
    },
    hadderCLick:(action:any,e:any)=>void
}
) {
    const  popup  = usepopupTokenlist()
    const [actionname,action] = popup.action.split('.');
    const  [listtoken, error, pending,inputaddress, searchToken] = useListToken()
    const {onUserChangpopup} = useApplicationHandlers()
   
    const active = (tn:any):boolean=>{
        let b = false;
        if(typeof INPUT!='string'){
            if(INPUT.symbol){
                return b;
            }else{
                if(tn.type=='native'){
                    b = (INPUT.type=='native')||(OUTPUT.type=='native'); 
                }else{
                    b = (tn.address==INPUT.key)||(tn.address==OUTPUT.key);  
                }
                return b;
            }
        }else{
            return b;
        }
    }
    function hadderCLicks(action:any,value:any){
        hadderCLick(action,value)
        onUserChangpopup(false)
    }
    const   {status:ispopupopen}  = usepopupTokenlist()
    return (
        <>
        {
         ispopupopen&&<Container >
            <Contain> 
            <ContentTitle>
                <Title >
                    <i onClick={() => { onUserChangpopup(false) }} className="ion ion-md-close"></i>
                </Title>
                <div>
                    <InputAddress type="text" placeholder="Search name or paste address" onChange={(e) => searchToken(e.target.value)} value={inputaddress} />
                </div>
                </ContentTitle>
                <ContentListToken>
                    {!pending?Object.entries(listtoken).map(([key, value]:any) =>
                                <WrapToken style={(active(value))?{opacity:'0.3'}:{}} key={key} onClick={()=>{
                                    hadderCLicks(action,value)
                                }}>
                                <LogoToken   src={value.logoURI}/>
                                <Name >
                                    <div className="symbol">{value.symbol }</div>
                                    <div className="name">{value.name}</div>
                                </Name>
                                {
                                    value.status!='active'?<Lodding></Lodding>:<p>
                                    {(Math.pow(10, -value.decimals) * value.balance).toFixed(
                                        8
                                        )}
                                      </p>
                                }
                            </WrapToken>
                    ):<Wrapload> <LoaderSpinner/></Wrapload>}
                </ContentListToken>
            </Contain>
        </Container>
        }
    </>
    )
    
}

const Wrapload = styled.div`
display: flex;
align-items: center;
justify-content: center;
margin: 15px;
`
const Lodding = styled.div `
background: linear-gradient(110deg,#ececec 8%,#f5f5f5 18%,#ececec 33%);
background-size: 200% 100%;
width: 100px ;
height: 24px;
margin-left: 10%;
border-radius: 5px;
-webkit-animation: 1.5s shine linear infinite;
animation: 1.5s shine linear infinite;

@keyframes shine{
   
    100% {
        background-position-x: -200%;
    }
  }
`
const ContentListToken = styled.div`
border-top: 1px solid #e7e7ec;
border-bottom: 1px solid #e7e7ec;
position: relative; height: 377px; width: 100%; overflow: auto; will-change: transform; direction: ltr;
`
const InputAddress = styled.input`
position: relative;
display: flex;
padding: 16px;
-webkit-box-align: center;
align-items: center;
width: 100%;
white-space: nowrap;
background: none;
outline: none;
border-radius: 20px;
color: rgb(0, 0, 0);
border: 1px solid rgb(206, 208, 217);
appearance: none;
font-size: 18px;
transition: border 100ms ease 0s;
`
const Title = styled.div`
-webkit-box-pack: justify;
justify-content: space-between;
    width: 100%;
    display: flex;
    padding: 0px;
    -webkit-box-align: center;
    align-items: center;
    & i {
        font-size: 25px;
        cursor: pointer;
    }
    & div{
        box-sizing: border-box;
        margin: 0px;
        min-width: 0px;
        font-weight: 500;
        font-size: 16px;
    }    
    
    `
const ContentTitle = styled.div`
padding: 20px;
display: grid;
grid-auto-rows: auto;
row-gap: 16px;

`
const Contain = styled.div`
background: #783232;
height: 569px;
border-radius: 11px;
box-shadow: 0 0 25px 2px rgb(0 0 0 / 13%);
background-color: #fff;
max-width: 435px;
margin: auto auto;
`
export const Container = styled.div`
    padding: 22px;
    position: fixed;
    left: 0;
    width: 100%;
    height: 100vh;
    top: 0;
    background: #783232;
    z-index: 3;
    background-color: #00000042;
`