const htmls={
    intro:
    `
    <h1>Introduction</h1>
    <p>Wanderer Brush is a tool with which you can do whatever you want in the <a href="javascript:void(0)" onclick="openurl('https://wanderers.io')">wanderers.io</a> game.</p>
    <p>So far, generating robot players is the only available function.</p>
    <p>To learn more, click a menu item on the left.</p>
    `,
    gbots:
    `
    <h1>Generating Bots</h1>
    <p>This function helps you dominate the map.</p>
    <p>To begin with, the group name and tribe name you enter will be exactly send to the server. If you leave the group name empty, lots of red and brown players will spawn. If you leave the tribe name empty, the bots' names will be like 'Tribe12345', the same as a random name given to the player when the group name is not specified.</p>
    <p>Secondly, if you don't see any bot tribe when running this function, press F12 in your browser and open the console. Enter <i>CLIENT.Game.socket.url</i> and see if the output is identical to the fetched WebSocket URL. If so, just wait. If not so, you have to fill in the item with the URL shown in your browser.</p>
    <p>What's more, don't generate bots too frequently on one computer, or you risk being disconnected.</p>
    <p>Note that you have to open at least one tab in your browser to ensure the bots join the correct team.</p>
    `
};
window.onload=()=>{
    for(let k of document.querySelectorAll("ul.sidebar")){
        let fid=k.firstElementChild.firstElementChild.id;
        k.active=fid;
        let con=document.getElementById(k.getAttribute("content"));
        con.innerHTML=htmls[k.active];
        for(let p of k.children){
            if(p.firstElementChild.id==fid){
                p.firstElementChild.classList.add("active");
            }
            else{
                p.firstElementChild.classList.add("inactive");
            }
        }
    }
    for(let k of document.querySelectorAll("li a")){
        k.setAttribute("onclick","act(this)");
        k.setAttribute("href","javascript:void(0)");
    }
}

function act(e){
    if(e.classList.contains("active"))return;
    let p=e.parentElement.parentElement;
    let r=document.getElementById(p.active);
    let con=document.getElementById(p.getAttribute("content"));
    htmls[p.active]=con.innerHTML;
    con.innerHTML=htmls[e.id];
    p.active=e.id;
    r.classList.replace("active","inactive");
    e.classList.replace("inactive","active");
}
