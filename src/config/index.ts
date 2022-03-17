
import {tokendb as tokendb_,factory,weth} from './testnet.json'
function getParameterByName(name:string) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
export const INIT_CODE_HASH =  "0x7e49d5a452686e20f3694c8b7da9ce371fddadafe40ae661631501370842bf9b"
export const factoryAddress =  factory
export const WrapETH =  weth
export const tokendb =  tokendb_



 function fnconfig(symbol:string,callback:any){   
    // theme overrides
    var overrides = {};
    var studies_overrides = {};
    var disabled_features:any = [
                    'use_localstorage_for_settings', 
                      "charting_library_debug_mode",
                      "caption_buttons_text_if_possible",
                      "go_to_date",
                      "timezone_menu",
                      "main_series_scale_menu",
                      "chart_crosshair_menu",
                      "pane_context_menu",
                      "scales_context_menu",
                    //   "display_market_status",
                      "scales_context_menu",
                      "timezone_menu",
                      "lock_visible_time_range_on_resize",
                      "go_to_date",
                      "timeframes_toolbar",
                      "border_around_the_chart",
    // "left_toolbar",
                      "chart-controls-bar",
                        // "volume_force_overlay"
                        , "show_logo_on_all_charts", 
                        "caption_buttons_text_if_possible", "header_settings", "header_chart_type", 
                      "header_indicators", "header_compare", "compare_symbol", "header_screenshot", 
                      "header_widget_dom_node", "header_saveload", "header_undo_redo", 
                        "header_interval_dialog_button", "show_interval_dialog_on_key_press", 
                        "header_symbol_search", "header_resolutions", "header_widget"
                    ]
                        ;

    var enabled_features:any = [];
    var library_path = "http://localhost:3000/app/assets/charting_library/";
    var theme = getParameterByName('theme') || 'light';
    var compact = getParameterByName('compact');
    var datafeed = new Datafeeds.UDFCompatibleDatafeed("https://tradingview.bitkub.com/tradingview",callback);
    // var datafeed = new Datafeeds.UDFCompatibleDatafeed("http://localhost:8443/grahp",callback);

    window.datafeed = datafeed
   

    if (theme && theme.toLowerCase() == 'dark') {
    //library_path = "charting_library_dark/";
    overrides = {
        "paneProperties.background": "#242d2e",
        "paneProperties.vertGridProperties.color": "#363c4e",
        "paneProperties.horzGridProperties.color": "#363c4e",
        "paneProperties.vertGridProperties.style": 0,
        "paneProperties.horzGridProperties.style": 0,
        "scalesProperties.textColor": "#AAA",
        //	Bar styles
        "mainSeriesProperties.barStyle.upColor": "#ef5350", // #26a69a
        "mainSeriesProperties.barStyle.downColor": "#26a69a", // #ef5350

        "mainSeriesProperties.showCountdown": true,
    };
    studies_overrides = {
        "volume.volume.color.0": "#fa6565",
        "volume.volume.color.1": "#02b156",
        "volume.volume.transparency": 70,
        "volume.volume ma.color": "#FF0000",
        "volume.volume ma.transparency": 30,
        "volume.volume ma.linewidth": 5,
        "volume.show ma": true,
        "bollinger bands.median.color": "#33FF88",
        "bollinger bands.upper.linewidth": 7,
    }
    //} else if (theme && theme.toLowerCase() == 'light') {
    } else {
    overrides = {
        "paneProperties.background": "#fff",
        "paneProperties.vertGridProperties.color": "#e6e6e6",
        "paneProperties.horzGridProperties.color": "#e6e6e6",
        "paneProperties.vertGridProperties.style": 0,
        "paneProperties.horzGridProperties.style": 0,
        // "symbolWatermarkProperties.transparency": 50,
        "scalesProperties.textColor": "#555555",
        //	Bar styles
        "mainSeriesProperties.candleStyle.barColorsOnPrevClose": true,

        // "scalesProperties.showSymbolLabels": true,
        "mainSeriesProperties.showCountdown": true,
            'mainSeriesProperties.statusViewStyle.symbolTextSource': 'ticker',
            "symbolWatermarkProperties.transparency": 61,
           "symbolWatermarkProperties.color" : "#dbd7d7",
           "scalesProperties.showStudyPlotLabels":true,

            "scalesProperties.fontSize": 11,
            "paneProperties.topMargin": 30,
            "paneProperties.bottomMargin": 43,
            'mainSeriesProperties.style':1,
    };
    studies_overrides ={
        "volume.volume.color.0": "#fa6565",
        "volume.volume.color.1": "#02b156",
        "volume.volume.transparency": 70,
        "volume.volume ma.color": "#FF0000",
        "volume.volume ma.transparency": 30,
        "volume.volume ma.linewidth": 5,
        "volume.show ma": false,
        "bollinger bands.median.color": "#33FF88",
        "bollinger bands.upper.linewidth": 7
    }
    }
    
    var config:any = {
    // debug: true, // uncomment this line to see Library errors and warnings in the console
    fullscreen: true,
    symbol,
    interval: '15',
    container_id: "ddsadas",

    //	BEWARE: no trailing slash is expected in feed URL
    // datafeed: new Datafeeds.UDFCompatibleDatafeed("https://tradingview.bitkub.com/tradingview"),
    datafeed:datafeed,
    library_path: library_path,
    locale: getParameterByName('lang') || "en",

    disabled_features:disabled_features,
    // charts_storage_url: 'https://tradingview.bitkub.com',
    // charts_storage_api_version: "1.1",
    overrides: overrides,
    studies_overrides: studies_overrides,
    // enabled_features,
    theme: theme,
    timezone: 'Asia/Bangkok',   
    autosize: true,
    custom_css_url: '/tradingview/charting_library/themed.css',

    };

    if (compact == "true") {
    // config.preset = "mobile"
    }
    return config
}
 
export default fnconfig;
