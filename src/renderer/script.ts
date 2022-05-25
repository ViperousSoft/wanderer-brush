import {ipcRenderer} from "electron";
import {EventEmitter} from "events";
declare const msgpack:{
    encode:(tuple:any[])=>Uint8Array
};
interface BrushEventMap{
    "progress":(tot:number,fin:number,closed:number)=>void;
    "stopping":()=>void;
    "stopped":()=>void;
    "error":(message:string)=>void;
}
class Brush extends EventEmitter{
    wsurl:string;
    iid:number|null;
    tot:number;
    fin:number;
    closed:number;
    gn:string;
    tn:string;
    mode:string;
    cnt:number;
    stopping:boolean;
    constructor(wsurl:string,gn:string,tn:string,mode:string,cnt:number){
        super();
        this.wsurl=wsurl;
        this.iid=null;
        this.tot=this.fin=this.closed=0;
        this.gn=gn;
        this.tn=tn;
        this.mode=mode;
        this.cnt=cnt;
        this.stopping=false;
        this.setMaxListeners(0);
    }
    start(){
        if(this.iid!=null){
            window.clearInterval(this.iid);
        }
        ipcRenderer.send("tostop");
        setmsg("msg","info","Brushing");
        gete("stop").toggleAttribute("disabled");
        this.tot=this.fin=this.closed=0;
        this.iid=window.setInterval(()=>{
            new Promise((res,rej)=>{
                this.tot++;
                this.emit("progress",this.tot,this.fin,this.closed);
                try{
                    let sk=new WebSocket(this.wsurl);
                    sk.addEventListener("close",()=>{
                        if("sent" in sk){
                            this.fin++;
                        }
                        else{
                            this.closed++;
                        }
                        this.emit("progress",this.tot,this.fin,this.closed);
                        if(this.tot===this.fin+this.closed){
                            this.emit("stopped");
                        }
                    });
                    closer.once("close",()=>{sk.close();});
                    sk.addEventListener("close",res);
                    sk.addEventListener("open",()=>{
                        sk.send(msgpack.encode(["hello",{name:this.tn,group:this.gn,mode:this.mode}]));
                        Object.defineProperty(sk,"sent",{value:true});
                        window.setTimeout(()=>{sk.close();},300);
                    });
                }
                catch(e){
                    rej(e);
                }
            }).catch(e=>{
                stop();
                this.emit("error",e.message);
            });
        },this.cnt);
    }
    stop(){
        if(this.iid!=null){
            window.clearInterval(this.iid);
            this.iid=null;
        }
        this.emit("stopping");
        this.stopping=true;
        closer.emit("close");
    }
    on<K extends keyof BrushEventMap>(eventName: K, listener: BrushEventMap[K]): this {
        return super.on(eventName,listener);
    }
    emit<K extends keyof BrushEventMap>(eventName: K, ...args: Parameters<BrushEventMap[K]>): boolean {
        return super.emit(eventName,args);
    }
}
interface BlockEventMap{
    "progress":(tot:number)=>void;
    "error":(message:string)=>void;
}
class Block extends EventEmitter{
    wsurl:string;
    iid:number|null;
    tot:number;
    constructor(wsurl:string){
        super();
        this.wsurl=wsurl;
        this.iid=null;
        this.tot=0;
        this.setMaxListeners(0);
    }
    on<K extends keyof BlockEventMap>(eventName: K, listener: BlockEventMap[K]): this {
        return super.on(eventName,listener);
    }
    emit<K extends keyof BlockEventMap>(eventName: K, ...args: Parameters<BlockEventMap[K]>): boolean {
        return super.emit(eventName,args);
    }
}

let brush:Brush;
let prog=gete("prog");
let prog2=gete("prog2");
let progbar=gete("progbar");
let prognum=gete("prognum");
function makebrush(brush:Brush){
    brush.on("progress",(tot,fin,closed)=>{
        if(prognum.hasAttribute("nodisplay")){
            prognum.toggleAttribute("nodisplay");
            progbar.toggleAttribute("nodisplay");
        }
        prognum.innerHTML=`<span style="color: green;">${fin}</span>&nbsp;&nbsp;&nbsp;<span style="color: grey;">${closed}</span>&nbsp;&nbsp;&nbsp;${tot}`;
        prog.style.width=`${fin*100/tot}%`;
        prog2.style.width=`${closed*100/tot}%`;
    });
    brush.on("error",(message)=>{
        setmsg("msg","error",message);
    })
    brush.on("stopping",()=>{
        ipcRenderer.send("stopping");
        setmsg("msg","info","Stopping");
        gete("stop").toggleAttribute("disabled");
    });
    brush.on("stopped",()=>{
        ipcRenderer.send("stopped");
        setmsg("msg","info","Stopped");
        gete("start").toggleAttribute("disabled");
        let inputs=document.getElementsByTagName("input");
        for(let i=0;i<inputs.length;i++){
            inputs[i].toggleAttribute("disabled");
        }
    });
}


function gete(id:string){
    let k=document.getElementById(id);
    if(!k)throw new Error();
    return k;
}
function sleep(ms:number){
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
function setmsg(e:string,type:string,msg:string){
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
    let inputs=document.getElementsByTagName("input");
    for(let i=0;i<inputs.length;i++){
        inputs[i].toggleAttribute("disabled");
    }
    if((gete("wsurl") as HTMLInputElement).value!==""){
        brush=new Brush((gete("wsurl") as HTMLInputElement).value,gn,tn,mode,cnt);
        makebrush(brush);
        brush.start();
    }
    else{
        setmsg("msg","info","Fetching WebSocket URL");
        ipcRenderer.send("got",mode,gn);
    }
}
function stop(){
    brush.stop();
}
function data():[string,string,string,number]{
    let gn=(gete("gn") as HTMLInputElement).value,tn=(gete("tn") as HTMLInputElement).value,mode=(gete("castle") as HTMLInputElement).checked?"Castle":"Sandbox",cnt=parseInt((gete("cnt") as HTMLInputElement).value);
    return [gn,tn,mode,cnt];
}
ipcRenderer.on("gotr",(e,a)=>{
    (gete("wsurl") as HTMLInputElement).value=a;
    let [gn,tn,mode,cnt]=data();
    brush=new Brush(a,gn,tn,mode,cnt);
    makebrush(brush);
    brush.start();
});
ipcRenderer.on("start",()=>{
    start();
});
ipcRenderer.on("stop",()=>{
    stop();
});
window.onload=()=>{
    closer.setMaxListeners(0);
    let inputs=document.getElementsByTagName("input");
    for(let i=0;i<inputs.length;i++){
        inputs[i].setAttribute("spellcheck","false");
    }
};
export {start,stop};
