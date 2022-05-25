import {app,BrowserWindow,ipcMain,Menu} from "electron";
import got from "got";
import icon from "./res/icon.ico";
import png from "./res/icons/256x256.png";
const ready=()=>{
    const win=new BrowserWindow({
        show:false,
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false
        }
    });
    const aboutwin=new BrowserWindow({
        show:false,
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false
        },
        parent:win,
        minimizable:false,
        maximizable:false
    });
    const helpwin=new BrowserWindow({
        show:false,
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false
        },
        parent:win,
        minimizable:false,
        maximizable:false
    });
    const menu=Menu.buildFromTemplate([
        {
            label:"File",
            submenu:[
                {
                    label:"Exit",
                    click:()=>{app.quit();},
                    accelerator:"Ctrl+Q"
                }
            ]
        },
        {
            label:"Run",
            submenu:[
                {
                    label:"Start",
                    click:()=>{win.webContents.send("start")},
                    accelerator:"Ctrl+S",
                    id:"start"
                },
                {
                    label:"Stop",
                    click:()=>{win.webContents.send("stop")},
                    accelerator:"Ctrl+T",
                    id:"stop",
                    enabled:false
                }
            ]
        },
        {
            label:"Help",
            submenu:[
                {
                    label:"Help",
                    click:()=>{helpwin.show();},
                    accelerator:"Ctrl+H"
                },
                {
                    label:"About",
                    click:()=>{aboutwin.show();}
                }
            ]
        }
    ]);
    function seticon(win:BrowserWindow){
        switch(process.platform){
            case "win32":
                win.setIcon(icon);
                break;
            case "linux":
                win.setIcon(png);
                break;
            default:break;
        }
    }
    {

        aboutwin.loadFile("about.html");
        aboutwin.setMenu(null);
        seticon(aboutwin);
        aboutwin.on("close",e=>{
            e.preventDefault();
            aboutwin.hide();
        });

        helpwin.loadFile("help.html");
        helpwin.setMenu(null);
        seticon(helpwin);
        helpwin.on("close",e=>{
            e.preventDefault();
            helpwin.hide();
        });

        win.loadFile("index.html");
        //win.setMenu(menu);
        seticon(win);
        win.once("ready-to-show",()=>{
            win.show();
        });
    }
    ipcMain.on("got",(e,a,b)=>{
        got(`https://wanderers.io/client/server/EU/${a}/${b}`).then(r=>{
            e.sender.send("gotr",`wss://${r.body}.wanderers.io`);
        });
    });
    ipcMain.on("tostop",()=>{
        let k=menu.getMenuItemById("stop")!;
        k.enabled=true;
    });
    ipcMain.on("started",()=>{
        let k=menu.getMenuItemById("start")!;
        k.enabled=false;
    });
    ipcMain.on("stopping",()=>{
        let k=menu.getMenuItemById("stop")!;
        k.enabled=false;
    });
    ipcMain.on("stopped",()=>{
        let k=menu.getMenuItemById("start")!;
        k.enabled=true;
    });
}
app.on("ready",ready);
app.on("window-all-closed",()=>{
    if(process.platform!=="darwin"){
        app.quit();
    }
});
