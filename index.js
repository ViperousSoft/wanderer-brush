const {app,BrowserWindow,ipcMain,Menu}=require("electron");
const got=require("got");
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
                    label:"About",
                    click:()=>{aboutwin.show();}
                }
            ]
        }
    ]);
    function seticon(win){
        switch(process.platform){
            case "win32":
                win.setIcon(`${__dirname}/icon.ico`);
                break;
            case "linux":
                win.setIcon(`${__dirname}/icons/256x256.png`);
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

        win.loadFile("index.html");
        win.setMenu(menu);
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
        menu.getMenuItemById("stop").enabled=true;
    });
    ipcMain.on("started",()=>{
        menu.getMenuItemById("start").enabled=false;
    });
    ipcMain.on("stopped",()=>{
        menu.getMenuItemById("stop").enabled=false;
        menu.getMenuItemById("start").enabled=true;
    });
}
app.on("ready",ready);
app.on("window-all-closed",()=>{
    if(process.platform!=="darwin"){
        app.quit();
    }
});
