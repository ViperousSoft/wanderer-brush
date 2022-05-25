import React from "react";
import {openurl} from "./utils"
import css from "./style.css";
export class App extends React.Component{
    render(){
        return (
            <div>
                <div>
                    <img src="./res/icon.ico" style={{verticalAlign: "middle", width: "64px", height: "64px", userSelect: "none"}} />
                    <h1 style={{display: "inline-block", verticalAlign: "middle"}}>Wanderer Brush</h1>
                </div>
                <hr/>
                <div>
                    <p>Version: 0.8.0</p>
                    <p>Author: ViperousSoft</p>
                    <p>Project site: <a href="javascript:void(0)" onClick={()=>openurl(`https://github.com/Tom-abc/wanderer-brush`)}>https://github.com/Tom-abc/wanderer-brush</a></p>
                </div>
            </div>
        );
    }
}

/*<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>About</title>
        <link href="style.css" type="text/css" rel="stylesheet">
        <script src="utils.ts" lang="ts"></script>
    </head>
    <body>
        <div>
            <img src="./res/icon.ico" style="vertical-align: middle;width: 64px;height: 64px;user-select: none;">
            <h1 style="display: inline-block;vertical-align: middle;">Wanderer Brush</h1>
        </div>
        <hr>
        <div>
            <p>Version: 0.8.0</p>
            <p>Author: ViperousSoft</p>
            <p>Project site: <a href="javascript:void(0)" onclick="openurl(`https://github.com/Tom-abc/wanderer-brush`)">https://github.com/Tom-abc/wanderer-brush</a></p>
        </div>
    </body>
</html>*/
