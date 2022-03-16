const {app,BrowserWindow,ipcMain,Menu}=require("electron");
const got=require("got");
function window(){
    let win=new BrowserWindow({
        show:false,
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false
        }
    });
    switch(process.platform){
        case "win32":
            win.setIcon(`${__dirname}/icon.ico`);
            break;
        case "linux":
            win.setIcon(`${__dirname}/icons/256x256.png`);
            break;
        default:break;
    }
    win.loadFile("index.html");
    win.once("ready-to-show",()=>{
        win.show();
    });
}
function ready(){
    let menu=Menu.buildFromTemplate([
        {
            label:"File",
            submenu:[
                {
                    label:"New Window",
                    click:window,
                    accelerator:"Ctrl+N"
                },
                {
                    label:"Exit",
                    click:()=>{app.quit();},
                    accelerator:"Ctrl+Q"
                }
            ]
        }
    ]);
    Menu.setApplicationMenu(menu);
    window();
}
ipcMain.on("got",(e,a,b)=>{
    got(`https://wanderers.io/client/server/EU/${a}/${b}`).then(r=>{
        e.sender.send("gotr",`wss://${r.body}.wanderers.io`);
    });
});
app.on("ready",ready);
app.on("window-all-closed",()=>{
    if(process.platform!=="darwin"){
        app.quit();
    }
});
