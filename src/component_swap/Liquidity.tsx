import { store } from "../store";
import { Provider, useSelector } from "react-redux";
import * as ReactDOM from "react-dom";
import React, { memo, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { BrowserRouter,Route ,Routes, NavLink,Outlet} from "react-router-dom";
import { usepari, useTrackedTokenPairs } from "../hook/pool";
import { LoaderSpinner } from "./Swap";
import { WrapStatePair } from "../features/pool/pari";

export default function Liquidity() {
  useTrackedTokenPairs()
  const pair = usepari()
  return (
    <Container >
      <TitleText>Liquidity Pool</TitleText>
      <Row>
          <p>Your  liquidity </p>
          <WrapNavLink to={`add/ETH`} >
              <svg width="33" height="26" viewBox="0 0 33 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="16" y="8" width="2" height="10" rx="1" fill="#7B6666"/>
                  <rect x="12" y="14" width="2" height="10" rx="1" transform="rotate(-90 12 14)" fill="#7B6666"/>
              </svg>
              Add  Liquidity 
          </WrapNavLink>
      </Row>  
      <Scrolla>
        {pair.status=='active'?Object.entries(pair.list).map(([key, value]:any) =>
          <ListPair key={key} pair={{key,value}}/>
        ):<LoaderSpinner style={{'margin':'0 auto'}} />}
      </Scrolla>
      <WrapNavLink className={BtbAddLiquidity} to='import' >Import Pool</WrapNavLink>
      
    </Container>
  );
}


const Scrolla =styled.div`
  overflow:scroll;
  margin-bottom: 13px;
  overflow: scroll;
  height: 100%;
`


function ListPair({pair:{key,value}}:any){
    const [isActiveManage,setisActiveManage] = useState(false)
    const pair = new WrapStatePair(value)
    let percentpool = pair.getpercent();
    return <div>
    <PairInfo onClick={()=>{{setisActiveManage(!isActiveManage)}}}>
      <Nameinfo>
        <div className="imageInfo">
          <img src={value.token0.logoURI} />
          <img src={value.token1.logoURI} />
        </div>
        <div> {value.token0.symbol}/{value.token1.symbol} </div>
      </Nameinfo>
        <ManageTogle >
            <div>Manage</div>
            <svg className={isActiveManage?'active':''} width="41" height="23" viewBox="0 0 41 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.8377 8.69269C13.3751 8.13093 13.4554 7.30048 14.0172 6.83782V6.83782C14.5789 6.37516 15.4094 6.45549 15.872 7.01725L22.5738 15.1545C23.0364 15.7162 22.9561 16.5467 22.3943 17.0093V17.0093C21.8326 17.472 21.0021 17.3917 20.5395 16.8299L13.8377 8.69269Z" fill="#516AE4"/>
              <path d="M29.1623 8.69269C29.6249 8.13093 29.5446 7.30048 28.9828 6.83782V6.83782C28.4211 6.37516 27.5906 6.45549 27.128 7.01725L20.4262 15.1545C19.9636 15.7162 20.0439 16.5467 20.6057 17.0093V17.0093C21.1674 17.472 21.9979 17.3917 22.4605 16.8299L29.1623 8.69269Z" fill="#516AE4"/>
          </svg>
        </ManageTogle>
    </PairInfo>
    {isActiveManage&&<ManagePari >
            <div>
                <p>Your total pool tokens:</p>
                <p>{value.balanceOf*1e-18}</p>
            </div>
            <div>
                <p>Pooled  {value.token0.symbol}:</p>
                <p>{pair.balanceReservesA()*1e-18}</p>
            </div>
            <div>
                <p>Pooled {value.token1.symbol}:</p>
                <p>{pair.balanceReservesB()*1e-18}</p>
            </div>
            <div>
                <p>Your pool share:</p>
                <p>{percentpool.toFixed(2)} %</p>
            </div>
            <div>
              <Btnaddandremove to={`add/${pair.getKey()[0]}/${pair.getKey()[1]}`}>
                Add
              </Btnaddandremove>
              <Btnaddandremove to={`remove/${pair.getKey()[0]}/${pair.getKey()[1]}`}>
                Remove
              </Btnaddandremove>
            </div>
      </ManagePari>}
    </div> 
}
const Btnaddandremove = styled(NavLink)`
background: #2A47B8;
border-radius: 11px;
color: #FFFFFF;
padding: 8px 26px;
border: 0;
margin-left: 15px;
&:hover {
   color: #FFFFFF;
   text-decoration: none;
}
&:active {
  opacity: 0.85;
  -webkit-transform: translateY(3px);
  -ms-transform: translateY(3px);
  -webkit-transform: translateY(3px);
  -ms-transform: translateY(3px);
  transform: translateY(3px);
  box-shadow: none;
}
`
const ManagePari = styled.div`
width: 100%;
left: 233px;
top: 440px;
background: #F0F3FF;
padding: 18px;
border: 1px solid #516AE4;
box-sizing: border-box;
border-radius: 16px;
& div:not(:last-child) {
  display:flex;
  justify-content: space-between;
  color: #4A4A4A;
  font-weight: 500;
  font-size: 15px;
}
& p{
  margin:0;
} 
& div:last-child{
  display: flex;
  justify-content: flex-end;
  margin-top: 17px;
}
`

const ManageTogle = styled.div`
display: flex;
font-size: 15px;
font-weight: bold;
line-height: -12px;
color: #516AE4;
& svg.active{
  animation: 0.5s ManageTogle-awrow-active 0s forwards;
}
svg{
  animation: 0.5s ManageTogle-awrow-noactive 0s forwards;
}

@keyframes ManageTogle-awrow-noactive {
  from {
    transform: rotateX(180deg);
  }
  to {
    transform: rotateX(0deg);
  }
}
@keyframes ManageTogle-awrow-active {
  to {
    transform: rotateX(180deg);
  }
}
`
const Nameinfo = styled.div`
display: flex;
& .imageInfo{
    width: 61px;
    height: 30px;
    position: relative;
} img{
  position: absolute;
  width: 30px;
}
& img:first-child{
  z-index: 2;
}
& img:last-child{
  left: 20px;
}
& div:last-child{
  color: #6E6060;
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  text-align: center;
  margin-left: 14px;
}
`
const PairInfo = styled.div`
user-select: none;
  background: rgba(223, 213, 213, 0.19);
  border-radius: 31px;
  cursor: pointer;
  -webkit-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 76px;
  display: flex;
  justify-content: space-between;
  margin-bottom:10px;
  padding: 4px 20px;
  & div{
    align-items: center;
  }
`
export const Row = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  text-align: center;
  color: #6E6060;
  justify-content: space-between;
  color: #6E6060;
  font-weight: 700;
  font-size: 12.5px;
  line-height: 32px;
  margin-bottom:25px;
  & p{
    margin: 0;
    font-size: 15px;
  }
`;

const BtbAddLiquidity = styled.div`
justify-content: center;
display: flex;
align-items: center;
background: #F0F3FF;
padding: 9px;
cursor: pointer;
border-radius: 11px;
color: #6E6060;
font-weight: 700;
font-size: 12.5px;
line-height: 32px;
`;
export const WrapNavLink =  styled(NavLink)`
justify-content: center;
display: flex;
align-items: center;
background: #F0F3FF;
padding: 9px;
cursor: pointer;
border-radius: 11px;
color: #6E6060;
font-weight: 700;
font-size: 12.5px;
line-height: 32px;
`;
export const TitleText = styled.div`
align-self: center;
font-weight: bold;
font-size: 18px;
line-height: 16px;
display: flex;
align-items: center;
text-align: center;
color: #4A4A4A;

`;
export const Container = styled.div`
margin:  0 15px 0 15px;
  width: 712px;
  height: 608px;
  background-color: var(--color-bg);
  color: var(--color-tx2);
  background-color: var(--color-bg);
  box-shadow: 0 0 25px 2px rgb(0 0 0 / 5%);
  display: flex;
  padding: 25px 10px;
  border-radius: 10px;
  flex-direction: column;
//   max-width: 400px;
  min-width: 356px;
  border-radius: 30px;
  padding: 30px;
  overflow: hidden;
  z-index: 1;
`;