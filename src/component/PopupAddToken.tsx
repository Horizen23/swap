import { create } from "lodash";
import React, { useState, useEffect } from "react";
import { savewallet, selecttoken, selectTokendb, useAddtoken, useSaveWallet } from "../features/balance/balanceSlice";
import { selectActiveToken, toggleToken, useFidToken } from "../features/page/pageSlice";
import { useAppDispatch, useAppSelector, useCreatwallet } from "../hook";
import styled from 'styled-components';
import { isAddress } from "ethers/lib/utils";
import { useSelector } from "react-redux";
import { MhgWallet } from "..";
export default function PopupAddToken() {
    const dispatch = useAppDispatch();
    const tokendb = useSelector(selectTokendb)
    const token = useSelector(selecttoken)
    let [inputaddress, setinputaddress] = useState('')
    let [tokenlist,settokenlist] = useState(tokendb)
    const AddTokenHook  = useAddtoken(dispatch)
    function searchToken(e: any) {
        const { value } = e.target;
        var reg = new RegExp(`\\b(${value})`,'i');
        const search = tokendb.filter((e:any)=>e.symbol.match(reg)||e.name.match(reg))
        settokenlist(search)
        if(isAddress(value)){
          MHGWallet.api.erc20('0x10A3b18b7F3A5D561d3dc522940Da96f1b7CC8b1',[value]).then(function(res){
              settokenlist(res)
          })
        }   
        console.log(isAddress(value))
        setinputaddress(value)
    }
    return <Popup>
        <ContentTitle>
            <Title >
                <div  >Select a token</div>
                <i onClick={() => { dispatch(toggleToken()) }} className="ion ion-md-close"></i>
            </Title>
            <div>
                <InputAddress type="text" placeholder="Search name or paste address" onChange={(e) => searchToken(e)} value={inputaddress} />
            </div>
        </ContentTitle>
        <ContentListToken>
            <ListToken>
            {tokenlist.map((x:any, i:any) =>
                        <WrapToken style={token[x.address]&&{opacity:'0.5'}} key={x.address} >

                            <LogoToken   src={x.logoURI}/>
                            <Name >
                                <div className="symbol">{x.symbol }</div>
                                <div className="name">{x.name}</div>
                            </Name>
                            {!token[x.address]&&<ButtonInport onClick={()=>{AddTokenHook(x)}}>Import</ButtonInport>
                            }

                        </WrapToken>
                )}
            </ListToken>
            
        </ContentListToken>
    </Popup>

}
export const ButtonInport = styled.button`
background-color: rgb(28 165 96);
color: white;
padding: 6px 12px;
width: fit-content;
font-weight: 500;
text-align: center;
border-radius: 20px;
outline: none;
border: 1px solid transparent;
text-decoration: none;
display: flex;
-webkit-box-pack: center;
justify-content: center;
flex-wrap: nowrap;
align-items: center;
cursor: pointer;
position: relative;
z-index: 1;
will-change: transform;
transition: transform 450ms ease 0s;
transform: perspective(1px) translateZ(0px);
}
`
export const Name = styled.div`
display: flex;
flex-direction: column;
-webkit-box-pack: start;
justify-content: flex-start
`
export const LogoToken = styled.img`
    width: 42px;
    height: 42px;
    background: radial-gradient(white 50%, rgba(255, 255, 255, 0) calc(75% + 1px), rgba(255, 255, 255, 0) 100%);
    border-radius: 50%;
    box-shadow: white 0px 0px 1px;
    border: 0px solid rgba(255, 255, 255, 0);
`
export const WrapToken = styled.div`
    cursor: pointer;
    align-items: center;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 56px;
    display: grid;
    grid-template-columns: auto minmax(0px,1fr) auto minmax(0px,0px);
    gap: 16px;
    padding: 4px 20px;
    &:hover{
        background: #e2cece47;
    }
    &.active{

    }
    & .symbol{
        margin-bottom: 0;
        line-height: 1;
        color: #18214d;
        font-size: 16px;
        font-weight: 600;
    }
    & .name {
        margin-bottom: 0;
        line-height: 1.8;
        color: #18214d;
        font-size: 12px;
        font-weight: 400;
    }
`

export const ContentListToken = styled.div`
border-top: 1px solid #e7e7ec;
border-bottom: 1px solid #e7e7ec;
position: relative; height: 377px; width: 100%; overflow: auto; will-change: transform; direction: ltr;
`
export const ListToken = styled.div`
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    height: 900px;
    width: 100%;
    overflow: hidden;
    z-index: -1;
`
export const InputAddress = styled.input`
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
export const ContentTitle = styled.div`
padding: 20px;
display: grid;
grid-auto-rows: auto;
row-gap: 16px;

`

export const Title = styled.div`
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
export const Popup = styled.div`
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #783232;
    z-index: 3;
    width: 488px;
    height: 569px;
    border-radius: 11px;
    box-shadow: 0 0 25px 2px rgb(0 0 0 / 13%);
    background-color: #fff;
`