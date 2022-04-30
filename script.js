const {ipcRenderer}=require("electron");
const {EventEmitter}=require("events");
let wsurl,iid=null;
let tot,fin,closed;

function prog(){
    let prognum=gete("prognum");
    let prog=gete("prog");
    let prog2=gete("prog2");
    let progbar=gete("progbar");
    if(prognum.hasAttribute("nodisplay")){
        prognum.toggleAttribute("nodisplay");
        progbar.toggleAttribute("nodisplay");
    }
    prognum.innerHTML=`<span style="color: green;">${fin}</span>&nbsp;&nbsp;&nbsp;<span style="color: grey;">${closed}</span>&nbsp;&nbsp;&nbsp;${tot}`;
    prog.style.width=`${fin*100/tot}%`;
    prog2.style.width=`${closed*100/tot}%`;
}
function finprog(){
    let prognum=gete("prognum");
    let progbar=gete("progbar");
    prognum.toggleAttribute("nodisplay");
    progbar.toggleAttribute("nodisplay");
}


function gete(id){
    return document.getElementById(id);
}
function sleep(ms){
    return new Promise(res=>{
        window.setTimeout(res,ms);
    });
}
/*async function man(gn,tn,mode){
    let fin=true;
    let sk=new WebSocket(wsurl);
    sk.addEventListener("open",()=>{
        if(brushing){
            sk.send(msgpack.encode(["hello",{name:tn,group:gn,mode:mode}]));
            //sk.send(msgpack.encode(["close"]));
            //sk.send(msgpack.encode(["hello",{name:tn,group:gn,mode:mode}])); 
            //sk.send(msgpack.encode(["close"]));
            //sk.send(msgpack.encode(["hello",{name:tn,group:gn,mode:mode}]));
            //sk.send(msgpack.encode(["close"]));
            //sk.send(msgpack.encode(["bbb",{name:tn,group:gn,mode:mode}]));
            //sk.send(msgpack.encode(["hello",{name:tn,group:gn,mode:mode}]));
            //sk.send(msgpack.encode(["bbb",{name:tn,group:gn,mode:mode}]));
            
        }
            
        window.setTimeout(()=>{
            sk.close();
        },300);
    });
    sk.addEventListener("close",()=>{
        fin=false;
    });
    while(fin){
        await sleep(20);
    }
    return;
}*/
let closer=new EventEmitter();
function brush(gn,tn,mode,cnt){
    if(iid!=null){
        window.clearInterval(iid);
    }
    ipcRenderer.send("tostop");
    setmsg("msg","info","Brushing");
    gete("stop").toggleAttribute("disabled");
    tot=fin=closed=0;
    iid=window.setInterval(()=>{
        new Promise((res,rej)=>{
            tot++;
            prog();
            try{
                let sk=new WebSocket(wsurl);
                sk.addEventListener("close",()=>{
                    if(sk.sent){
                        fin++;
                    }
                    else{
                        closed++;
                    }
                    prog();
                });
                closer.once("close",()=>{sk.close();});
                sk.addEventListener("close",res);
                sk.addEventListener("open",()=>{
                    sk.send(msgpack.encode(["hello",{name:tn,group:gn,mode:mode}]));
                    sk.sent=true;
                    window.setTimeout(()=>{sk.close();},300);
                });
            }
            catch(e){
                rej(e);
            }
        }).catch(e=>{
            stop().then(()=>{
                setmsg("msg","error",e.message);
            });
        });
    },cnt);
}
/*function brush(gn,tn,mode,cnt){
    brushing=true;
    for(let i=0;i<cnt;i++){
        (async()=>{
            while(brushing){
                await man(gn,tn,mode);
            }
            return;
        })();
    }
    /*let a=async()=>{
        while(brushing){
            await man(gn,tn,mode);
        }
        return;
    };
    Promise.all([a(),a(),a(),a(),a(),a()]);*\/
}*/
/*async function brush(gn,tn,mode,cnt){
    brushing=true;
    let l=[];
    let fin=true;
    for(let i=0;i<cnt;i++){
        l.push(new WebSocket(wsurl));
        l[i].addEventListener("close",(e)=>{
            console.log(i,"closed",e.code);
        });
        l[i].addEventListener("open",(e)=>{
            console.log(i,"opened");
        });
        l[i].addEventListener("error",(e)=>{
            console.log(i,"error");
        });
        console.log(i);
        await sleep(5000);
    }
    l[cnt-1].addEventListener("open",async()=>{
        for(let i=0;i<cnt;i++){
            try{
                l[i].send(msgpack.encode(["hello",{name:tn,group:gn,mode:mode}]));
            }
            catch(e){
                
            }
            
            console.log(i,"hello");
            await sleep(6);
        }
        fin=false;
    });
    while(fin){
        await sleep(20);
    }
    for(let i=0;i<cnt;i++){
        l[i].close();
    }
    return;
}*/
function setmsg(e,type,msg){
    let k=gete(e);
    k.innerHTML=msg;
    k.setAttribute("status",type);
}
function start(){
    let [gn,tn,mode,cnt]=data();
    if(isNaN(cnt)||cnt<=0){
        setmsg("msg","error","Illegal argument: Interval");
        return;
    }
    ipcRenderer.send("started");
    gete("start").toggleAttribute("disabled");
    for(let k of document.getElementsByTagName("input")){
        k.toggleAttribute("disabled");
    }
    if(gete("wsurl").value!==""){
        wsurl=gete("wsurl").value;
        brush(gn,tn,mode,cnt);
    }
    else{
        setmsg("msg","info","Fetching WebSocket URL");
        ipcRenderer.send("got",mode,gn);
    }
}
async function stop(){
    if(iid!=null){
        window.clearInterval(iid);
        iid=null;
    }
    closer.emit("close");
    ipcRenderer.send("stopping");
    setmsg("msg","info","Stopping");
    gete("stop").toggleAttribute("disabled");
    while(fin+closed!=tot){
        await sleep(5);
    }
    ipcRenderer.send("stopped");
    setmsg("msg","info","Stopped");
    gete("start").toggleAttribute("disabled");
    
    for(let k of document.getElementsByTagName("input")){
        k.toggleAttribute("disabled");
    }
}
function data(){
    let gn=gete("gn").value,tn=gete("tn").value,mode=gete("castle").checked?"Castle":"Sandbox",cnt=parseInt(gete("cnt").value);
    return [gn,tn,mode,cnt];
}
ipcRenderer.on("gotr",(e,a)=>{
    gete("wsurl").value=wsurl=a;
    let [gn,tn,mode,cnt]=data();
    brush(gn,tn,mode,cnt);
});
ipcRenderer.on("start",()=>{
    start();
});
ipcRenderer.on("stop",()=>{
    stop();
});
window.onload=()=>{
    closer.setMaxListeners(0);
    for(let k of document.getElementsByTagName("input")){
        k.setAttribute("spellcheck","false")
    }
};
