
import { RootState, store } from '../store';
import { Provider, useSelector } from 'react-redux';
import * as ReactDOM from "react-dom";
import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import {  useGraph } from '../hook/swap';
import { useAppSelector } from '../hook';
import styled from 'styled-components';
import fnconfig from '../config';
export default  memo(function Graph(){
    const {OUTPUT,INPUT} = useGraph();
    const [widget,setwidget] = useState<any>(null);
    const [chartReady,setChartReady] = useState<any>(false);
    const [lastbar,setlastbar] = useState<any>({
        close: 0,
        high: 0,
        low: 0,
        open: 0,
        time: 0,
        volume: 0,
        percent:0
    })
    useEffect(()=>{
        if(chartReady){
            console.log(`${INPUT.symbol}_${OUTPUT.symbol}`)
            widget.chart().setSymbol(`${INPUT.symbol}_${OUTPUT.symbol}`,(e:any)=>console.log(e))
        }
    },[`${INPUT.symbol}_${OUTPUT.symbol}`])
    useEffect(()=>{
        const widget = window.parent.tvWidget = window.tvWidget = new TradingView.widget(fnconfig(`${INPUT.symbol}_${OUTPUT.symbol}`,(res:any)=>{
            const {close,high,low,open,time,volume} =res.bars[res.bars.length-1]
            const {close:closelast} =  res.bars[res.bars.length-2] 
            const percent = 0;
            // const percent = (((close-closelast)/closelast)*100).toFixed(0); 

            setlastbar({close,high,low,open,time,percent})
        }));
        widget.onChartReady(function() {
            setChartReady(true)
        })
        window.widget = widget;
        setwidget(widget);
        return () =>  {
            if (widget !== null) {
                widget.remove();
                setwidget(null);
                console.log('remove Chart')
            }
        }
    },[])
    return  <div className="col-lg-8"  >
         {/* <div className="col-lg-8  " style={{display:'none'}} ></div> */}
        <GraphApp className='grap' >
        <GraphHead>
            <NameInfo>
                <LogoToken>
                    <img src={INPUT.logoURI} alt="" />
                    <img src={OUTPUT.logoURI} alt="" />
                </LogoToken>
                <ContentBarStatus className={+(lastbar.percent)<0?'r':'g'} >
                    
                    <SymbolSwap>
                        {INPUT.symbol}/{OUTPUT.symbol}
                    </SymbolSwap>
                    <BarStatus>
                        close: <span>{lastbar.close}</span>
                    </BarStatus>
                    <BarStatus>
                        high: <span>{lastbar.high}</span>
                    </BarStatus>
                    <BarStatus>
                        low:  <span>{lastbar.low}</span>
                    </BarStatus>
                    <BarStatus>
                        open: <span>{lastbar.open}</span>
                    </BarStatus>
                    <BarStatus>
                    ( <span>{lastbar.percent}%</span> )
                    </BarStatus>
                </ContentBarStatus>
            {/* {INPUT.symbol}/{OUTPUT.symbol} */}
            </NameInfo>
            <Btnfullscrenn ><svg viewBox="0 0 25 24" color="text" width="20px" xmlns="http://www.w3.org/2000/svg" ><path d="M20.497 4.6l-.004-.028-.006-.036-.008-.033-.007-.03-.012-.032-.01-.03-.014-.028-.014-.03-.016-.027-.018-.03-.021-.028-.018-.024a.663.663 0 00-.044-.048v-.001a.66.66 0 00-.049-.044l-.024-.018-.028-.02-.03-.018-.026-.016-.03-.015c-.01-.004-.02-.01-.03-.013l-.03-.011-.03-.011-.031-.008-.033-.008-.035-.005-.03-.005A.684.684 0 0019.834 4h-4.667a.667.667 0 100 1.333h3.057l-4.862 4.862a.667.667 0 10.943.943l4.862-4.862v3.057a.667.667 0 101.333 0V4.667a.658.658 0 00-.003-.066zM10.696 12.861l-4.862 4.862v-3.057a.667.667 0 10-1.333 0v4.667l.003.066.005.029.005.035.008.033.008.03.01.032.012.03.013.029.015.03.016.027.017.029.021.028.018.024a.663.663 0 00.093.093l.024.018.029.021.029.018.026.016.03.014.03.014.03.01.031.012.03.007.033.008.036.006.029.004a.657.657 0 00.066.003h4.666a.667.667 0 000-1.333H6.777l4.862-4.862a.667.667 0 00-.943-.943z"></path></svg></Btnfullscrenn>
        </GraphHead>

        <GraphcNew id="ddsadas" >
            </GraphcNew>
        </GraphApp>
        
        </div>

})
const ContentGraph = styled.div``
const ContentBarStatus = styled.div`
    display:flex;
    &.g  span{
        color: #02b156;
    }
    &.r  span{
        color: #fa6565;
    }
`


const BarStatus = styled.div`
margin-right: 10px;
color: rgb(40, 13, 95);
font-size: 16px;
font-weight: 600;
line-height: 1.5;
`



const GraphcNew = styled.div`
    padding-right: 7px;
    height:525px
`
const Btnfullscrenn = styled.button`
-webkit-box-align: center;
align-items: center;
border: 0px;
border-radius: 16px;
cursor: pointer;
display: inline-flex;
font-family: inherit;
font-size: 16px;
font-weight: 600;
-webkit-box-pack: center;
justify-content: center;
letter-spacing: 0.03em;
line-height: 1;
opacity: 1;
outline: 0px;
transition: background-color 0.2s ease 0s, opacity 0.2s ease 0s;
height: 48px;
background-color: transparent;
color: rgb(31, 199, 212);
box-shadow: none;
`
const GraphApp = styled.div`
height:75vh !important;
overflow: hidden;
padding-top: 2px;
min-height: 75vh;
& button:active {
    opacity: 0.85;
    transform: translateY(1px);
    box-shadow: none;
}
`
const SymbolSwap = styled.div`
margin-right: 25px;
color: rgb(40, 13, 95);
font-size: 16px;
font-weight: 600;
line-height: 1.5;
`
const LogoToken = styled.div`
display: flex;
flex-direction: row;
margin-right: 4px;
& img{
    max-width: 26px;
    height: auto;
    margin-right: 4px;
}
`
const NameInfo = styled.div`
    display: flex;
    -webkit-box-align: center;
    align-items: center;
`
const GraphHead = styled.div`
padding: 0 13px;
display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
`