import React from "react";
import ReactDOM from "react-dom/client";
import {Sidebar} from "./sidebar";
import {openurl} from "./utils";
class App extends React.Component<{},{}>{
    render(){
        return (
            <div>
                <div style={{display: "grid", gridTemplateColumns: "1fr 3fr", width: "100%"}}>
                    <Sidebar style={{borderRight: "1px solid grey"}} content="con">
                        Introduction
                        Generating Bots
                    </Sidebar>
                    <div id="con" className="content">
                        <div>
                            <h1>Introduction</h1>
                            <p>Wanderer Brush is a tool with which you can do whatever you want in the <a href="javascript:void(0)" onClick={()=>openurl('https://wanderers.io')}>wanderers.io</a> game.</p>
                            <p>So far, generating robot players is the only available function.</p>
                            <p>To learn more, click a menu item on the left.</p>
                        </div>
                        <div>
                            <h1>Generating Bots</h1>
                            <p>This function helps you dominate the map.</p>
                            <p>The group name and tribe name you enter will be exactly send to the server. If you leave the group name empty, lots of red and brown players will spawn. If you leave the tribe name empty, the bots' names will be like 'Tribe12345', the same as a random name given to the player when the group name is not specified.</p>
                            <p>If you don't see any bot tribe when running this function, press F12 in your browser and open the console. Enter <i>CLIENT.Game.socket.url</i> and see if the output is identical to the fetched WebSocket URL. If so, just wait. If not so, you have to fill in the item with the URL shown in your browser.</p>
                            <p>Don't generate bots too frequently on one computer, or you risk being disconnected.</p>
                            <p>The number in <span style={{color:"green"}}>green</span> indicates how many workers have successfully closed, with a bot generated in the map. The number in <span style={{color:"grey"}}>grey</span> indicates how many workers have been manually closed by the server or user.</p>
                            <p>Note that you have to open at least one tab in your browser to ensure the bots join the correct team.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
ReactDOM.createRoot(document.getElementById("app")!).render(<App/>);

/*<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Help</title>
        <link href="style.css" type="text/css" rel="stylesheet">
        <script src="sidebar.ts" lang="ts"></script>
        <script src="utils.ts" lang="ts"></script>
    </head>
    <body>
        
        <div style="display: grid; grid-template-columns: 1fr 3fr; width: 100%;">
            <ul style="border-right: 1px solid grey;" class="sidebar" content="con">
                <li><a>Introduction</a></li>
                <li><a>Generating Bots</a></li>
            </ul>
            <div id="con" class="content">
                <div>
                    <h1>Introduction</h1>
                    <p>Wanderer Brush is a tool with which you can do whatever you want in the <a href="javascript:void(0)" onclick="openurl('https://wanderers.io')">wanderers.io</a> game.</p>
                    <p>So far, generating robot players is the only available function.</p>
                    <p>To learn more, click a menu item on the left.</p>
                </div>
                <div>
                    <h1>Generating Bots</h1>
                    <p>This function helps you dominate the map.</p>
                    <p>The group name and tribe name you enter will be exactly send to the server. If you leave the group name empty, lots of red and brown players will spawn. If you leave the tribe name empty, the bots' names will be like 'Tribe12345', the same as a random name given to the player when the group name is not specified.</p>
                    <p>If you don't see any bot tribe when running this function, press F12 in your browser and open the console. Enter <i>CLIENT.Game.socket.url</i> and see if the output is identical to the fetched WebSocket URL. If so, just wait. If not so, you have to fill in the item with the URL shown in your browser.</p>
                    <p>Don't generate bots too frequently on one computer, or you risk being disconnected.</p>
                    <p>The number in <span style="color: green;">green</span> indicates how many workers have successfully closed, with a bot generated in the map. The number in <span style="color: grey;">grey</span> indicates how many workers have been manually closed by the server or user.</p>
                    <p>Note that you have to open at least one tab in your browser to ensure the bots join the correct team.</p>
                </div>
            </div>
            
        </div>
    </body>
</html>*/
