const {ipcRenderer}=require("electron");
let wsurl,brushing,iid;

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
function brush(gn,tn,mode,cnt){
    if(iid!=null){
        window.clearInterval(iid);
    }
    brushing=true;
    console.log(cnt);
    iid=window.setInterval(()=>{
        new Promise((res,rej)=>{
            try{
                let sk=new WebSocket(wsurl);
                sk.addEventListener("open",()=>{
                    if(brushing)sk.send(msgpack.encode(["hello",{name:tn,group:gn,mode:mode}]));
                    window.setTimeout(()=>{sk.close();},300);
                });
                sk.addEventListener("close",res);
            }
            catch{
                rej();
            }
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
function start(){
    gete("start").toggleAttribute("disabled");
    gete("stop").toggleAttribute("disabled");
    for(let k of document.getElementsByTagName("input")){
        k.toggleAttribute("disabled");
    }
    let [gn,tn,mode,cnt]=data();
    if(gete("wsurl").value!==""){
        wsurl=gete("wsurl").value;
        brush(gn,tn,mode,cnt);
    }
    else{
        ipcRenderer.send("got",mode,gn);
    }
}
function stop(){
    if(!brushing)return;
    brushing=false;
    if(iid!=null){
        window.clearInterval(iid);
        iid=null;
    }
    gete("start").toggleAttribute("disabled");
    gete("stop").toggleAttribute("disabled");
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
window.onload=()=>{
    for(let k of document.getElementsByTagName("input")){
        k.setAttribute("spellcheck","false")
    }
};