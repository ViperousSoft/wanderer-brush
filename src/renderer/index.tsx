import React from "react";
import ReactDOM from "react-dom";
import {start} from "./script"
class App extends React.Component{
    render(){
        StyleSheet
        return (
            <div>
                <button id="start" onClick={()=>start()}>Start</button>
                <button id="stop" onClick={()=>stop()} disabled={true}>Stop</button>
                <span id="msg" className="statusbar"></span>
                <span id="progbar" className="progbar nodisplay" style={{width:"100px"}} ><span id="prog" className="proggreen">&nbsp;</span><span id="prog2" className="proggrey">&nbsp;</span></span>
                <span id="prognum" className="nodisplay"></span>
                <hr/>
                Mode
                <br/>
                <input type="radio" name="mode" id="castle" checked={true}/>Castle
                <input type="radio" name="mode"/>Tribes
                <br/>
                Group Name
                <br/>
                <input id="gn" type="text"/>
                <br/>
                Tribe Name
                <br/>
                <input id="tn" type="text"/>
                <br/>
                WebSocket URL
                <br/>
                <input id="wsurl" type="text"/>
                <br/>
                <span style={{color:"red"}}>*</span>Interval
                <br/>
                <input id="cnt" type="number" min="1"></input>
            </div>
        );
    }
}



/*<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Wanderer Brush</title>
        <link href="style.css" type="text/css" rel="stylesheet">
        <link href="statusbar.css" type="text/css" rel="stylesheet">
        <script src="support.js"></script>
        
        <script src="script.ts" lang="ts"></script>
    </head>
    <body style="user-select: none;">
        <button id="start" onclick="start()">Start</button>
        <button id="stop" onclick="stop()" disabled>Stop</button>
        <span id="msg" class="statusbar"></span>
        <span id="progbar" class="progbar" style="width: 100px;" nodisplay><span id="prog" class="proggreen">&nbsp;</span><span id="prog2" class="proggrey">&nbsp;</span></span>
        <span id="prognum" nodisplay></span>
        <hr>
        Mode
        <br>
        <input type="radio" name="mode" id="castle" checked="checked">Castle
        <input type="radio" name="mode">Tribes
        <br>
        Group Name
        <br>
        <input id="gn" type="text">
        <br>
        Tribe Name
        <br>
        <input id="tn" type="text">
        <br>
        WebSocket URL
        <br>
        <input id="wsurl" type="text">
        <br>
        <span style="color: red;">*</span>Interval
        <br>
        <input id="cnt" type="number" min="1">
    </body>
</html>*/
