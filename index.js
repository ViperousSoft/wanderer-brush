const {app,BrowserWindow,ipcMain,Menu}=require("electron");
const got=require("got");
let aboutwin,win;
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
function ready(){
    
    win=new BrowserWindow({
        show:false,
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false
        }
    });

    aboutwin=new BrowserWindow({
        show:false,
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false
        },
        parent:win
    });
    aboutwin.loadFile("about.html");
    aboutwin.setMenu(null);
    seticon(aboutwin);
    aboutwin.on("close",e=>{
        e.preventDefault();
        aboutwin.hide();
    });

    let menu=Menu.buildFromTemplate([
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
            label:"Help",
            submenu:[
                {
                    label:"About",
                    click:()=>{aboutwin.show();}
                }
            ]
        }
    ]);
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
app.on("ready",ready);
app.on("window-all-closed",()=>{
    if(process.platform!=="darwin"){
        app.quit();
    }
});
