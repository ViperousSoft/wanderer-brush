const {app,BrowserWindow,ipcMain,Menu}=require("electron");
const got=require("got");
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
function aboutwindow(parent){
    let win=new BrowserWindow({
        show:false,
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false
        },
        parent:parent
    });
    win.loadFile("about.html");
    win.setMenu(null);
    seticon(win);
    win.once("ready-to-show",()=>{
        win.show();
    });
}
function mainwindow(){
    let win=new BrowserWindow({
        show:false,
        webPreferences:{
            nodeIntegration:true,
            contextIsolation:false
        }
    });
    let menu=Menu.buildFromTemplate([
        {
            label:"File",
            submenu:[
                {
                    label:"New Window",
                    click:mainwindow,
                    accelerator:"Ctrl+N"
                },
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
                    click:()=>{aboutwindow(win)}
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
function ready(){
    mainwindow();
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
